import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { LinksList } from "@/components/dashboard/links/links-list"
import { CreateLinkButton } from "@/components/dashboard/links/create-link-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function LinksPage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  const [links, pages] = await Promise.all([
    prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        page: {
          select: {
            title: true,
          },
        },
        _count: {
          select: {
            clicks: true,
          },
        },
      },
    }),
    prisma.page.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
      },
      orderBy: { title: "asc" },
    }),
  ])

  const independentLinks = links.filter((link) => !link.page)
  const pageLinks = links.filter((link) => link.page)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Liens</h1>
          <p className="text-muted-foreground">
            Gérez tous vos liens et leurs redirections
          </p>
        </div>
        <CreateLinkButton pages={pages} />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tous les liens</TabsTrigger>
          <TabsTrigger value="independent">Liens indépendants</TabsTrigger>
          <TabsTrigger value="pages">Liens des pages</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Tous les liens</CardTitle>
              <CardDescription>
                Liste de tous vos liens, triés par date de création
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LinksList links={links} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="independent">
          <Card>
            <CardHeader>
              <CardTitle>Liens indépendants</CardTitle>
              <CardDescription>
                Liens qui ne sont pas associés à une page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LinksList links={independentLinks} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Liens des pages</CardTitle>
              <CardDescription>
                Liens qui sont associés à vos pages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LinksList links={pageLinks} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 