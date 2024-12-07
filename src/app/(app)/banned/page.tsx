import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BannedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-4xl font-bold">Compte suspendu</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Votre compte a été suspendu pour non-respect des conditions d'utilisation.
          Si vous pensez qu'il s'agit d'une erreur, veuillez nous contacter.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 