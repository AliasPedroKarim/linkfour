"use client"

import { Card } from "@/components/ui/card"
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts"
import { StatsOverview } from "@/components/dashboard/stats-overview"

interface AdminDashboardProps {
  stats: {
    totalUsers: number
    totalPages: number
    totalLinks: number
    totalClicks: number
    totalViews: number
  }
  pageViews: any[]
  linkClicks: any[]
}

export function AdminDashboard({ stats, pageViews, linkClicks }: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium">Utilisateurs</h3>
            <div className="mt-2 text-2xl font-bold">{stats.totalUsers}</div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium">Pages</h3>
            <div className="mt-2 text-2xl font-bold">{stats.totalPages}</div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium">Liens</h3>
            <div className="mt-2 text-2xl font-bold">{stats.totalLinks}</div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium">Clics totaux</h3>
            <div className="mt-2 text-2xl font-bold">{stats.totalClicks}</div>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium">Vues totales</h3>
            <div className="mt-2 text-2xl font-bold">{stats.totalViews}</div>
          </div>
        </Card>
      </div>

      <AnalyticsCharts pageViews={pageViews} linkClicks={linkClicks} />
    </div>
  )
} 