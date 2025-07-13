"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wand2, Download, Printer } from "lucide-react"
import { generateCertificatePDF, printCertificates } from "@/lib/pdf-generator"
import { generateQRCode, generateBarcode } from "@/lib/security-codes"

interface IdCardGeneratorProps {
  templateImage: string | undefined
  data: any[]
  authority: string
  logo: string | null
  photoFiles: { [key: string]: string }
  onGenerate: (count: number) => void
  onProgress: (progress: number) => void
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
}

export default function IdCardGenerator({
  templateImage,
  data,
  authority,
  logo,
  photoFiles,
  onGenerate,
  onProgress,
  isGenerating,
  setIsGenerating,
}: IdCardGeneratorProps) {
  const [generatedIdCards, setGeneratedIdCards] = useState<string[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)

  const handleGenerate = async () => {
    if (!templateImage || data.length === 0) {
      return
    }

    setIsGenerating(true)
    const idCards: string[] = []

    try {
      for (let i = 0; i < data.length; i++) {
        const record = data[i]

        // Get data with flexible column name matching
        const getName = () => {
          return record.Name || record.name || record.FULL_NAME || record.full_name || ""
        }

        const getDOB = () => {
          return record.Date_of_Birth || record.date_of_birth || record.DOB || record.dob || record.DateOfBirth || ""
        }

        const getSerial = () => {
          return (
            record.Serial_Number ||
            record.serial_number ||
            record.ID ||
            record.id ||
            record.SerialNumber ||
            `ID${i + 1}`
          )
        }

        const getGender = () => {
          return record.Gender || record.gender || record.Sex || record.sex || record.GENDER || ""
        }

        const getPhotoName = () => {
          return record.Photo_Name || record.photo_name || record.PhotoName || record.PHOTO_NAME || ""
        }

        const name = getName()
        const dob = getDOB()
        const serial = getSerial()
        const gender = getGender()
        const photoName = getPhotoName()

        // Generate QR code and barcode with better data handling
        const qrCodeData = JSON.stringify({
          name: name,
          dob: dob,
          serial: serial,
          gender: gender,
          authority: authority,
          issued: new Date().toISOString(),
        })

        const qrCode = await generateQRCode(qrCodeData)
        const barcode = await generateBarcode(serial)

        // Generate ID card canvas
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!

        canvas.width = 600
        canvas.height = 400

        // Load template image
        const img = new Image()
        img.crossOrigin = "anonymous"

        await new Promise((resolve) => {
          img.onload = resolve
          img.src = templateImage
        })

        // Draw template
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Add logo if available
        if (logo) {
          const logoImg = new Image()
          logoImg.crossOrigin = "anonymous"
          await new Promise((resolve) => {
            logoImg.onload = resolve
            logoImg.src = logo
          })
          ctx.drawImage(logoImg, 20, 20, 60, 60)
        }

        // Add photo if available
        if (photoName && photoFiles[photoName]) {
          const photoImg = new Image()
          photoImg.crossOrigin = "anonymous"
          await new Promise((resolve) => {
            photoImg.onload = resolve
            photoImg.src = photoFiles[photoName]
          })
          ctx.drawImage(photoImg, 450, 50, 120, 150)
        }

        // Add text fields with better positioning
        ctx.fillStyle = "#000000"
        ctx.font = "bold 18px Arial"
        ctx.textAlign = "left"

        // Name
        ctx.fillText(`Name: ${name}`, 30, 150)

        // Date of Birth with gender
        ctx.font = "14px Arial"
        ctx.fillText(`DOB: ${dob}`, 30, 180)

        // Gender (separate line for ID cards)
        if (gender) {
          ctx.fillText(`Gender: ${gender}`, 30, 200)
        }

        // Serial Number
        ctx.fillText(`ID: ${serial}`, 30, 220)

        // Authority
        ctx.fillText(`Issued by: ${authority}`, 30, 250)

        // Add QR code
        if (qrCode) {
          const qrImg = new Image()
          qrImg.crossOrigin = "anonymous"
          await new Promise((resolve) => {
            qrImg.onload = resolve
            qrImg.src = qrCode
          })
          ctx.drawImage(qrImg, 30, 280, 80, 80)
        }

        // Add barcode
        if (barcode) {
          const barcodeImg = new Image()
          barcodeImg.crossOrigin = "anonymous"
          await new Promise((resolve) => {
            barcodeImg.onload = resolve
            barcodeImg.src = barcode
          })
          ctx.drawImage(barcodeImg, 150, 320, 150, 40)
        }

        // Convert to data URL
        const idCardDataUrl = canvas.toDataURL("image/png")
        idCards.push(idCardDataUrl)

        // Update progress
        const progress = ((i + 1) / data.length) * 100
        onProgress(progress)
      }

      setGeneratedIdCards(idCards)
      onGenerate(idCards.length)
    } catch (error) {
      console.error("Error generating ID cards:", error)
    } finally {
      setIsGenerating(false)
      onProgress(0)
    }
  }

  const handleDownloadAll = async () => {
    if (generatedIdCards.length === 0) return

    setIsDownloading(true)
    try {
      await generateCertificatePDF(generatedIdCards, "id-cards.pdf")
    } catch (error) {
      console.error("Error downloading ID cards:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePrintAll = async () => {
    if (generatedIdCards.length === 0) return

    setIsPrinting(true)
    try {
      await printCertificates(generatedIdCards)
    } catch (error) {
      console.error("Error printing ID cards:", error)
    } finally {
      setIsPrinting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button
        onClick={handleGenerate}
        disabled={!templateImage || data.length === 0 || isGenerating}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Wand2 className="w-4 h-4 mr-2" />
        {isGenerating ? "Generating..." : "Generate ID Cards"}
      </Button>

      {generatedIdCards.length > 0 && (
        <div className="space-y-2">
          <Button
            onClick={handleDownloadAll}
            disabled={isDownloading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            {isDownloading ? "Downloading..." : "Download All as PDF"}
          </Button>

          <Button onClick={handlePrintAll} disabled={isPrinting} variant="outline" className="w-full bg-transparent">
            <Printer className="w-4 h-4 mr-2" />
            {isPrinting ? "Preparing Print..." : "Print All ID Cards"}
          </Button>
        </div>
      )}
    </div>
  )
}
