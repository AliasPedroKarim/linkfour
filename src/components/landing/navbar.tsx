"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SignInButton } from "@/components/auth/sign-in-button"

const navigation = [
  { name: "Fonctionnalités", href: "/#features" },
  { name: "Tarifs", href: "/pricing" },
  { name: "À propos", href: "/about" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl">
              LinkFour
            </Link>
            <div className="hidden md:flex gap-1">
              {navigation.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  className={cn(
                    "text-muted-foreground",
                    (pathname === item.href ||
                      (item.href !== "/" && pathname?.startsWith(item.href))) &&
                      "text-foreground"
                  )}
                >
                  <Link href={item.href}>{item.name}</Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <SignInButton />
          </div>
        </nav>
      </div>
    </header>
  )
} 