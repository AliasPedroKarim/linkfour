"use client"

import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SignInButton() {
  const { data: session } = useSession()

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            {session.user.name || session.user.email}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <a href="/dashboard">Tableau de bord</a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href="/profile">Profil</a>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()}>
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={() => signIn()}>
      Connexion
    </Button>
  )
} 