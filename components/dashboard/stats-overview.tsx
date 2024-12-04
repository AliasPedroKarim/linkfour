"use client"

import { Card } from "@/components/ui/card"
import { 
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts"

interface StatsOverviewProps {
  pageViews: any[]
  linkClicks: any[]
  totalViews: number
  totalClicks: number
}

export function StatsOverview({
  pageViews,
  linkClicks,
  totalViews,
  totalClicks,
}: StatsOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium">Vues totales</h3>
          <div className="mt-2 text-2xl font-bold">{totalViews}</div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium">Clics totaux</h3>
          <div className="mt-2 text-2xl font-bold">{totalClicks}</div>
        </div>
      </Card>
      {/* Ajoutez les graphiques ici */}
    </div>
  )
} 