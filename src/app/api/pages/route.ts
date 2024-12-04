import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"
import { z } from "zod"

const pageSchema = z.object({
  title: z.string().min(1).max(50),
  slug: z.string().min(3).max(50),
  description: z.string().optional(),
  theme: z.string().optional(),
  isPublic: z.boolean().default(true),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new NextResponse("Non autorisé", { status: 401 })
  }

  try {
    const json = await request.json()
    const data = pageSchema.parse(json)

    // Vérifier si le slug est déjà utilisé
    const existingPage = await prisma.page.findUnique({
      where: { slug: data.slug },
    })

    if (existingPage) {
      return new NextResponse("Ce slug est déjà utilisé", { status: 400 })
    }

    const page = await prisma.page.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    })

    return NextResponse.json(page)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 })
    }
    return new NextResponse("Erreur interne", { status: 500 })
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new NextResponse("Non autorisé", { status: 401 })
  }

  const pages = await prisma.page.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      _count: {
        select: {
          links: true,
          views: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json(pages)
} 