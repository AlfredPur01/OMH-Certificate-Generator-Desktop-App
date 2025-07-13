"use client"

import type React from "react"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface FileUploadAreaProps {
  accept: string
  multiple?: boolean
  onFileUpload: (files: FileList | File) => void
  icon: React.ReactNode
  title: string
  subtitle: string
  className?: string
}

export default function FileUploadArea({
  accept,
  multiple = false,
  onFileUpload,
  icon,
  title,
  subtitle,
  className,
}: FileUploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      onFileUpload(multiple ? files : files[0])
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)

    const files = event.dataTransfer.files
    if (files.length > 0) {
      onFileUpload(multiple ? files : files[0])
    }
  }

  return (
    <div
      className={cn(
        "border-3 border-dashed rounded-xl p-8 text-center bg-gray-50 transition-all cursor-pointer",
        isDragOver ? "border-green-500 bg-green-50" : "border-blue-500 hover:border-gray-600 hover:bg-gray-100",
        className,
      )}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center space-y-3">
        {icon}
        <p className="font-medium text-gray-700">{title}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
