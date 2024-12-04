import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { isAdmin } from "@/lib/auth"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return new NextResponse("Non autorisé", { status: 401 })
  }

  try {
    const report = await prisma.report.delete({
      where: { id: params.id },
    })

    // Mettre à jour le compteur de signalements
    if (report.linkId) {
      await prisma.link.update({
        where: { id: report.linkId },
        data: {
          reportCount: {
            decrement: 1,
          },
        },
      })
    }

    if (report.pageId) {
      await prisma.page.update({
        where: { id: report.pageId },
        data: {
          reportCount: {
            decrement: 1,
          },
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors de la suppression du signalement:", error)
    return new NextResponse("Erreur interne", { status: 500 })
  }
} 