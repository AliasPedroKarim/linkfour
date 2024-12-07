import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container py-20">
      <div className="max-w-3xl mx-auto space-y-16">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">Notre mission</h1>
          <p className="text-xl text-muted-foreground">
            LinkFour a été créé avec une vision simple : permettre à chacun de partager facilement ses liens importants dans une page personnalisée et élégante.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Une solution simple et puissante</h2>
            <p className="text-muted-foreground">
              Nous croyons que la simplicité ne doit pas sacrifier la puissance. C'est pourquoi nous offrons une interface intuitive couplée à des fonctionnalités avancées pour répondre à tous les besoins.
            </p>
          </div>
          <div className="relative aspect-video">
            <Image
              src="/images/dashboard-preview.png"
              alt="Aperçu du tableau de bord"
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="text-xl font-bold">Pour les créateurs</h3>
            <p className="text-muted-foreground">
              Centralisez tous vos liens dans une page professionnelle et suivez vos performances.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold">Pour les entreprises</h3>
            <p className="text-muted-foreground">
              Créez des pages de liens pour vos produits, services et campagnes marketing.
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold">Pour tous</h3>
            <p className="text-muted-foreground">
              Une solution simple pour partager vos liens importants avec style.
            </p>
          </div>
        </div>

        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Prêt à commencer ?</h2>
          <Button asChild size="lg">
            <Link href="/auth/register">
              Créer un compte gratuitement
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 