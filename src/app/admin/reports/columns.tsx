"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistance } from "date-fns"
import { fr } from "date-fns/locale"
import { useState } from "react"
import { ReportDetailsDialog } from "@/components/admin/report-details-dialog"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export type Report = {
  id: string
  type: "link" | "page"
  title: string
  reason: string
  details: string
  reportedBy: string
  createdAt: Date
}

export const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant={row.original.type === "link" ? "default" : "secondary"}>
        {row.original.type === "link" ? "Lien" : "Page"}
      </Badge>
    ),
  },
  {
    accessorKey: "title",
    header: "Titre",
  },
  {
    accessorKey: "reason",
    header: "Raison",
  },
  {
    accessorKey: "reportedBy",
    header: "Signalé par",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <span>
        {formatDistance(new Date(row.original.createdAt), new Date(), {
          addSuffix: true,
          locale: fr,
        })}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const report = row.original
      const [showDetails, setShowDetails] = useState(false)
      const [loading, setLoading] = useState(false)
      const { toast } = useToast()
      const router = useRouter()

      async function handleDelete() {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce signalement ?")) {
          return
        }

        setLoading(true)
        try {
          const response = await fetch(`/api/admin/reports/${report.id}`, {
            method: "DELETE",
          })

          if (!response.ok) {
            throw new Error("Erreur lors de la suppression")
          }

          toast({
            title: "Signalement supprimé",
            description: "Le signalement a été supprimé avec succès.",
          })
          
          router.refresh()
        } catch (error) {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la suppression.",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }

      return (
        <>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(true)}
            >
              Détails
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Suppression..." : "Supprimer"}
            </Button>
          </div>
          <ReportDetailsDialog
            report={report}
            open={showDetails}
            onOpenChange={setShowDetails}
          />
        </>
      )
    },
  },
] 