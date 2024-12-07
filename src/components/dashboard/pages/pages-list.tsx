"use client"

import { Card } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Eye, Link as LinkIcon, MoreVertical, Globe, Lock } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PagesListProps {
  pages: {
    id: string
    title: string
    slug: string
    isPublic: boolean
    createdAt: Date
    _count: {
      views: number
      links: number
    }
  }[]
}

export function PagesList({ pages }: PagesListProps) {
  return (
    <div className="space-y-4">
      {pages.map((page) => (
        <Card key={page.id} className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1 flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <Link 
                  href={`/dashboard/pages/${page.id}`}
                  className="font-medium hover:underline truncate"
                >
                  {page.title}
                </Link>
                <Badge variant={page.isPublic ? "default" : "secondary"}>
                  {page.isPublic ? (
                    <Globe className="mr-1 h-3 w-3" />
                  ) : (
                    <Lock className="mr-1 h-3 w-3" />
                  )}
                  {page.isPublic ? "Public" : "Privé"}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{formatDate(page.createdAt)}</span>
                <span className="flex items-center">
                  <Eye className="mr-1 h-4 w-4" />
                  {page._count.views} vues
                </span>
                <span className="flex items-center">
                  <LinkIcon className="mr-1 h-4 w-4" />
                  {page._count.links} liens
                </span>
                <Link 
                  href={`/p/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:text-foreground truncate max-w-[300px]"
                >
                  <Globe className="mr-1 h-4 w-4" />
                  {page.slug}
                </Link>
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
                  <Link href={`/dashboard/pages/${page.id}/stats`}>
                    Statistiques
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/pages/${page.id}/edit`}>
                    Modifier
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/pages/${page.id}/design`}>
                    Personnaliser
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
    </div>
  )
} 