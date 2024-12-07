import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTA() {
  return (
    <section className="border-t">
      <div className="container py-20">
        <div className="relative rounded-lg overflow-hidden bg-primary px-6 py-16 sm:px-12 sm:py-24 md:py-32 text-center">
          <div className="relative z-10 mx-auto max-w-2xl space-y-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Prêt à commencer votre page de liens ?
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Créez votre compte gratuitement en quelques secondes et commencez à partager vos liens avec style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/auth/register">
                  Créer un compte gratuit
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-primary-foreground/10">
                <Link href="/pricing">
                  Voir les tarifs
                </Link>
              </Button>
            </div>
          </div>
          <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-foreground/20 to-transparent" />
        </div>
      </div>
    </section>
  )
} 