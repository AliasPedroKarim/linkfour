import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ProfileForm } from "@/components/profile/profile-form"
import { DangerZone } from "@/components/profile/danger-zone"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCircle, Mail, Shield } from "lucide-react"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: {
          pages: true,
          links: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez vos paramètres de compte et préférences.
        </p>
      </div>
      <Separator />
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium">Profil</h2>
            <p className="text-sm text-muted-foreground">
              C'est ainsi que les autres vous verront sur le site.
            </p>
          </div>
          <ProfileForm user={user} />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium">Vue d'ensemble</h2>
            <p className="text-sm text-muted-foreground">
              Un aperçu de votre compte et de son utilisation.
            </p>
          </div>
          <div className="grid gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium">
                    Pages créées
                  </CardTitle>
                  <CardDescription>
                    Nombre total de pages
                  </CardDescription>
                </div>
                <UserCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user._count.pages}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium">
                    Liens actifs
                  </CardTitle>
                  <CardDescription>
                    Nombre total de liens
                  </CardDescription>
                </div>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user._count.links}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium">
                    Statut du compte
                  </CardTitle>
                  <CardDescription>
                    État de vérification
                  </CardDescription>
                </div>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.emailVerified ? "Vérifié" : "Non vérifié"}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Separator />
      <DangerZone />
    </div>
  )
} 