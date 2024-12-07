import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { EditPageForm } from "@/components/dashboard/pages/edit-page-form"
import { PageLinks } from "@/components/dashboard/pages/page-links"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function EditPagePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  const [page, links] = await Promise.all([
    prisma.page.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    }),
    prisma.link.findMany({
      where: {
        pageId: params.id,
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            clicks: true,
          },
        },
      },
    }),
  ])

  if (!page) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modifier la page</h1>
        <p className="text-muted-foreground">
          Personnalisez votre page et gérez ses liens
        </p>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
          <TabsTrigger value="links">Liens ({links.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de la page</CardTitle>
              <CardDescription>
                Modifiez les informations et les paramètres de votre page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EditPageForm page={page} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Liens de la page</CardTitle>
              <CardDescription>
                Gérez les liens qui apparaissent sur votre page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PageLinks pageId={page.id} initialLinks={links} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 