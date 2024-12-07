import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { format, subDays } from "date-fns"
import { fr } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/stats/overview"
import { RecentActivity } from "@/components/dashboard/stats/recent-activity"
import { StatsCards } from "@/components/dashboard/stats/stats-cards"

export default async function StatsPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  const thirtyDaysAgo = subDays(new Date(), 30)

  const [
    totalViews,
    totalClicks,
    recentViews,
    recentClicks,
    topPages,
    topLinks,
  ] = await Promise.all([
    prisma.pageView.count({
      where: {
        page: { userId: session.user.id },
      },
    }),
    prisma.click.count({
      where: {
        link: { userId: session.user.id },
      },
    }),
    prisma.pageView.findMany({
      where: {
        page: { userId: session.user.id },
        createdAt: { gte: thirtyDaysAgo },
      },
      include: {
        page: {
          select: { title: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.click.findMany({
      where: {
        link: { userId: session.user.id },
        createdAt: { gte: thirtyDaysAgo },
      },
      include: {
        link: {
          select: { title: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.page.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
        _count: {
          select: { views: true },
        },
      },
      orderBy: {
        views: { _count: "desc" },
      },
      take: 5,
    }),
    prisma.link.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
        _count: {
          select: { clicks: true },
        },
      },
      orderBy: {
        clicks: { _count: "desc" },
      },
      take: 5,
    }),
  ])

  // Formater les données pour les graphiques
  const viewsByDay = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd")
    const dayViews = recentViews.filter(
      (view) => format(view.createdAt, "yyyy-MM-dd") === date
    )
    return {
      date,
      total: dayViews.length,
    }
  }).reverse()

  const clicksByDay = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd")
    const dayClicks = recentClicks.filter(
      (click) => format(click.createdAt, "yyyy-MM-dd") === date
    )
    return {
      date,
      total: dayClicks.length,
    }
  }).reverse()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Statistiques</h1>
        <p className="text-muted-foreground">
          Analysez les performances de vos pages et liens
        </p>
      </div>

      <StatsCards totalViews={totalViews} totalClicks={totalClicks} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="activity">Activité récente</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Vue d'ensemble</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview data={viewsByDay} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
                <CardDescription>
                  Vos pages les plus visitées
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {topPages.map((page) => (
                    <div className="flex items-center" key={page.id}>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {page.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {page._count.views} vues
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {((page._count.views / totalViews) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
              <CardDescription>
                Les dernières interactions avec vos pages et liens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity views={recentViews} clicks={recentClicks} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 