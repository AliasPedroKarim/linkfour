"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { type Log } from "./columns"

interface LogFiltersProps {
  data: Log[]
  onFiltered: (filtered: Log[]) => void
}

export function LogFilters({ data, onFiltered }: LogFiltersProps) {
  const [type, setType] = useState<string>("")
  const [date, setDate] = useState<Date>()

  function handleFilter() {
    let filtered = [...data]

    if (type) {
      filtered = filtered.filter((log) => log.type === type)
    }

    if (date) {
      filtered = filtered.filter(
        (log) =>
          format(new Date(log.createdAt), "yyyy-MM-dd") ===
          format(date, "yyyy-MM-dd")
      )
    }

    onFiltered(filtered)
  }

  function handleReset() {
    setType("")
    setDate(undefined)
    onFiltered(data)
  }

  return (
    <div className="flex items-center gap-4">
      <Select value={type} onValueChange={setType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Type d'action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous</SelectItem>
          <SelectItem value="user">Utilisateur</SelectItem>
          <SelectItem value="page">Page</SelectItem>
          <SelectItem value="link">Lien</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={date ? "w-[240px] justify-start" : "w-[240px]"}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP", { locale: fr })
            ) : (
              "Sélectionner une date"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button onClick={handleFilter}>Filtrer</Button>
      <Button variant="outline" onClick={handleReset}>
        Réinitialiser
      </Button>
    </div>
  )
} 