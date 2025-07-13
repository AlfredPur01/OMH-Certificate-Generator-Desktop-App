"use client"

declare global {
  interface Window {
    XLSX: any
  }
}

export async function loadExcelLibrary() {
  if (!window.XLSX) {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
    document.head.appendChild(script)

    await new Promise((resolve) => {
      script.onload = resolve
    })
  }
}

export function processExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        await loadExcelLibrary()

        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = window.XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        // Convert to JSON with header row
        const jsonData = window.XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
          blankrows: false,
        })

        if (jsonData.length === 0) {
          throw new Error("Excel file is empty")
        }

        // Get headers from first row
        const headers = jsonData[0] as string[]

        // Convert remaining rows to objects
        const processedData = []
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[]
          if (row.some((cell) => cell !== "")) {
            // Skip empty rows
            const rowObject: any = {}
            headers.forEach((header, index) => {
              if (header && header.trim()) {
                rowObject[header.trim()] = row[index] || ""
              }
            })
            processedData.push(rowObject)
          }
        }

        console.log("Processed Excel data:", processedData)
        resolve(processedData)
      } catch (error) {
        console.error("Excel processing error:", error)
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsArrayBuffer(file)
  })
}

// Helper function to normalize column names
export function normalizeColumnNames(data: any[]): any[] {
  return data.map((row) => {
    const normalizedRow: any = {}

    Object.keys(row).forEach((key) => {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "_")

      // Map common variations to standard names
      if (normalizedKey.includes("name")) {
        normalizedRow.Name = row[key]
      } else if (normalizedKey.includes("date") && normalizedKey.includes("birth")) {
        normalizedRow.Date_of_Birth = row[key]
      } else if (normalizedKey.includes("dob")) {
        normalizedRow.Date_of_Birth = row[key]
      } else if (normalizedKey.includes("serial") || normalizedKey.includes("number")) {
        normalizedRow.Serial_Number = row[key]
      } else if (normalizedKey.includes("gender") || normalizedKey.includes("sex")) {
        normalizedRow.Gender = row[key]
      } else if (normalizedKey.includes("photo")) {
        normalizedRow.Photo_Name = row[key]
      } else {
        normalizedRow[key] = row[key]
      }
    })

    return normalizedRow
  })
}
