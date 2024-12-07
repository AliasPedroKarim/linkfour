import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { PagesList } from "@/components/dashboard/pages/pages-list"
import { CreatePageButton } from "@/components/dashboard/pages/create-page-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function PagesPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  const pages = await prisma.page.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          views: true,
          links: true,
        },
      },
    },
  })

  const publicPages = pages.filter((page) => page.isPublic)
  const privatPages = pages.filter((page) => !page.isPublic)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
          <p className="text-muted-foreground">
            Gérez vos pages de liens personnalisées
          </p>
        </div>
        <CreatePageButton />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Toutes les pages</TabsTrigger>
          <TabsTrigger value="public">Pages publiques</TabsTrigger>
          <TabsTrigger value="private">Pages privées</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Toutes les pages</CardTitle>
              <CardDescription>
                Liste de toutes vos pages, triées par date de création
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PagesList pages={pages} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="public">
          <Card>
            <CardHeader>
              <CardTitle>Pages publiques</CardTitle>
              <CardDescription>
                Pages accessibles publiquement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PagesList pages={publicPages} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="private">
          <Card>
            <CardHeader>
              <CardTitle>Pages privées</CardTitle>
              <CardDescription>
                Pages en mode privé ou brouillon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PagesList pages={privatPages} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 