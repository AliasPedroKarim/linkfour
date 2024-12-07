import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

interface RecentLinksProps {
  links: {
    id: string
    title: string
    url: string
    createdAt: Date
    _count: {
      clicks: number
    }
  }[]
}

export function RecentLinks({ links }: RecentLinksProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Liens récents</CardTitle>
        <Link 
          href="/dashboard/links"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Voir tout
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex flex-col space-y-1">
                <p className="font-medium leading-none">{link.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(link.createdAt)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">
                  {link._count.clicks} clics
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 