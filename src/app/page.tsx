import { Navbar } from "@/components/landing/navbar"
import { Features } from "@/components/landing/features"
import { Stats } from "@/components/landing/stats"
import { CTA } from "@/components/landing/cta"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="container flex flex-col items-center justify-center gap-8 pt-32 pb-20 text-center">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Partagez tous vos liens <br />
              en une seule page
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Créez une page personnalisée pour partager tous vos liens importants. Simple, élégant et professionnel.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/auth/register">
                  Commencer gratuitement
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/demo">
                  Voir un exemple
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative w-full max-w-5xl">
            <Image
              src="/images/hero.png"
              alt="Aperçu de LinkFour"
              width={1280}
              height={720}
              className="rounded-lg border shadow-2xl"
              priority
            />
          </div>
        </section>

        {/* Stats Section */}
        <Stats />

        {/* Features Section */}
        <Features />

        {/* CTA Section */}
        <CTA />
      </main>
      <Footer />
    </>
  )
} 