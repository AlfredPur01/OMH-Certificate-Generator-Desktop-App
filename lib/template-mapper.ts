"use client"

// Template field mapping configuration for different certificate types
export interface FieldMapping {
  x: number
  y: number
  width?: number
  height?: number
  fontSize: number
  fontFamily: string
  fontWeight: string
  color: string
  align: "left" | "center" | "right"
  maxLength?: number
  transform?: "uppercase" | "lowercase" | "capitalize"
}

export interface TemplateConfig {
  name: string
  width: number
  height: number
  fields: {
    [key: string]: FieldMapping
  }
  genderOptions?: {
    male: { x: number; y: number }
    female: { x: number; y: number }
  }
  barcode?: {
    x: number
    y: number
    width: number
    height: number
  }
  qrCode?: {
    x: number
    y: number
    width: number
    height: number
  }
  logo?: {
    x: number
    y: number
    width: number
    height: number
  }
}

// Medical Certificate of Fitness template configuration
export const MEDICAL_CERTIFICATE_CONFIG: TemplateConfig = {
  name: "Medical Certificate of Fitness",
  width: 800,
  height: 1000,
  fields: {
    name: {
      x: 400, // Center of the dotted line
      y: 380, // Position of the name line
      fontSize: 18,
      fontFamily: "Arial",
      fontWeight: "normal",
      color: "#000000",
      align: "center",
      maxLength: 50,
      transform: "uppercase",
    },
    nin: {
      x: 200, // After "NIN:" text
      y: 550, // Position of NIN line
      fontSize: 14,
      fontFamily: "Arial",
      fontWeight: "normal",
      color: "#000000",
      align: "left",
      maxLength: 20,
    },
    dob: {
      x: 500, // After "DOB:" text
      y: 550, // Same line as NIN
      fontSize: 14,
      fontFamily: "Arial",
      fontWeight: "normal",
      color: "#000000",
      align: "left",
      maxLength: 15,
    },
    issueDate: {
      x: 400,
      y: 900,
      fontSize: 12,
      fontFamily: "Arial",
      fontWeight: "normal",
      color: "#666666",
      align: "center",
    },
  },
  genderOptions: {
    male: { x: 280, y: 345 }, // Position to underline "Male"
    female: { x: 380, y: 345 }, // Position to underline "Female"
  },
  barcode: {
    x: 300, // Center the barcode
    y: 580,
    width: 200,
    height: 60,
  },
  qrCode: {
    x: 650, // Top right corner
    y: 50,
    width: 100,
    height: 100,
  },
  logo: {
    x: 50, // Top left corner
    y: 50,
    width: 80,
    height: 80,
  },
}

// Generic certificate template configuration
export const GENERIC_CERTIFICATE_CONFIG: TemplateConfig = {
  name: "Generic Certificate",
  width: 1200,
  height: 800,
  fields: {
    name: {
      x: 600,
      y: 400,
      fontSize: 36,
      fontFamily: "Arial",
      fontWeight: "bold",
      color: "#000000",
      align: "center",
      transform: "uppercase",
    },
    dob: {
      x: 600,
      y: 480,
      fontSize: 24,
      fontFamily: "Arial",
      fontWeight: "normal",
      color: "#000000",
      align: "center",
    },
    serial: {
      x: 600,
      y: 540,
      fontSize: 20,
      fontFamily: "Arial",
      fontWeight: "normal",
      color: "#000000",
      align: "center",
    },
    authority: {
      x: 600,
      y: 570,
      fontSize: 18,
      fontFamily: "Arial",
      fontWeight: "normal",
      color: "#000000",
      align: "center",
    },
    issueDate: {
      x: 600,
      y: 600,
      fontSize: 18,
      fontFamily: "Arial",
      fontWeight: "normal",
      color: "#000000",
      align: "center",
    },
  },
  barcode: {
    x: 30,
    y: 700,
    width: 250,
    height: 70,
  },
  qrCode: {
    x: 1050,
    y: 650,
    width: 120,
    height: 120,
  },
  logo: {
    x: 50,
    y: 50,
    width: 100,
    height: 100,
  },
}

// Template detection and configuration selector
export function getTemplateConfig(templateImage: string): TemplateConfig {
  // In a real implementation, you could analyze the image or use filename
  // For now, we'll use the medical certificate config for the provided template
  if (templateImage.includes("medical") || templateImage.includes("fitness")) {
    return MEDICAL_CERTIFICATE_CONFIG
  }

  return GENERIC_CERTIFICATE_CONFIG
}

