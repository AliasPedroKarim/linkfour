export const siteConfig = {
  name: "LinkFour",
  description: "Plateforme de gestion de liens personnalisés",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "https://linkfour.com/og.jpg",
  links: {
    twitter: "https://twitter.com/linkfour",
    github: "https://github.com/linkfour",
  },
  creator: {
    name: "LinkFour Team",
    twitter: "@linkfour",
  },
}

export const navConfig = {
  mainNav: [
    {
      title: "Accueil",
      href: "/",
    },
    {
      title: "Tableau de bord",
      href: "/dashboard",
    },
    {
      title: "Paramètres",
      href: "/settings",
    },
  ],
} 