import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { isAdmin } from "@/lib/auth"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return new NextResponse("Non autorisé", { status: 401 })
  }

  try {
    const { action } = await request.json()

    // Vérifier si c'est un lien ou une page
    const link = await prisma.link.findUnique({
      where: { id: params.id },
    })

    const page = await prisma.page.findUnique({
      where: { id: params.id },
    })

    if (!link && !page) {
      return new NextResponse("Contenu non trouvé", { status: 404 })
    }

    if (link) {
      if (action === "approve") {
        await prisma.link.update({
          where: { id: params.id },
          data: {
            isActive: true,
            reportCount: 0,
          },
        })
      } else {
        await prisma.link.delete({
          where: { id: params.id },
        })
      }
    }

    if (page) {
      if (action === "approve") {
        await prisma.page.update({
          where: { id: params.id },
          data: {
            isPublic: true,
            reportCount: 0,
          },
        })
      } else {
        await prisma.page.delete({
          where: { id: params.id },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur de modération:", error)
    return new NextResponse("Erreur interne", { status: 500 })
  }
} 