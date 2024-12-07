"use client"

import { SessionProvider } from "next-auth/react"
import { type ReactNode } from "react"
import { NuqsAdapter } from 'nuqs/adapters/next/app'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NuqsAdapter>
      <SessionProvider>{children}</SessionProvider>
    </NuqsAdapter>
  )
} 