"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { slugify } from "@/lib/utils"

export function CreatePageButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const title = formData.get("title") as string
    const slug = slugify(title)

    try {
      const response = await fetch("/api/pages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
        }),
      })

      if (!response.ok) {
        throw new Error("Une erreur est survenue")
      }

      const page = await response.json()
      toast.success("Page créée avec succès")
      router.push(`/dashboard/pages/${page.id}/edit`)
      router.refresh()
    } catch (error) {
      toast.error("Erreur lors de la création de la page")
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle page
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle page</DialogTitle>
          <DialogDescription>
            Donnez un titre à votre page. Vous pourrez ajouter des liens et personnaliser la page après sa création.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ma page de liens"
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer la page"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 