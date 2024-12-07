"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus, GripVertical, X } from "lucide-react"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"

interface PageLinksProps {
  pageId: string
  initialLinks: {
    id: string
    title: string
    url: string
    order: number
    _count: {
      clicks: number
    }
  }[]
}

export function PageLinks({ pageId, initialLinks }: PageLinksProps) {
  const [links, setLinks] = useState(initialLinks)
  const [loading, setLoading] = useState(false)
  const [newLink, setNewLink] = useState({ title: "", url: "" })

  async function addLink(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newLink,
          pageId,
          order: links.length,
        }),
      })

      if (!response.ok) {
        throw new Error("Une erreur est survenue")
      }

      const link = await response.json()
      setLinks([...links, link])
      setNewLink({ title: "", url: "" })
      toast.success("Lien ajouté avec succès")
    } catch (error) {
      toast.error("Erreur lors de l'ajout du lien")
    } finally {
      setLoading(false)
    }
  }

  async function removeLink(linkId: string) {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Une erreur est survenue")
      }

      setLinks(links.filter((link) => link.id !== linkId))
      toast.success("Lien supprimé avec succès")
    } catch (error) {
      toast.error("Erreur lors de la suppression du lien")
    }
  }

  async function reorderLinks(result: any) {
    if (!result.destination) return

    const items = Array.from(links)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updatedLinks = items.map((item, index) => ({
      ...item,
      order: index,
    }))

    setLinks(updatedLinks)

    try {
      const response = await fetch(`/api/pages/${pageId}/links/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          links: updatedLinks.map((link) => ({
            id: link.id,
            order: link.order,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("Une erreur est survenue")
      }

      toast.success("Ordre mis à jour avec succès")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'ordre")
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={addLink} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              placeholder="Mon super lien"
              required
            />
          </div>
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              placeholder="https://example.com"
              required
            />
          </div>
        </div>
        <Button type="submit" disabled={loading}>
          <Plus className="mr-2 h-4 w-4" />
          {loading ? "Ajout..." : "Ajouter un lien"}
        </Button>
      </form>

      <DragDropContext onDragEnd={reorderLinks}>
        <Droppable droppableId="links">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {links.map((link, index) => (
                <Draggable
                  key={link.id}
                  draggableId={link.id}
                  index={index}
                >
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-move"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{link.title}</p>
                          <p className="text-sm text-muted-foreground truncate">
                            {link.url}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {link._count.clicks} clics
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLink(link.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
} 