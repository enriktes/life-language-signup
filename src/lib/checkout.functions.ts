import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Nombre demasiado corto").max(120),
  email: z.string().trim().email("Email inválido").max(255),
  timezone: z.string().trim().min(1, "Zona horaria requerida").max(80),
  whatsapp: z.string().trim().max(30).optional(),
  englishLevel: z.string().trim().max(40).optional(),
  isAdult: z.literal(true),
});

type ApplicationInput = z.infer<typeof applicationSchema>;

/**
 * Creates the club_applications row (source of truth for application_id)
 * and then a Stripe Checkout Session that carries that UUID as metadata.
 */
export const createApplicationCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): ApplicationInput => applicationSchema.parse(data))
  .handler(async ({ data }) => {
    const supabaseUrl = process.env["CLUB_SUPABASE_URL"]!;
    const serviceKey = process.env["CLUB_SUPABASE_SERVICE_ROLE_KEY"];
    const anonKey = process.env["CLUB_SUPABASE_ANON_KEY"]!;
    const supabaseKey = serviceKey && serviceKey.length > 0 ? serviceKey : anonKey;
    const stripeKey = process.env["STRIPE_SECRET_KEY"]!;
    const priceId = process.env["STRIPE_PRICE_ID"]!;

    if (!supabaseUrl || !supabaseKey) throw new Error("Supabase no está configurado en el servidor.");
    if (!stripeKey || !priceId) throw new Error("Stripe no está configurado en el servidor.");

    // 1) INSERT real en public.club_applications -> Supabase genera el UUID
    // La URL configurada puede venir con o sin /rest/v1 al final: normalizamos.
    const restBase = supabaseUrl.replace(/\/+$/, "").replace(/\/rest\/v1$/, "");
    const insertRes = await fetch(`${restBase}/rest/v1/club_applications`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        full_name: data.fullName,
        email: data.email,
        timezone: data.timezone,
        whatsapp: data.whatsapp && data.whatsapp.length > 0 ? data.whatsapp : null,
        english_level:
          data.englishLevel && data.englishLevel.length > 0 ? data.englishLevel : null,
        is_adult: true,
      }),
    });

    if (!insertRes.ok) {
      const detail = await insertRes.text();
      console.error("club_applications insert failed", insertRes.status, detail);
      throw new Error("No pudimos registrar tu solicitud. Intenta de nuevo.");
    }

    const rows = (await insertRes.json()) as Array<{ id?: string }>;
    const applicationId = Array.isArray(rows) ? rows[0]?.id : undefined;
    if (!applicationId) {
      throw new Error("La solicitud se creó pero no pudimos leer su identificador.");
    }

    // 2) Stripe Checkout Session con metadata.application_id
    const request = getRequest();
    const origin =
      request.headers.get("origin") ??
      (request.headers.get("referer")
        ? new URL(request.headers.get("referer")!).origin
        : new URL(request.url).origin);

    const params = new URLSearchParams();
    params.set("mode", "subscription");
    params.set("line_items[0][price]", priceId);
    params.set("line_items[0][quantity]", "1");
    params.set("customer_email", data.email);
    params.set("client_reference_id", applicationId);
    params.set("metadata[application_id]", applicationId);
    params.set("subscription_data[metadata][application_id]", applicationId);
    params.set("success_url", `${origin}/?checkout=success&application_id=${applicationId}`);
    params.set("cancel_url", `${origin}/?checkout=cancelled`);

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": `club-app-${applicationId}`,
      },
      body: params.toString(),
    });

    if (!stripeRes.ok) {
      const detail = await stripeRes.text();
      console.error("stripe checkout session failed", stripeRes.status, detail);
      throw new Error("No pudimos iniciar el pago. Intenta de nuevo.");
    }

    const session = (await stripeRes.json()) as { url?: string; id?: string };
    if (!session.url) throw new Error("Stripe no devolvió una URL de pago.");

    return { url: session.url, applicationId };
  });
