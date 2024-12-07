import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { DashboardNav } from "@/components/dashboard/nav"
import { LinkStats } from "@/components/dashboard/links/link-stats"
import { notFound } from "next/navigation"
import { format, subDays } from "date-fns"

export default async function LinkStatsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  const link = await prisma.link.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      _count: {
        select: {
          clicks: true,
        },
      },
    },
  })

  if (!link) {
    notFound()
  }

  // Récupérer les statistiques des 30 derniers jours
  const thirtyDaysAgo = subDays(new Date(), 30)

  const [clicks, devices, browsers, countries] = await Promise.all([
    // Clics par jour
    prisma.click.groupBy({
      by: ['createdAt'],
      where: {
        linkId: params.id,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: true,
    }),

    // Répartition par appareil
    prisma.click.groupBy({
      by: ['device'],
      where: {
        linkId: params.id,
      },
      _count: true,
    }),

    // Répartition par navigateur
    prisma.click.groupBy({
      by: ['userAgent'],
      where: {
        linkId: params.id,
      },
      _count: true,
    }),

    // Répartition par pays
    prisma.click.groupBy({
      by: ['country'],
      where: {
        linkId: params.id,
      },
      _count: true,
    }),
  ])

  // Formater les données pour les graphiques
  const clicksByDay = Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd")
    const dayClicks = clicks.filter(
      (click) => format(new Date(click.createdAt), "yyyy-MM-dd") === date
    )
    return {
      date,
      clicks: dayClicks.length,
    }
  }).reverse()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{link.title}</h1>
          <p className="text-muted-foreground">
            Statistiques des 30 derniers jours
          </p>
        </div>
      </div>

      <LinkStats
        stats={{
          totalClicks: link._count.clicks,
          clicksByDay,
          devices: devices.map((d) => ({
            device: d.device || "Inconnu",
            count: d._count,
          })),
          browsers: browsers.map((b) => ({
            browser: b.userAgent || "Inconnu",
            count: b._count,
          })),
          countries: countries.map((c) => ({
            country: c.country || "Inconnu",
            count: c._count,
          })),
        }}
      />
    </div>
  )
} 