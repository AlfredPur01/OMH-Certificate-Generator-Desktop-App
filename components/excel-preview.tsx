"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, FileSpreadsheet } from "lucide-react"

interface ExcelPreviewProps {
  data: any[]
  type: "certificate" | "idcard"
}

export default function ExcelPreview({ data, type }: ExcelPreviewProps) {
  console.log("ExcelPreview received data:", data)

  const [validationResults, setValidationResults] = useState<{
    isValid: boolean
    missingColumns: string[]
    suggestions: string[]
  }>({ isValid: true, missingColumns: [], suggestions: [] })

  useEffect(() => {
    if (data && data.length > 0) {
      validateData()
    }
  }, [data, type])

  const validateData = () => {
    if (!data || data.length === 0) return

    const requiredColumns =
      type === "certificate"
        ? ["Name", "Date_of_Birth", "Serial_Number"]
        : ["Name", "Date_of_Birth", "Serial_Number", "Photo_Name"]

    const availableColumns = Object.keys(data[0] || {})
    const missingColumns: string[] = []
    const suggestions: string[] = []

    // Check for required columns with flexible matching
    requiredColumns.forEach((required) => {
      const found = availableColumns.find((col) => {
        const colLower = col.toLowerCase()
        const reqLower = required.toLowerCase()

        if (reqLower.includes("name") && colLower.includes("name")) return true
        if (
          reqLower.includes("date") &&
          (colLower.includes("date") || colLower.includes("dob") || colLower.includes("birth"))
        )
          return true
        if (
          reqLower.includes("serial") &&
          (colLower.includes("serial") || colLower.includes("number") || colLower.includes("id"))
        )
          return true
        if (reqLower.includes("photo") && colLower.includes("photo")) return true

        return colLower === reqLower
      })

      if (!found) {
        missingColumns.push(required)
      }
    })

    // Check for gender column
    const hasGender = availableColumns.some((col) => {
      const colLower = col.toLowerCase()
      return colLower.includes("gender") || colLower.includes("sex")
    })

    if (!hasGender) {
      suggestions.push("Consider adding a 'Gender' column for automatic gender underlining on certificates")
    }

    setValidationResults({
      isValid: missingColumns.length === 0,
      missingColumns,
      suggestions,
    })
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" />
            Excel Data Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">Upload an Excel file to see validation results</div>
        </CardContent>
      </Card>
    )
  }

  const columns = Object.keys(data[0] || {})

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5" />
          Excel Data Validation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validation Status */}
        <div className="flex items-center gap-2">
          {validationResults.isValid ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700 font-medium">Data format is valid</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 font-medium">Data format needs attention</span>
            </>
          )}
        </div>

        {/* Column Information */}
        <div>
          <h4 className="font-medium mb-2">Available Columns ({columns.length}):</h4>
          <div className="flex flex-wrap gap-2">
            {columns.map((column) => (
              <Badge key={column} variant="outline" className="text-xs">
                {column}
              </Badge>
            ))}
          </div>
        </div>

        {/* Missing Columns Alert */}
        {validationResults.missingColumns.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <AlertDescription>
              <strong>Missing required columns:</strong> {validationResults.missingColumns.join(", ")}
              <br />
              <span className="text-sm">
                Please ensure your Excel file contains these columns for proper generation.
              </span>
            </AlertDescription>
          </Alert>
        )}

        {/* Suggestions */}
        {validationResults.suggestions.length > 0 && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription>
              <strong>Suggestions:</strong>
              <ul className="list-disc list-inside mt-1 text-sm">
                {validationResults.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Data Summary */}
        <div className="text-sm text-gray-600">
          <strong>Records loaded:</strong> {data.length}
        </div>
      </CardContent>
    </Card>
  )
}
