import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const patchLinkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  pageId: z.string().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user) {
    return new NextResponse("Non autorisé", { status: 401 })
  }

  try {
    const json = await request.json()
    const data = patchLinkSchema.parse(json)

    const link = await prisma.link.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!link) {
      return new NextResponse("Lien non trouvé", { status: 404 })
    }

    const updatedLink = await prisma.link.update({
      where: { id: params.id },
      data: {
        title: data.title,
        url: data.url,
        pageId: data.pageId || null,
      },
    })

    return NextResponse.json(updatedLink)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 })
    }
    return new NextResponse("Erreur interne", { status: 500 })
  }
} 