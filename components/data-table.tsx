"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"

interface DataTableProps {
  data: any[]
}

export default function DataTable({ data }: DataTableProps) {
  console.log("DataTable received data:", data)

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg font-medium mb-2">No data loaded</div>
            <div className="text-sm">Upload an Excel file to see data preview here</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const columns = Object.keys(data[0] || {})

  if (columns.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg font-medium mb-2">Invalid data format</div>
            <div className="text-sm">Please check your Excel file format</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="max-h-80 overflow-y-auto rounded-lg border bg-white">
      <Table>
        <TableHeader className="sticky top-0 bg-gray-50">
          <TableRow>
            <TableHead className="w-12 font-semibold">#</TableHead>
            {columns.map((column) => (
              <TableHead key={column} className="font-semibold min-w-32">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="font-medium text-gray-500">{index + 1}</TableCell>
              {columns.map((column) => (
                <TableCell key={column} className="max-w-48 truncate">
                  {row[column]?.toString() || "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data.length > 0 && (
        <div className="p-3 bg-gray-50 border-t text-sm text-gray-600 text-center">
          Showing {data.length} record{data.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  )
}