// Field placement utility functions
export function drawTextField(
  ctx: CanvasRenderingContext2D,
  text: string,
  field: FieldMapping,
  canvasWidth: number,
  canvasHeight: number,
) {
  // Apply transformations
  let processedText = text
  if (field.transform) {
    switch (field.transform) {
      case "uppercase":
        processedText = text.toUpperCase()
        break
      case "lowercase":
        processedText = text.toLowerCase()
        break
      case "capitalize":
        processedText = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
        break
    }
  }

  // Apply max length
  if (field.maxLength && processedText.length > field.maxLength) {
    processedText = processedText.substring(0, field.maxLength)
  }

  // Set font properties
  ctx.font = `${field.fontWeight} ${field.fontSize}px ${field.fontFamily}`
  ctx.fillStyle = field.color
  ctx.textAlign = field.align

  // Calculate position based on canvas scaling
  const scaleX = canvasWidth / 800 // Assuming base width of 800
  const scaleY = canvasHeight / 1000 // Assuming base height of 1000

  const scaledX = field.x * scaleX
  const scaledY = field.y * scaleY

  // Draw the text
  ctx.fillText(processedText, scaledX, scaledY)
}

export function drawGenderUnderline(
  ctx: CanvasRenderingContext2D,
  gender: string,
  config: TemplateConfig,
  canvasWidth: number,
  canvasHeight: number,
) {
  if (!config.genderOptions) return

  const scaleX = canvasWidth / 800
  const scaleY = canvasHeight / 1000

  ctx.strokeStyle = "#000000"
  ctx.lineWidth = 2

  const genderLower = gender.toLowerCase()

  if (genderLower.includes("male") && !genderLower.includes("female")) {
    // Underline "Male"
    const pos = config.genderOptions.male
    const startX = pos.x * scaleX
    const endX = (pos.x + 40) * scaleX // Approximate width of "Male"
    const y = pos.y * scaleY

    ctx.beginPath()
    ctx.moveTo(startX, y)
    ctx.lineTo(endX, y)
    ctx.stroke()
  } else if (genderLower.includes("female")) {
    // Underline "Female"
    const pos = config.genderOptions.female
    const startX = pos.x * scaleX
    const endX = (pos.x + 60) * scaleX // Approximate width of "Female"
    const y = pos.y * scaleY

    ctx.beginPath()
    ctx.moveTo(startX, y)
    ctx.lineTo(endX, y)
    ctx.stroke()
  }
}

export function drawBarcode(
  ctx: CanvasRenderingContext2D,
  barcodeImage: string,
  config: TemplateConfig,
  canvasWidth: number,
  canvasHeight: number,
) {
  if (!config.barcode || !barcodeImage) return

  const scaleX = canvasWidth / 800
  const scaleY = canvasHeight / 1000

  const img = new Image()
  img.crossOrigin = "anonymous"

  return new Promise<void>((resolve) => {
    img.onload = () => {
      const x = config.barcode!.x * scaleX
      const y = config.barcode!.y * scaleY
      const width = config.barcode!.width * scaleX
      const height = config.barcode!.height * scaleY

      ctx.drawImage(img, x, y, width, height)
      resolve()
    }
    img.src = barcodeImage
  })
}

export function drawQRCode(
  ctx: CanvasRenderingContext2D,
  qrCodeImage: string,
  config: TemplateConfig,
  canvasWidth: number,
  canvasHeight: number,
) {
  if (!config.qrCode || !qrCodeImage) return

  const scaleX = canvasWidth / 800
  const scaleY = canvasHeight / 1000

  const img = new Image()
  img.crossOrigin = "anonymous"

  return new Promise<void>((resolve) => {
    img.onload = () => {
      const x = config.qrCode!.x * scaleX
      const y = config.qrCode!.y * scaleY
      const width = config.qrCode!.width * scaleX
      const height = config.qrCode!.height * scaleY

      ctx.drawImage(img, x, y, width, height)
      resolve()
    }
    img.src = qrCodeImage
  })
}

export function drawLogo(
  ctx: CanvasRenderingContext2D,
  logoImage: string,
  config: TemplateConfig,
  canvasWidth: number,
  canvasHeight: number,
) {
  if (!config.logo || !logoImage) return

  const scaleX = canvasWidth / 800
  const scaleY = canvasHeight / 1000

  const img = new Image()
  img.crossOrigin = "anonymous"

  return new Promise<void>((resolve) => {
    img.onload = () => {
      const x = config.logo!.x * scaleX
      const y = config.logo!.y * scaleY
      const width = config.logo!.width * scaleX
      const height = config.logo!.height * scaleY

      ctx.drawImage(img, x, y, width, height)
      resolve()
    }
    img.src = logoImage
  })
}
