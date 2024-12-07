import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

interface RecentPagesProps {
  pages: {
    id: string
    title: string
    slug: string
    createdAt: Date
    _count: {
      views: number
      links: number
    }
  }[]
}

export function RecentPages({ pages }: RecentPagesProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pages récentes</CardTitle>
        <Link 
          href="/dashboard/pages"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Voir tout
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex flex-col space-y-1">
                <p className="font-medium leading-none">{page.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(page.createdAt)}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {page._count.views} vues
                </span>
                <span className="text-sm text-muted-foreground">
                  {page._count.links} liens
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 