import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Instagram, Twitter, Youtube, Github, Globe } from "lucide-react"

const socialLinks = [
  {
    title: "Site Web",
    url: "https://example.com",
    icon: Globe,
  },
  {
    title: "Twitter",
    url: "https://twitter.com",
    icon: Twitter,
    color: "hover:bg-[#1DA1F2] hover:text-white",
  },
  {
    title: "Instagram",
    url: "https://instagram.com",
    icon: Instagram,
    color: "hover:bg-[#E4405F] hover:text-white",
  },
  {
    title: "YouTube",
    url: "https://youtube.com",
    icon: Youtube,
    color: "hover:bg-[#FF0000] hover:text-white",
  },
  {
    title: "GitHub",
    url: "https://github.com",
    icon: Github,
    color: "hover:bg-[#181717] hover:text-white",
  },
]

const featuredLinks = [
  {
    title: "Mon dernier article de blog",
    description: "Découvrez mes dernières réflexions sur le développement web",
    url: "https://example.com/blog",
  },
  {
    title: "Mon portfolio",
    description: "Consultez mes projets récents et mes réalisations",
    url: "https://example.com/portfolio",
  },
  {
    title: "Newsletter",
    description: "Abonnez-vous pour recevoir mes actualités",
    url: "https://example.com/newsletter",
  },
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container max-w-3xl mx-auto px-4 py-20">
        {/* Profile Section */}
        <div className="text-center space-y-4 mb-12">
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src="/images/avatar-demo.jpg" alt="John Doe" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">John Doe</h1>
            <p className="text-muted-foreground">
              Développeur Full Stack & Créateur de Contenu
            </p>
          </div>
          <p className="max-w-lg mx-auto">
            Je crée du contenu sur le développement web, partage mes expériences et aide les autres développeurs à progresser.
          </p>
        </div>

        {/* Social Links */}
        <div className="grid gap-4 mb-12">
          {socialLinks.map((link) => (
            <Button
              key={link.title}
              variant="outline"
              className={`w-full h-12 text-lg transition-colors ${link.color}`}
              asChild
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <link.icon className="mr-2 h-5 w-5" />
                {link.title}
              </a>
            </Button>
          ))}
        </div>

        {/* Featured Links */}
        <div className="grid gap-4">
          {featuredLinks.map((link) => (
            <Card key={link.title} className="p-6 hover:shadow-lg transition-shadow">
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <h2 className="font-semibold mb-1">{link.title}</h2>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </a>
            </Card>
          ))}
        </div>

        {/* Try It Now */}
        <div className="mt-16 text-center space-y-4">
          <p className="text-muted-foreground">
            Vous aimez cette page ? Créez la vôtre gratuitement !
          </p>
          <Button asChild size="lg">
            <a href="/auth/register">Créer ma page</a>
          </Button>
        </div>
      </div>
    </div>
  )
} 