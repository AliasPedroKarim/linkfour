import { DashboardNav } from "@/components/dashboard/nav"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <DashboardNav /> */}
        {children}
    </div>
  )
} 