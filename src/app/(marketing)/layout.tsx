import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/footer"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <Footer />
    </div>
  )
} 