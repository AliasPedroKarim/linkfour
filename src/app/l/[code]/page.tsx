import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

interface LinkPageProps {
  params: {
    code: string
  }
}

async function getLink(code: string) {
  const link = await prisma.link.findUnique({
    where: { shortUrl: code },
    select: {
      id: true,
      url: true,
    },
  })

  return link
}

async function logClick(linkId: string, headers: Headers) {
  const userAgent = headers.get("user-agent")
  const ip = headers.get("x-forwarded-for")

  await prisma.click.create({
    data: {
      linkId,
      userAgent,
      ip,
      // Vous pouvez ajouter d'autres métadonnées ici
    },
  })
}

export default async function LinkRedirectPage({ params }: LinkPageProps) {
  const headersList = headers()
  const link = await getLink(params.code)

  if (!link) {
    redirect("/404")
  }

  // Log le clic de manière asynchrone
  logClick(link.id, headersList).catch(console.error)

  redirect(link.url)
} 