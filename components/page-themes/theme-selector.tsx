"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

const themes = [
  {
    id: "default",
    name: "Par défaut",
    preview: "bg-white dark:bg-slate-950",
  },
  {
    id: "gradient",
    name: "Dégradé",
    preview: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
  },
  {
    id: "minimal",
    name: "Minimal",
    preview: "bg-zinc-50 dark:bg-zinc-900",
  },
]

interface ThemeSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  const [open, setOpen] = useState(false)
  const selectedTheme = themes.find((theme) => theme.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedTheme?.name || "Sélectionner un thème"}
          <div
            className={cn(
              "ml-2 h-4 w-4 rounded",
              selectedTheme?.preview
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Rechercher un thème..." />
          <CommandEmpty>Aucun thème trouvé.</CommandEmpty>
          <CommandGroup>
            {themes.map((theme) => (
              <CommandItem
                key={theme.id}
                value={theme.id}
                onSelect={() => {
                  onChange(theme.id)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === theme.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {theme.name}
                <div
                  className={cn(
                    "ml-auto h-4 w-4 rounded",
                    theme.preview
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 