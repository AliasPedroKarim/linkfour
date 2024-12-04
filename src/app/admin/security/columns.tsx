"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export type SecurityLog = {
  id: string
  event: string
  ip: string | null
  userAgent: string | null
  user: string
  details: string
  createdAt: string
}

const eventVariants = {
  login: { label: "Connexion", variant: "default" },
  logout: { label: "Déconnexion", variant: "secondary" },
  password_change: { label: "Changement MDP", variant: "warning" },
  email_change: { label: "Changement Email", variant: "warning" },
  account_banned: { label: "Bannissement", variant: "destructive" },
  account_unbanned: { label: "Débannissement", variant: "success" },
  admin_access: { label: "Accès Admin", variant: "default" },
  failed_login: { label: "Échec Connexion", variant: "destructive" },
} as const

export const columns: ColumnDef<SecurityLog>[] = [
  {
    accessorKey: "event",
    header: "Événement",
    cell: ({ row }) => {
      const event = row.original.event as keyof typeof eventVariants
      const variant = eventVariants[event] || { label: event, variant: "default" }

      return (
        <Badge variant={variant.variant as any}>
          {variant.label}
        </Badge>
      )
    },
  },
  {
    accessorKey: "user",
    header: "Utilisateur",
  },
  {
    accessorKey: "ip",
    header: "IP",
  },
  {
    accessorKey: "userAgent",
    header: "User Agent",
    cell: ({ row }) => (
      <span className="truncate max-w-[200px] block">
        {row.original.userAgent}
      </span>
    ),
  },
  {
    accessorKey: "details",
    header: "Détails",
    cell: ({ row }) => (
      <span className="truncate max-w-[200px] block">
        {row.original.details}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
] 