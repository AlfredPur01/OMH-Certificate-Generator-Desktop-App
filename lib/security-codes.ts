"use client"

declare global {
  interface Window {
    QRCode: any
    JsBarcode: any
  }
}

export async function generateQRCode(data: string): Promise<string> {
  // Load QRCode library if not already loaded
  if (!window.QRCode) {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.3/qrcode.min.js"
    document.head.appendChild(script)

    await new Promise((resolve) => {
      script.onload = resolve
    })
  }

  try {
    const qrCodeDataUrl = await window.QRCode.toDataURL(data, {
      width: 200,
      height: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    })
    return qrCodeDataUrl
  } catch (error) {
    console.error("Error generating QR code:", error)
    return ""
  }
}

export async function generateBarcode(data: string): Promise<string> {
  // Load JsBarcode library if not already loaded
  if (!window.JsBarcode) {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.5/JsBarcode.all.min.js"
    document.head.appendChild(script)

    await new Promise((resolve) => {
      script.onload = resolve
    })
  }

  try {
    const canvas = document.createElement("canvas")
    window.JsBarcode(canvas, data, {
      format: "CODE128",
      width: 2,
      height: 60,
      displayValue: true,
      fontSize: 12,
      textMargin: 5,
    })
    return canvas.toDataURL()
  } catch (error) {
    console.error("Error generating barcode:", error)
    return ""
  }
}
