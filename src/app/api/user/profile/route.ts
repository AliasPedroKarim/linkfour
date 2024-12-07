import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"
import { z } from "zod"

const profileSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  image: z.string().url().optional(),
})

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return new NextResponse("Non autorisé", { status: 401 })
  }

  try {
    const json = await request.json()
    const data = profileSchema.parse(json)

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (data.email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      })

      if (existingUser && existingUser.id !== session.user.id) {
        return new NextResponse("Cet email est déjà utilisé", { status: 400 })
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
    })

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 })
    }
    return new NextResponse("Erreur interne", { status: 500 })
  }
} 