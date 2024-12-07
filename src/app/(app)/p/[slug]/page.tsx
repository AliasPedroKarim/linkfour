import { notFound } from "next/navigation"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PageProps {
  params: {
    slug: string
  }
}

async function logPageView(pageId: string, headersList: Headers) {
  const userAgent = headersList.get("user-agent")
  const ip = headersList.get("x-forwarded-for")
  const referer = headersList.get("referer")

  await prisma.pageView.create({
    data: {
      pageId,
      userAgent,
      ip,
      referer,
    },
  })
}

export default async function Page({ params }: PageProps) {
  const headersList = headers()
  const page = await prisma.page.findUnique({
    where: { 
      slug: params.slug,
      isPublic: true,
    },
    include: {
      user: true,
      links: {
        where: {
          isActive: true,
        },
        orderBy: {
          order: "asc",
        },
      },
    },
  })

  if (!page) {
    notFound()
  }

  // Log la vue de page de manière asynchrone
  logPageView(page.id, headersList).catch(console.error)

  return (
    <div className={cn(
      "min-h-screen w-full py-12 px-4",
      page.theme === "gradient" && "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
      page.theme === "minimal" && "bg-zinc-50 dark:bg-zinc-900",
    )}>
      <div className="mx-auto max-w-lg space-y-8">
        <div className="text-center">
          <Avatar className="mx-auto h-24 w-24">
            <AvatarImage src={page.user.image || ""} />
            <AvatarFallback>{page.user.name?.[0]}</AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-2xl font-bold">{page.title}</h1>
          {page.description && (
            <p className="mt-2 text-muted-foreground">{page.description}</p>
          )}
        </div>

        <div className="space-y-4">
          {page.links.map((link) => (
            <Button
              key={link.id}
              variant="outline"
              className="w-full justify-start gap-2"
              asChild
            >
              <a href={`/l/${link.shortUrl}`} target="_blank" rel="noopener noreferrer">
                {link.icon && (
                  <span className="text-xl">{link.icon}</span>
                )}
                {link.title}
              </a>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
} 