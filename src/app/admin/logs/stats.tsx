"use client"

import { Card } from "@/components/ui/card"
import { type Log } from "./columns"

interface LogStatsProps {
  data: Log[]
}

export function LogStats({ data }: LogStatsProps) {
  const stats = {
    total: data.length,
    users: data.filter((log) => log.type === "user").length,
    pages: data.filter((log) => log.type === "page").length,
    links: data.filter((log) => log.type === "link").length,
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium">Total</h3>
          <div className="mt-2 text-2xl font-bold">{stats.total}</div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium">Utilisateurs</h3>
          <div className="mt-2 text-2xl font-bold">{stats.users}</div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium">Pages</h3>
          <div className="mt-2 text-2xl font-bold">{stats.pages}</div>
        </div>
      </Card>
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium">Liens</h3>
          <div className="mt-2 text-2xl font-bold">{stats.links}</div>
        </div>
      </Card>
    </div>
  )
} 