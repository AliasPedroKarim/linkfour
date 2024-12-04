import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { isAdmin } from "@/lib/auth"
import { Card } from "@/components/ui/card"
import { StatsOverview } from "./stats-overview"
import { AnalyticsCharts } from "./analytics-charts"
import { format, subDays } from "date-fns"

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    redirect("/auth/login")
  }

  // Récupérer les statistiques globales
  const [
    totalUsers,
    totalPages,
    totalLinks,
    totalClicks,
    totalViews,
    recentClicks,
    recentViews,
    pendingReports,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.page.count(),
    prisma.link.count(),
    prisma.click.count(),
    prisma.pageView.count(),
    prisma.click.findMany({
      where: {
        createdAt: {
          gte: subDays(new Date(), 30),
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.pageView.findMany({
      where: {
        createdAt: {
          gte: subDays(new Date(), 30),
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.report.count({
      where: {
        OR: [
          {
            link: {
              isActive: true,
            },
          },
          {
            page: {
              isPublic: true,
            },
          },
        ],
      },
    }),
  ])

  // Formater les données pour les graphiques
  const clicksByDay = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd")
    const dayClicks = recentClicks.filter(
      (click) => format(click.createdAt, "yyyy-MM-dd") === date
    )
    return {
      date,
      clicks: dayClicks.length,
    }
  }).reverse()

  const viewsByDay = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd")
    const dayViews = recentViews.filter(
      (view) => format(view.createdAt, "yyyy-MM-dd") === date
    )
    return {
      date,
      views: dayViews.length,
    }
  }).reverse()

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Tableau de bord administrateur</h1>
      </div>

      <div className="space-y-8">
        <StatsOverview
          stats={{
            totalUsers,
            totalPages,
            totalLinks,
            totalClicks,
            totalViews,
            pendingReports,
          }}
        />

        <AnalyticsCharts
          clicksByDay={clicksByDay}
          viewsByDay={viewsByDay}
        />
      </div>
    </div>
  )
} 