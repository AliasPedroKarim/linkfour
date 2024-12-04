import { Card } from "@/components/ui/card"
import { Users, FileText, Link, MousePointerClick, Eye, Flag } from "lucide-react"

interface StatsOverviewProps {
  stats: {
    totalUsers: number
    totalPages: number
    totalLinks: number
    totalClicks: number
    totalViews: number
    pendingReports: number
  }
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <div className="p-6 flex items-center space-x-4">
          <Users className="h-6 w-6 text-blue-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Utilisateurs
            </p>
            <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-6 flex items-center space-x-4">
          <FileText className="h-6 w-6 text-green-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pages</p>
            <h3 className="text-2xl font-bold">{stats.totalPages}</h3>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-6 flex items-center space-x-4">
          <Link className="h-6 w-6 text-purple-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">Liens</p>
            <h3 className="text-2xl font-bold">{stats.totalLinks}</h3>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-6 flex items-center space-x-4">
          <MousePointerClick className="h-6 w-6 text-yellow-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Clics totaux
            </p>
            <h3 className="text-2xl font-bold">{stats.totalClicks}</h3>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-6 flex items-center space-x-4">
          <Eye className="h-6 w-6 text-cyan-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Vues totales
            </p>
            <h3 className="text-2xl font-bold">{stats.totalViews}</h3>
          </div>
        </div>
      </Card>
      <Card>
        <div className="p-6 flex items-center space-x-4">
          <Flag className="h-6 w-6 text-red-500" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Signalements en attente
            </p>
            <h3 className="text-2xl font-bold">{stats.pendingReports}</h3>
          </div>
        </div>
      </Card>
    </div>
  )
} 