import { Button } from "@/components/ui/button"
import Link from "next/link"

const footerLinks = {
  product: [
    { title: "Fonctionnalités", href: "/#features" },
    { title: "Tarifs", href: "/pricing" },
    { title: "FAQ", href: "/faq" },
  ],
  company: [
    { title: "À propos", href: "/about" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
  ],
  legal: [
    { title: "Confidentialité", href: "/privacy" },
    { title: "CGU", href: "/terms" },
    { title: "Mentions légales", href: "/legal" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="font-bold text-xl">
              LinkFour
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              La meilleure façon de partager vos liens importants.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Produit</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Button asChild variant="link" className="h-auto p-0">
                    <Link href={link.href}>{link.title}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Entreprise</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Button asChild variant="link" className="h-auto p-0">
                    <Link href={link.href}>{link.title}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Légal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Button asChild variant="link" className="h-auto p-0">
                    <Link href={link.href}>{link.title}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} LinkFour. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
} 