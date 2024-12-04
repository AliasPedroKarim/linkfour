import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { isAdmin } from "@/lib/auth"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { format, subDays } from "date-fns"

export default async function SecurityLogsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    redirect("/auth/login")
  }

  const logs = await prisma.securityLog.findMany({
    where: {
      createdAt: {
        gte: subDays(new Date(), 30),
      },
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formattedLogs = logs.map((log) => ({
    id: log.id,
    event: log.event,
    ip: log.ip,
    userAgent: log.userAgent,
    user: log.user?.name || log.user?.email || "Système",
    details: log.details || "",
    createdAt: format(log.createdAt, "dd/MM/yyyy HH:mm"),
  }))

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Logs de sécurité</h1>
      </div>

      <DataTable columns={columns} data={formattedLogs} />
    </div>
  )
} 