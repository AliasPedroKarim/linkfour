import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link2, BarChart2, Palette, Globe } from "lucide-react"

const features = [
  {
    title: "Liens illimités",
    description: "Créez autant de liens et de pages que vous le souhaitez, sans limite.",
    icon: Link2,
  },
  {
    title: "Statistiques détaillées",
    description: "Suivez les performances de vos liens avec des statistiques en temps réel.",
    icon: BarChart2,
  },
  {
    title: "Personnalisation complète",
    description: "Personnalisez l'apparence de vos pages selon votre style.",
    icon: Palette,
  },
  {
    title: "Domaine personnalisé",
    description: "Utilisez votre propre domaine pour vos liens (version Pro).",
    icon: Globe,
  },
]

export function Features() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">Tout ce dont vous avez besoin</h2>
          <p className="text-xl text-muted-foreground">
            Des fonctionnalités puissantes pour gérer et partager vos liens efficacement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-32 h-32 bg-primary/10 rounded-full" />
                <CardHeader>
                  <Icon className="w-10 h-10 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
} 