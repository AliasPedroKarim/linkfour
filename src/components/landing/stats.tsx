import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link2, Users2 } from "lucide-react"

async function getStats() {
  const [totalLinks, totalPages, totalUsers] = await Promise.all([
    prisma.link.count(),
    prisma.page.count(),
    prisma.user.count(),
  ])

  return {
    totalLinks,
    totalPages,
    totalUsers,
  }
}

export async function Stats() {
  const stats = await getStats()

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">Utilisé et approuvé</h2>
          <p className="text-xl text-muted-foreground">
            Rejoignez des milliers d'utilisateurs qui font confiance à LinkFour pour gérer leurs liens.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Liens créés
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold">{stats.totalLinks}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                </svg>
                Pages créées
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold">{stats.totalPages}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users2 className="h-4 w-4" />
                Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
} 