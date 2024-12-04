import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { isAdmin } from "@/lib/auth"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { format, subDays } from "date-fns"
import { LogFilters } from "./filters"
import { ExportButton } from "./export-button"

export default async function AdminLogsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    redirect("/auth/login")
  }

  // Récupérer les logs des 30 derniers jours
  const [userLogs, pageLogs, linkLogs] = await Promise.all([
    prisma.user.findMany({
      where: {
        createdAt: {
          gte: subDays(new Date(), 30),
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.page.findMany({
      where: {
        createdAt: {
          gte: subDays(new Date(), 30),
        },
      },
      select: {
        id: true,
        title: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.link.findMany({
      where: {
        createdAt: {
          gte: subDays(new Date(), 30),
        },
      },
      select: {
        id: true,
        title: true,
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ])

  const logs = [
    ...userLogs.map((log) => ({
      id: log.id,
      type: "user",
      title: log.name || log.email || "Utilisateur inconnu",
      user: log.name || log.email || "Utilisateur inconnu",
      createdAt: format(log.createdAt, "dd/MM/yyyy HH:mm"),
      action: "Inscription",
    })),
    ...pageLogs.map((log) => ({
      id: log.id,
      type: "page",
      title: log.title,
      user: log.user.name || log.user.email || "Utilisateur inconnu",
      createdAt: format(log.createdAt, "dd/MM/yyyy HH:mm"),
      action: "Création de page",
    })),
    ...linkLogs.map((log) => ({
      id: log.id,
      type: "link",
      title: log.title,
      user: log.user.name || log.user.email || "Utilisateur inconnu",
      createdAt: format(log.createdAt, "dd/MM/yyyy HH:mm"),
      action: "Création de lien",
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Logs d'activité</h1>
        <ExportButton data={logs} />
      </div>

      <div className="space-y-6">
        <LogFilters
          data={logs}
          onFiltered={(filtered) => {
            // Cette fonction sera gérée côté client
            console.log("Filtered:", filtered)
          }}
        />

        <DataTable columns={columns} data={logs} />
      </div>
    </div>
  )
} 