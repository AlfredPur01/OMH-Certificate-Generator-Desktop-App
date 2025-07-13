"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PreviewAreaProps {
  title: string
  icon: React.ReactNode
  emptyIcon: React.ReactNode
  emptyText: string
  templateImage?: string
  type: "certificate" | "idcard"
}

export default function PreviewArea({ title, icon, emptyIcon, emptyText, templateImage, type }: PreviewAreaProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="min-h-80 border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
          {templateImage ? (
            <div className="flex justify-center">
              <img
                src={templateImage || "/placeholder.svg"}
                alt={`${type} template`}
                className="max-w-full max-h-72 object-contain rounded-lg shadow-md"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              {emptyIcon}
              <p className="mt-4 text-center">{emptyText}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
