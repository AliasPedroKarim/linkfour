"use client"

import { Card } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { MousePointerClick, MoreVertical, QrCode } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface LinksListProps {
  links: {
    id: string
    title: string
    url: string
    shortUrl: string
    createdAt: Date
    page: {
      title: string | null
    } | null
    _count: {
      clicks: number
    }
  }[]
}

export function LinksList({ links }: LinksListProps) {
  return (
    <div className="grid gap-4 w-full">
      {links.map((link) => (
        <Card key={link.id} className="p-6 w-full">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col space-y-2 min-w-0">
              <div className="flex items-center space-x-2">
                <Link 
                  href={`/dashboard/links/${link.id}`}
                  className="font-medium hover:underline truncate"
                >
                  {link.title}
                </Link>
                {link.page && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    ({link.page.title})
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span className="shrink-0">{formatDate(link.createdAt)}</span>
                <span className="flex items-center shrink-0">
                  <MousePointerClick className="mr-1 h-4 w-4" />
                  {link._count.clicks} clics
                </span>
                <a 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground truncate"
                >
                  {link.url}
                </a>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/links/${link.id}/stats`}>
                    Statistiques
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/links/${link.id}/edit`}>
                    Modifier
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/links/${link.id}/qr`}>
                    <QrCode className="mr-2 h-4 w-4" />
                    QR Code
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
    </div>
  )
} 