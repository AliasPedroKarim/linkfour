import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import QRCode from "qrcode"
import { z } from "zod"

const querySchema = z.object({
  format: z.enum(["png", "svg"]),
  size: z.string().transform((val) => parseInt(val, 10)),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user) {
    return new NextResponse("Non autorisé", { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const query = querySchema.parse({
      format: searchParams.get("format"),
      size: searchParams.get("size"),
    })

    const link = await prisma.link.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!link) {
      return new NextResponse("Lien non trouvé", { status: 404 })
    }

    const url = `${process.env.NEXT_PUBLIC_APP_URL}/l/${link.shortUrl}`

    if (query.format === "svg") {
      const svg = await QRCode.toString(url, {
        type: "svg",
        width: query.size,
        margin: 2,
      })
      return new NextResponse(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Content-Disposition": `attachment; filename="${link.title}-qr.svg"`,
        },
      })
    }

    const png = await QRCode.toBuffer(url, {
      width: query.size,
      margin: 2,
    })
    return new NextResponse(png, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${link.title}-qr.png"`,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 })
    }
    return new NextResponse("Erreur interne", { status: 500 })
  }
} 