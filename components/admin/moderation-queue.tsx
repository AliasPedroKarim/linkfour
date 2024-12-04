"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { formatDistance } from "date-fns"
import { fr } from "date-fns/locale"

interface ModerationItem {
  id: string
  type: "link" | "page"
  title: string
  url?: string
  reportCount: number
  createdAt: Date
  userId: string
  userName: string
}

interface ModerationQueueProps {
  items: ModerationItem[]
}

export function ModerationQueue({ items }: ModerationQueueProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  async function handleAction(id: string, action: "approve" | "reject") {
    setLoading(id)
    try {
      const response = await fetch(`/api/admin/moderation/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la modération")
      }

      toast({
        title: "Action effectuée",
        description: action === "approve" ? "Contenu approuvé" : "Contenu rejeté",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-lg font-medium">File d'attente de modération</h2>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Signalements</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge variant={item.type === "link" ? "default" : "secondary"}>
                      {item.type === "link" ? "Lien" : "Page"}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.userName}</TableCell>
                  <TableCell>{item.reportCount}</TableCell>
                  <TableCell>
                    {formatDistance(new Date(item.createdAt), new Date(), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(item.id, "approve")}
                        disabled={loading === item.id}
                      >
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction(item.id, "reject")}
                        disabled={loading === item.id}
                      >
                        Rejeter
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  )
} 