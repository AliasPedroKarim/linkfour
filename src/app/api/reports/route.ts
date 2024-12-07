import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const reportSchema = z.object({
  reason: z.string().min(1).max(500),
  details: z.string().optional(),
  linkId: z.string().optional(),
  pageId: z.string().optional(),
})

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return new NextResponse("Non autorisé", { status: 401 })
  }

  try {
    const json = await request.json()
    const data = reportSchema.parse(json)

    // Vérifier que l'élément existe
    if (data.linkId) {
      const link = await prisma.link.findUnique({
        where: { id: data.linkId },
      })
      if (!link) {
        return new NextResponse("Lien non trouvé", { status: 404 })
      }
    }

    if (data.pageId) {
      const page = await prisma.page.findUnique({
        where: { id: data.pageId },
      })
      if (!page) {
        return new NextResponse("Page non trouvée", { status: 404 })
      }
    }

    // Créer le signalement et incrémenter le compteur
    await prisma.$transaction(async (tx) => {
      const report = await tx.report.create({
        data: {
          ...data,
          userId: session.user.id,
        },
      })

      if (data.linkId) {
        await tx.link.update({
          where: { id: data.linkId },
          data: {
            reportCount: {
              increment: 1,
            },
          },
        })
      }

      if (data.pageId) {
        await tx.page.update({
          where: { id: data.pageId },
          data: {
            reportCount: {
              increment: 1,
            },
          },
        })
      }

      return report
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 })
    }
    return new NextResponse("Erreur interne", { status: 500 })
  }
} 