import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UserStatsProps {
  stats: {
    totalPages: number
    totalLinks: number
    totalReports: number
    emailVerified: boolean
    isBanned: boolean
  }
}

export function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          <h3 className="text-lg font-medium">Signalements</h3>
          <div className="mt-2 text-2xl font-bold">{stats.totalReports}</div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium">Statut</h3>
          <div className="mt-2 space-x-2">
            <Badge variant={stats.emailVerified ? "default" : "secondary"}>
              {stats.emailVerified ? "Vérifié" : "Non vérifié"}
            </Badge>
            {stats.isBanned && (
              <Badge variant="destructive">Banni</Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
} 