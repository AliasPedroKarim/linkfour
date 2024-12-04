import { Button } from "@/components/ui/button"
import { SignInButton } from "@/components/auth/sign-in-button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

export function Nav() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold">
            LinkTree Clone
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link href="/features">Fonctionnalités</Link>
            <Link href="/pricing">Tarifs</Link>
            <Link href="/about">À propos</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SignInButton />
        </div>
      </div>
    </header>
  )
} 