import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { DashboardNav } from "@/components/dashboard/nav"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { RecentLinks } from "@/components/dashboard/recent-links"
import { RecentPages } from "@/components/dashboard/recent-pages"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/auth/login")
  }

  // Récupérer les statistiques de l'utilisateur
  const [
    totalLinks,
    totalPages,
    totalClicks,
    totalViews,
    recentLinks,
    recentPages
  ] = await Promise.all([
    prisma.link.count({
      where: { userId: session.user.id }
    }),
    prisma.page.count({
      where: { userId: session.user.id }
    }),
    prisma.click.count({
      where: {
        link: { userId: session.user.id }
      }
    }),
    prisma.pageView.count({
      where: {
        page: { userId: session.user.id }
      }
    }),
    prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        _count: {
          select: { clicks: true }
        }
      }
    }),
    prisma.page.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        _count: {
          select: { 
            views: true,
            links: true
          }
        }
      }
    })
  ])

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
        </div>

        <div className="space-y-8">
          <StatsOverview 
            stats={{
              totalLinks,
              totalPages,
              totalClicks,
              totalViews
            }}
          />

          <div className="grid gap-8 md:grid-cols-2">
            <RecentLinks links={recentLinks} />
            <RecentPages pages={recentPages} />
          </div>
        </div>
      </div>
    </div>
  )
} 