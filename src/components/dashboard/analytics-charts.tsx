"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"

interface AnalyticsChartsProps {
  pageViews: any[]
  linkClicks: any[]
}

export function AnalyticsCharts({ pageViews, linkClicks }: AnalyticsChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium">Vues par jour</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={pageViews}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-medium">Clics par jour</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={linkClicks}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="clicks" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
} 