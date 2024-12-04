import QRCode from "qrcode"

export async function generateQRCode(url: string): Promise<string> {
  try {
    const qrCode = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
    return qrCode
  } catch (error) {
    console.error("Erreur lors de la génération du QR code:", error)
    throw error
  }
} 