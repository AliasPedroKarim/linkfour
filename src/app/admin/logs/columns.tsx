"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export type Log = {
  id: string
  type: "user" | "page" | "link"
  title: string
  user: string
  createdAt: string
  action: string
}

export const columns: ColumnDef<Log>[] = [
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type
      const variants = {
        user: { label: "Utilisateur", variant: "default" },
        page: { label: "Page", variant: "secondary" },
        link: { label: "Lien", variant: "outline" },
      } as const

      return (
        <Badge variant={variants[type].variant}>
          {variants[type].label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "title",
    header: "Titre",
  },
  {
    accessorKey: "user",
    header: "Utilisateur",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
] 