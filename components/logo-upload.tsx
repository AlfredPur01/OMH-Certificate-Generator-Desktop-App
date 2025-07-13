"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Edit } from "lucide-react"

interface LogoUploadProps {
  logo: string | null
  onLogoChange: (logo: string) => void
}

export default function LogoUpload({ logo, onLogoChange }: LogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onLogoChange(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="relative inline-block mb-6">
      {logo ? (
        <div className="relative">
          <img
            src={logo || "/placeholder.svg"}
            alt="Organization Logo"
            className="w-20 h-20 rounded-full object-cover border-4 border-blue-500 shadow-lg"
          />
          <Button
            size="sm"
            className="absolute -top-2 -right-2 rounded-full w-8 h-8 p-0 bg-blue-500 hover:bg-blue-600"
            onClick={handleClick}
          >
            <Edit className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <div
          className="w-20 h-20 rounded-full border-4 border-dashed border-blue-500 bg-blue-50 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={handleClick}
        >
          <Upload className="w-6 h-6 text-blue-500" />
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
    </div>
  )
}
