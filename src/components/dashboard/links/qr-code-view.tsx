"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { Download, Copy } from "lucide-react"
import Image from "next/image"

interface QRCodeViewProps {
  link: {
    id: string
    title: string
    qrCode: string
    shortUrl: string
  }
}

export function QRCodeView({ link }: QRCodeViewProps) {
  const [size, setSize] = useState(300)
  const [downloading, setDownloading] = useState(false)

  async function downloadQR(format: "png" | "svg") {
    setDownloading(true)
    try {
      const response = await fetch(`/api/links/${link.id}/qr?format=${format}&size=${size}`)
      if (!response.ok) throw new Error()

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${link.title}-qr.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast.error("Erreur lors du téléchargement")
    } finally {
      setDownloading(false)
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/l/${link.shortUrl}`)
      toast.success("Lien copié !")
    } catch (error) {
      toast.error("Erreur lors de la copie")
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative aspect-square w-full max-w-[300px]">
            <Image
              src={link.qrCode}
              alt="QR Code"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="w-full space-y-2">
            <Label>Taille</Label>
            <Slider
              value={[size]}
              onValueChange={([value]) => setSize(value)}
              min={100}
              max={1000}
              step={50}
            />
            <p className="text-sm text-muted-foreground text-center">
              {size}x{size} pixels
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Lien court</Label>
              <div className="flex space-x-2">
                <Input
                  value={`${process.env.NEXT_PUBLIC_APP_URL}/l/${link.shortUrl}`}
                  readOnly
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <Tabs defaultValue="png">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="png">PNG</TabsTrigger>
              <TabsTrigger value="svg">SVG</TabsTrigger>
            </TabsList>
            <TabsContent value="png" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Format PNG, idéal pour une utilisation sur le web ou l'impression.
              </p>
              <Button
                className="w-full"
                onClick={() => downloadQR("png")}
                disabled={downloading}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger en PNG
              </Button>
            </TabsContent>
            <TabsContent value="svg" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Format SVG, parfait pour une utilisation en haute résolution.
              </p>
              <Button
                className="w-full"
                onClick={() => downloadQR("svg")}
                disabled={downloading}
              >
                <Download className="mr-2 h-4 w-4" />
                Télécharger en SVG
              </Button>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
} 