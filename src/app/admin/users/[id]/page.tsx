import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { isAdmin } from "@/lib/auth"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { UserStats } from "./user-stats"
import { UserActivity } from "./user-activity"
import { notFound } from "next/navigation"

export default async function UserDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    redirect("/auth/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      _count: {
        select: {
          pages: true,
          links: true,
          reports: true,
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  // Récupérer les statistiques
  const [recentClicks, recentViews] = await Promise.all([
    prisma.click.findMany({
      where: {
        link: {
          userId: user.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      include: {
        link: {
          select: {
            title: true,
          },
        },
      },
    }),
    prisma.pageView.findMany({
      where: {
        page: {
          userId: user.id,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
      include: {
        page: {
          select: {
            title: true,
          },
        },
      },
    }),
  ])

  return (
    <div className="container py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{user.name || "Sans nom"}</h1>
          <p className="text-muted-foreground">
            Inscrit le{" "}
            {format(user.createdAt, "PPP", { locale: fr })}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <UserStats
          stats={{
            totalPages: user._count.pages,
            totalLinks: user._count.links,
            totalReports: user._count.reports,
            emailVerified: !!user.emailVerified,
            isBanned: user.isBanned,
          }}
        />

        <UserActivity
          recentClicks={recentClicks}
          recentViews={recentViews}
        />
      </div>
    </div>
  )
} 