"use client"

import { Card } from "@/components/ui/card"
import { Link, MousePointerClick, Eye, FileText } from "lucide-react"

interface StatsOverviewProps {
  stats: {
    totalLinks: number
    totalPages: number
    totalClicks: number
    totalViews: number
  }
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <div className="p-6 flex items-center space-x-4">
          <Link className="h-6 w-6 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Liens
            </p>
            <h3 className="text-2xl font-bold">{stats.totalLinks}</h3>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-6 flex items-center space-x-4">
          <FileText className="h-6 w-6 text-green-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Pages
            </p>
            <h3 className="text-2xl font-bold">{stats.totalPages}</h3>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-6 flex items-center space-x-4">
          <MousePointerClick className="h-6 w-6 text-yellow-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Clics
            </p>
            <h3 className="text-2xl font-bold">{stats.totalClicks}</h3>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-6 flex items-center space-x-4">
          <Eye className="h-6 w-6 text-purple-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Vues
            </p>
            <h3 className="text-2xl font-bold">{stats.totalViews}</h3>
          </div>
        </div>
      </Card>
    </div>
  )
} 