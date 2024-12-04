"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { type Log } from "./columns"

interface ExportButtonProps {
  data: Log[]
}

export function ExportButton({ data }: ExportButtonProps) {
  function handleExport() {
    const headers = ["Type", "Titre", "Utilisateur", "Action", "Date"]
    const csvData = data.map((log) => [
      log.type,
      log.title,
      log.user,
      log.action,
      log.createdAt,
    ])

    const csv = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `logs_${format(new Date(), "yyyy-MM-dd")}.csv`
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button onClick={handleExport} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Exporter CSV
    </Button>
  )
} 