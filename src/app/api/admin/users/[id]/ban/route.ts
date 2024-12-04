import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
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
    // Vérifier que l'utilisateur n'est pas un admin
    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!targetUser) {
      return new NextResponse("Utilisateur non trouvé", { status: 404 })
    }

    if (isAdmin(targetUser.email || "")) {
      return new NextResponse(
        "Impossible de bannir un administrateur",
        { status: 403 }
      )
    }

    // Désactiver les pages et les liens de l'utilisateur
    await prisma.$transaction([
      prisma.page.updateMany({
        where: { userId: params.id },
        data: { isPublic: false },
      }),
      prisma.link.updateMany({
        where: { userId: params.id },
        data: { isActive: false },
      }),
      prisma.user.update({
        where: { id: params.id },
        data: { isBanned: true },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erreur lors du bannissement:", error)
    return new NextResponse("Erreur interne", { status: 500 })
  }
} 