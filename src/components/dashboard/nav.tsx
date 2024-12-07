"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SignOutButton } from "@/components/auth/sign-out-button"

const items = [
  {
    title: "Vue d'ensemble",
    href: "/dashboard",
  },
  {
    title: "Mes pages",
    href: "/dashboard/pages",
  },
  {
    title: "Mes liens",
    href: "/dashboard/links",
  },
  {
    title: "Statistiques",
    href: "/dashboard/stats",
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <header className="border-b bg-background">
      <div className="container flex h-16 items-center mx-auto">
        <div className="mr-8">
          <Link href="/" className="font-bold">
            LinkFour
          </Link>
        </div>
        <nav className="flex flex-1 items-center space-x-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </header>
  )
} 