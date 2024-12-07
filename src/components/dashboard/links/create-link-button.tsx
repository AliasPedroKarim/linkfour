"use client"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

interface CreateLinkButtonProps {
  pages?: {
    id: string
    title: string
  }[]
}

export function CreateLinkButton({ pages }: CreateLinkButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const title = formData.get("title") as string
    const url = formData.get("url") as string
    const pageId = formData.get("pageId") as string

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          url,
          pageId: pageId || undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la création du lien")
      }

      const link = await response.json()
      router.refresh()
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau lien
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un nouveau lien</DialogTitle>
          <DialogDescription>
            Ajoutez un lien vers n'importe quelle URL. Vous pouvez l'ajouter à une page existante ou le garder indépendant.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              placeholder="Mon super lien"
              required
            />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              placeholder="https://example.com"
              required
            />
          </div>
          {pages && (
            <div>
              <Label htmlFor="pageId">Page (optionnel)</Label>
              <Select name="pageId">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une page" />
                </SelectTrigger>
                <SelectContent>
                  {pages.map((page) => (
                    <SelectItem key={page.id} value={page.id}>
                      {page.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Création..." : "Créer le lien"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 