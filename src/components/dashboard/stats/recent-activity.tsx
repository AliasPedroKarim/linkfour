"use client"

import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Eye, MousePointerClick } from "lucide-react"

interface RecentActivityProps {
  views: {
    createdAt: Date
    page: {
      title: string | null
    }
  }[]
  clicks: {
    createdAt: Date
    link: {
      title: string | null
    }
  }[]
}

export function RecentActivity({ views, clicks }: RecentActivityProps) {
  // Combiner et trier les vues et clics par date
  const activities = [
    ...views.map((view) => ({
      type: "view" as const,
      createdAt: view.createdAt,
      title: view.page.title,
    })),
    ...clicks.map((click) => ({
      type: "click" as const,
      createdAt: click.createdAt,
      title: click.link.title,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  return (
    <div className="space-y-8">
      {activities.map((activity, index) => (
        <div className="flex items-center" key={index}>
          <div className="relative mr-4">
            {activity.type === "view" ? (
              <Eye className="h-4 w-4 text-muted-foreground" />
            ) : (
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium">
              {activity.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {activity.type === "view" ? "Vue" : "Clic"} il y a{" "}
              {formatDistanceToNow(activity.createdAt, {
                addSuffix: true,
                locale: fr,
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
} 