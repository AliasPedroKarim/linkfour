"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function DangerZone() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function deleteAccount() {
    setIsLoading(true)

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Une erreur est survenue")
      }

      toast.success("Compte supprimé avec succès")
      router.push("/")
    } catch (error) {
      toast.error("Erreur lors de la suppression du compte")
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="rounded-lg border border-destructive p-8">
      <h2 className="text-xl font-semibold text-destructive mb-4">Zone de danger</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Une fois votre compte supprimé, toutes vos données seront définitivement effacées.
        Cette action est irréversible.
      </p>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="destructive">
            Supprimer mon compte
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Êtes-vous sûr ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. Toutes vos pages, liens et données seront
              définitivement supprimés.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={deleteAccount}
              disabled={isLoading}
            >
              {isLoading ? "Suppression..." : "Supprimer mon compte"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 