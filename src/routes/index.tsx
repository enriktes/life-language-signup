import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Check, PlayCircle, Users } from "lucide-react";
import heroImage from "@/assets/english-for-life-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "English for Life 101 — Aprende inglés para tu día a día" },
      {
        name: "description",
        content:
          "English for Life 101: clases en vivo, material práctico y una comunidad que te impulsa a hablar inglés con confianza. Suscripción mensual de $600 MXN.",
      },
      { property: "og:title", content: "English for Life 101 — Aprende inglés para tu día a día" },
      {
        property: "og:description",
        content:
          "Clases en vivo, material práctico y comunidad. Aprende inglés con confianza por $600 MXN al mes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "English for Life 101" },
      {
        name: "twitter:description",
        content: "Clases en vivo, material práctico y comunidad para hablar inglés con confianza.",
      },
      { property: "og:image", content: heroImage },
      { name: "twitter:image", content: heroImage },
    ],
  }),
  component: Index,
});

const features = [
  "4 clases en vivo por mes",
  "Material de estudio incluido",
  "Grupo de práctica en comunidad",
  "Acceso a grabaciones",
];

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            English for Life 101
          </span>
          <nav className="hidden gap-6 text-sm font-medium text-muted-foreground sm:flex">
            <a href="#incluye" className="hover:text-foreground">
              Qué incluye
            </a>
            <a href="#comunidad" className="hover:text-foreground">
              Comunidad
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
          <div className="max-w-xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-amber" />
              Nuevo grupo abierto
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Inglés que sí usas en tu vida real.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              English for Life 101 te da clases en vivo, ejercicios prácticos y una comunidad que
              te motiva a hablar desde el primer día. Sin traducciones forzadas, sin complicaciones.
            </p>
            <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <Button variant="cta" size="xl">
                Suscribirme por $600 MXN/mes
              </Button>
              <span className="text-sm text-muted-foreground">Cancela cuando quieras.</span>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            <img
              src={heroImage}
              alt="Grupo de adultos aprendiendo inglés en un salón moderno y luminoso"
              width={1344}
              height={768}
              className="h-auto w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </section>

        <section id="incluye" className="border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Todo lo que necesitas para avanzar
              </h2>
              <p className="mt-4 text-muted-foreground">
                Un plan sencillo enfocado en conversación, comprensión y confianza.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-4 rounded-xl border border-border bg-background p-5 shadow-sm"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="comunidad" className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-secondary p-6">
                <Users className="h-8 w-8 text-navy" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">Grupos reducidos</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Máximo 12 personas por clase para que puedas participar de verdad.
                </p>
              </div>
              <div className="rounded-2xl bg-secondary p-6">
                <PlayCircle className="h-8 w-8 text-navy" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">Clases en vivo</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sesiones interactivas con un instructor que corrige en el momento.
                </p>
              </div>
            </div>
            <div className="max-w-md">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Aprende con personas como tú
              </h2>
              <p className="mt-4 text-muted-foreground">
                Nuestra comunidad está llena de personas que quieren usar el inglés en el trabajo,
                viajes y vida cotidiana. Practicas en un ambiente seguro, sin juicios.
              </p>
              <div className="mt-8">
                <Button variant="cta" size="lg">
                  Suscribirme por $600 MXN/mes
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-navy py-16 text-primary-foreground lg:py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Empieza hoy mismo
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Tu primera clase te espera. Únete por $600 MXN al mes y empieza a hablar con
              confianza.
            </p>
            <div className="mt-8">
              <Button
                variant="cta"
                size="xl"
                className="bg-cta text-cta-foreground hover:bg-cta/90"
              >
                Suscribirme por $600 MXN/mes
              </Button>
            </div>
            <p className="mt-4 text-sm opacity-75">
              No se requiere tarjeta para explorar. Pago seguro cuando activemos la pasarela.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <span className="text-sm font-medium text-foreground">English for Life 101</span>
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Todos los derechos reservados.
          </span>
        </div>
      </footer>
    </div>
  );
}
