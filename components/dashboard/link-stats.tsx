"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface LinkStatsProps {
  linkId: string
  clicks: {
    total: number
    daily: Array<{ date: string; clicks: number }>
    devices: Array<{ device: string; count: number }>
    countries: Array<{ country: string; count: number }>
    referrers: Array<{ referrer: string; count: number }>
  }
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function LinkStats({ clicks }: LinkStatsProps) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium">Clics totaux</h3>
            <div className="mt-2 text-2xl font-bold">{clicks.total}</div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Clics par jour</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clicks.daily}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Appareils</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={clicks.devices}
                dataKey="count"
                nameKey="device"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {clicks.devices.map((entry, index) => (
                  <Cell key={entry.device} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Pays</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clicks.countries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Sources de trafic</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clicks.referrers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="referrer" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
} 