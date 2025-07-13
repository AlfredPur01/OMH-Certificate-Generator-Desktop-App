"use client"

import { useState, useCallback } from "react"

interface Alert {
  id: string
  message: string
  type: "success" | "error" | "warning" | "info"
}

interface Stats {
  certCount: number
  certGenerated: number
  idCount: number
  idGenerated: number
}

export function useAppState() {
  const [logo, setLogo] = useState<string | null>(null)
  const [certificateData, setCertificateData] = useState<any[]>([])
  const [idCardData, setIdCardData] = useState<any[]>([])
  const [templateImages, setTemplateImages] = useState<{
    certificate?: string
    idcard?: string
  }>({})
  const [photoFiles, setPhotoFiles] = useState<{ [key: string]: string }>({})
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [stats, setStats] = useState<Stats>({
    certCount: 0,
    certGenerated: 0,
    idCount: 0,
    idGenerated: 0,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)

  const addAlert = useCallback((message: string, type: Alert["type"] = "info") => {
    const id = Math.random().toString(36).substr(2, 9)
    setAlerts((prev) => [...prev, { id, message, type }])

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id))
    }, 5000)
  }, [])

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  const updateStats = useCallback((key: keyof Stats, value: number) => {
    setStats((prev) => ({ ...prev, [key]: value }))
  }, [])

  return {
    logo,
    setLogo,
    certificateData,
    setCertificateData,
    idCardData,
    setIdCardData,
    templateImages,
    setTemplateImages,
    photoFiles,
    setPhotoFiles,
    alerts,
    addAlert,
    removeAlert,
    stats,
    updateStats,
    isGenerating,
    setIsGenerating,
    progress,
    setProgress,
  }
}
