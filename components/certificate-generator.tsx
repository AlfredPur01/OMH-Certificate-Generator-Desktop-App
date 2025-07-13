"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wand2, Download, Printer } from "lucide-react"
import { generateCertificatePDF, printCertificates } from "@/lib/pdf-generator"
import { generateQRCode, generateBarcode } from "@/lib/security-codes"
import {
  getTemplateConfig,
  drawTextField,
  drawGenderUnderline,
  drawBarcode,
  drawQRCode,
  drawLogo,
} from "@/lib/template-mapper"

interface CertificateGeneratorProps {
  templateImage: string | undefined
  data: any[]
  authority: string
  logo: string | null
  onGenerate: (count: number) => void
  onProgress: (progress: number) => void
  isGenerating: boolean
  setIsGenerating: (generating: boolean) => void
}

export default function CertificateGenerator({
  templateImage,
  data,
  authority,
  logo,
  onGenerate,
  onProgress,
  isGenerating,
  setIsGenerating,
}: CertificateGeneratorProps) {
  const [generatedCertificates, setGeneratedCertificates] = useState<string[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)

  const handleGenerate = async () => {
    if (!templateImage || data.length === 0) {
      return
    }

    setIsGenerating(true)
    const certificates: string[] = []

    try {
      // Get template configuration
      const templateConfig = getTemplateConfig(templateImage)

      for (let i = 0; i < data.length; i++) {
        const record = data[i]
        console.log("Processing record:", record)

        // Extract data with flexible column name matching
        const getName = () => {
          return record.Name || record.name || record.FULL_NAME || record.full_name || ""
        }

        const getDOB = () => {
          return record.Date_of_Birth || record.date_of_birth || record.DOB || record.dob || record.DateOfBirth || ""
        }

        const getNIN = () => {
          return (
            record.NIN ||
            record.nin ||
            record.Serial_Number ||
            record.serial_number ||
            record.ID ||
            record.id ||
            `CERT${i + 1}`
          )
        }

        const getGender = () => {
          return record.Gender || record.gender || record.Sex || record.sex || record.GENDER || ""
        }

        const name = getName()
        const dob = getDOB()
        const nin = getNIN()
        const gender = getGender()

        console.log("Extracted data:", { name, dob, nin, gender })

        // Generate QR code and barcode
        const qrCodeData = JSON.stringify({
          name: name,
          dob: dob,
          nin: nin,
          gender: gender,
          authority: authority,
          issued: new Date().toISOString(),
        })

        const qrCode = await generateQRCode(qrCodeData)
        const barcode = await generateBarcode(nin)

        // Generate certificate canvas
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")!

        canvas.width = templateConfig.width
        canvas.height = templateConfig.height

        // Load template image
        const img = new Image()
        img.crossOrigin = "anonymous"

        await new Promise((resolve) => {
          img.onload = resolve
          img.src = templateImage
        })

        // Draw template background
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Draw logo if available
        if (logo && templateConfig.logo) {
          await drawLogo(ctx, logo, templateConfig, canvas.width, canvas.height)
        }

        // Draw text fields using template configuration
        if (name && templateConfig.fields.name) {
          drawTextField(ctx, name, templateConfig.fields.name, canvas.width, canvas.height)
        }

        if (dob && templateConfig.fields.dob) {
          drawTextField(ctx, dob, templateConfig.fields.dob, canvas.width, canvas.height)
        }

        if (nin && templateConfig.fields.nin) {
          drawTextField(ctx, nin, templateConfig.fields.nin, canvas.width, canvas.height)
        }

        // Draw issue date
        const issueDate = new Date().toLocaleDateString()
        if (templateConfig.fields.issueDate) {
          drawTextField(ctx, issueDate, templateConfig.fields.issueDate, canvas.width, canvas.height)
        }

        // Draw authority if field exists
        if (authority && templateConfig.fields.authority) {
          drawTextField(ctx, `Issued by: ${authority}`, templateConfig.fields.authority, canvas.width, canvas.height)
        }

        // Draw gender underline
        if (gender) {
          drawGenderUnderline(ctx, gender, templateConfig, canvas.width, canvas.height)
        }

        // Draw QR code
        if (qrCode && templateConfig.qrCode) {
          await drawQRCode(ctx, qrCode, templateConfig, canvas.width, canvas.height)
        }

        // Draw barcode
        if (barcode && templateConfig.barcode) {
          await drawBarcode(ctx, barcode, templateConfig, canvas.width, canvas.height)
        }

        // Convert to data URL
        const certificateDataUrl = canvas.toDataURL("image/png", 0.9)
        certificates.push(certificateDataUrl)

        // Update progress
        const progress = ((i + 1) / data.length) * 100
        onProgress(progress)
      }

      setGeneratedCertificates(certificates)
      onGenerate(certificates.length)
    } catch (error) {
      console.error("Error generating certificates:", error)
    } finally {
      setIsGenerating(false)
      onProgress(0)
    }
  }

  const handleDownloadAll = async () => {
    if (generatedCertificates.length === 0) return

    setIsDownloading(true)
    try {
      await generateCertificatePDF(generatedCertificates, "medical-certificates.pdf")
    } catch (error) {
      console.error("Error downloading certificates:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePrintAll = async () => {
    if (generatedCertificates.length === 0) return

    setIsPrinting(true)
    try {
      await printCertificates(generatedCertificates)
    } catch (error) {
      console.error("Error printing certificates:", error)
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
        {isGenerating ? "Generating..." : "Generate Certificates"}
      </Button>

      {generatedCertificates.length > 0 && (
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
            {isPrinting ? "Preparing Print..." : "Print All Certificates"}
          </Button>
        </div>
      )}
    </div>
  )
}
