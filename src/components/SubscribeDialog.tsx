import { useRef, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createApplicationCheckout } from "@/lib/checkout.functions";

function detectTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  } catch {
    return "";
  }
}

export function SubscribeDialog({ children }: { children: ReactNode }) {
  const startCheckout = useServerFn(createApplicationCheckout);
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [timezone, setTimezone] = useState(detectTimezone);
  const [isAdult, setIsAdult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return; // evita doble solicitud / doble sesión
    setError(null);

    if (!isAdult) {
      setError("Debes confirmar que eres mayor de edad.");
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    try {
      const result = await startCheckout({
        data: {
          fullName: fullName.trim(),
          email: email.trim(),
          timezone: timezone.trim() || detectTimezone(),
          whatsapp: whatsapp.trim() || undefined,
          isAdult: true as const,
        },
      });
      window.location.href = result.url;
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Algo salió mal. Intenta de nuevo en un momento.",
      );
      submittingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (loading) return;
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Completa tu solicitud</DialogTitle>
          <DialogDescription>
            Necesitamos estos datos para crear tu solicitud antes del pago de $600 MXN/mes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre completo</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              maxLength={120}
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={255}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
            <Input
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              maxLength={30}
              autoComplete="tel"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Zona horaria</Label>
            <Input
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              required
              maxLength={80}
            />
            <p className="text-xs text-muted-foreground">Detectada automáticamente, puedes editarla.</p>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="isAdult"
              checked={isAdult}
              onCheckedChange={(checked) => setIsAdult(checked === true)}
            />
            <Label htmlFor="isAdult" className="text-sm font-normal leading-snug">
              Confirmo que soy mayor de edad.
            </Label>
          </div>

          {error ? (
            <p role="alert" className="text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" variant="cta" size="lg" className="w-full" disabled={loading || !isAdult}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creando tu solicitud…
              </>
            ) : (
              "Continuar al pago seguro"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
