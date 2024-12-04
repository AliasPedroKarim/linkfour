import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"
import { z } from "zod"

const securityLogSchema = z.object({
  event: z.string(),
  userAgent: z.string(),
  timestamp: z.string().datetime(),
  details: z.string().optional(),
})

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new NextResponse("Non autorisé", { status: 401 })
  }

  try {
    const json = await request.json()
    const data = securityLogSchema.parse(json)

    await prisma.securityLog.create({
      data: {
        ...data,
        userId: session.user.id,
        ip: request.headers.get("x-forwarded-for") || "unknown",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 })
    }
    return new NextResponse("Erreur interne", { status: 500 })
  }
} 