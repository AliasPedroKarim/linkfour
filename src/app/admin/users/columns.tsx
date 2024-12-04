"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Ban } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

export type User = {
  id: string
  name: string
  email: string
  pagesCount: number
  linksCount: number
  createdAt: string
  status: "Vérifié" | "Non vérifié"
  isBanned: boolean
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Nom",
    cell: ({ row }) => (
      <Link
        to={`/admin/users/${row.original.id}`}
        className="hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "pagesCount",
    header: "Pages",
  },
  {
    accessorKey: "linksCount",
    header: "Liens",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "Vérifié" ? "default" : "secondary"}
        className={cn(
          row.original.status === "Vérifié" ? "bg-green-100 text-green-800" : ""
        )}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date d'inscription",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      const router = useRouter()
      const { toast } = useToast()
      const [loading, setLoading] = useState(false)

      async function handleBan() {
        if (!confirm(`Êtes-vous sûr de vouloir bannir ${user.name} ?`)) {
          return
        }

        setLoading(true)
        try {
          const response = await fetch(`/api/admin/users/${user.id}/ban`, {
            method: "POST",
          })

          if (!response.ok) {
            const error = await response.text()
            throw new Error(error)
          }

          toast({
            title: "Utilisateur banni",
            description: "L'utilisateur a été banni avec succès.",
          })
          
          router.refresh()
        } catch (error) {
          toast({
            title: "Erreur",
            description: error instanceof Error ? error.message : "Une erreur est survenue",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir le menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copier l'ID utilisateur
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={handleBan}
              disabled={loading}
            >
              <Ban className="mr-2 h-4 w-4" />
              {loading ? "Bannissement..." : "Bannir l'utilisateur"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 