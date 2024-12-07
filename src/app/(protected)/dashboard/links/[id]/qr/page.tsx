import { auth } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { QRCodeView } from "@/components/dashboard/links/qr-code-view"

export default async function LinkQRPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/auth/login")
  }

  const link = await prisma.link.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  })

  if (!link) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">QR Code</h1>
        <p className="text-muted-foreground">
          QR Code pour votre lien : {link.title}
        </p>
      </div>

      <QRCodeView link={link} />
    </div>
  )
} 