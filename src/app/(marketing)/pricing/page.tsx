import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

const plans = [
  {
    name: "Gratuit",
    description: "Parfait pour démarrer",
    price: "0€",
    features: [
      "5 pages",
      "50 liens",
      "Statistiques de base",
      "Personnalisation limitée",
      "Support par email",
    ],
    cta: "Commencer gratuitement",
    href: "/auth/register",
    popular: false,
  },
  {
    name: "Pro",
    description: "Pour les créateurs actifs",
    price: "9€",
    period: "/mois",
    features: [
      "Pages illimitées",
      "Liens illimités",
      "Statistiques avancées",
      "Personnalisation complète",
      "Domaine personnalisé",
      "Support prioritaire",
      "Sans publicité",
    ],
    cta: "Commencer l'essai gratuit",
    href: "/auth/register?plan=pro",
    popular: true,
  },
]

export default function PricingPage() {
  return (
    <div className="container py-20">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl font-bold">Tarifs simples et transparents</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choisissez le plan qui correspond à vos besoins. Changez ou annulez à tout moment.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={plan.popular ? "border-primary shadow-lg" : undefined}
          >
            <CardHeader>
              {plan.popular && (
                <div className="px-3 py-1 text-sm text-primary border border-primary rounded-full w-fit mb-4">
                  Le plus populaire
                </div>
              )}
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground ml-1">{plan.period}</span>
                )}
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-4 w-4 text-primary mr-3" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                asChild
                className="w-full"
                variant={plan.popular ? "default" : "outline"}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-16">
        <h2 className="text-2xl font-bold mb-4">Des questions ?</h2>
        <p className="text-muted-foreground">
          Consultez notre <Link href="/faq" className="underline">FAQ</Link> ou{" "}
          <Link href="/contact" className="underline">contactez-nous</Link>
        </p>
      </div>
    </div>
  )
} 