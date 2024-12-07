import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { EditLinkForm } from "@/components/dashboard/links/edit-link-form"

export default async function EditLinkPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  const [link, pages] = await Promise.all([
    prisma.link.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        page: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    }),
    prisma.page.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        title: true,
      },
    }),
  ])

  if (!link) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Modifier le lien</h1>
        <p className="text-muted-foreground">
          Modifiez les informations de votre lien
        </p>
      </div>

      <EditLinkForm link={link} pages={pages} />
    </div>
  )
} 