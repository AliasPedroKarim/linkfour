"use client"

import { Card } from "@/components/ui/card"
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

interface AnalyticsChartsProps {
  clicksByDay: Array<{
    date: string
    clicks: number
  }>
  viewsByDay: Array<{
    date: string
    views: number
  }>
}

export function AnalyticsCharts({ clicksByDay, viewsByDay }: AnalyticsChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Clics par jour</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={clicksByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#8884d8"
              name="Clics"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Vues par jour</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={viewsByDay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#82ca9d"
              name="Vues"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
} 