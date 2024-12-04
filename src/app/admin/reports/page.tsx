import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { isAdmin } from "@/lib/auth"
import { DataTable } from "./data-table"
import { columns, type Report } from "./columns"

export default async function ReportsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    redirect("/auth/login")
  }

  const reports = await prisma.report.findMany({
    include: {
      user: true,
      link: true,
      page: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const formattedReports: Report[] = reports.map((report) => ({
    id: report.id,
    type: report.linkId ? "link" : "page",
    title: report.linkId ? report.link?.title : report.page?.title,
    reason: report.reason,
    details: report.details || "",
    reportedBy: report.user.name || report.user.email || "Utilisateur inconnu",
    createdAt: report.createdAt,
  }))

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Signalements</h1>
      <DataTable columns={columns} data={formattedReports} />
    </div>
  )
} 