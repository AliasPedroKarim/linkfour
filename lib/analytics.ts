import { prisma } from "./prisma"
import { headers } from "next/headers"
import { UAParser } from "ua-parser-js"

interface TrackingData {
  ip?: string
  userAgent?: string
  country?: string
  city?: string
  device?: string
  referer?: string
}

async function getTrackingData(request: Request): Promise<TrackingData> {
  const headersList = headers()
  const userAgent = headersList.get("user-agent") || undefined
  const referer = headersList.get("referer") || undefined
  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || undefined

  let device = "desktop"
  if (userAgent) {
    const parser = new UAParser(userAgent)
    device = parser.getDevice().type || "desktop"
  }
  
  return {
    ip,
    userAgent,
    device,
    referer,
    country: undefined,
    city: undefined,
  }
}

export async function trackClick({
  linkId,
  request,
}: {
  linkId: string
  request: Request
}) {
  const trackingData = await getTrackingData(request)
  
  return prisma.click.create({
    data: {
      linkId,
      ...trackingData,
    },
  })
}

export async function trackPageView(request: Request) {
  const url = new URL(request.url)
  const pageSlug = url.pathname.split("/").pop()

  if (!pageSlug) return

  const page = await prisma.page.findUnique({
    where: { slug: pageSlug },
  })

  if (!page) return

  const trackingData = await getTrackingData(request)

  return prisma.pageView.create({
    data: {
      pageId: page.id,
      ...trackingData,
    },
  })
} 