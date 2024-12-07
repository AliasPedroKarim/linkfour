import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateQRCode } from "@/lib/qrcode"
import { nanoid } from "nanoid"

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return new NextResponse("Non autorisé", { status: 401 })
  }

  const json = await request.json()
  const { title, url, pageId } = json

  const shortUrl = nanoid(8)
  const qrCode = await generateQRCode(`${process.env.AUTH_URL}/l/${shortUrl}`)

  const link = await prisma.link.create({
    data: {
      title,
      url,
      pageId,
      userId: session.user.id,
      shortUrl,
      qrCode,
    },
  })

  return NextResponse.json(link)
}

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return new NextResponse("Non autorisé", { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const pageId = searchParams.get("pageId")

  const links = await prisma.link.findMany({
    where: {
      userId: session.user.id,
      pageId: pageId || undefined,
    },
    orderBy: {
      order: "asc",
    },
  })

  return NextResponse.json(links)
} 