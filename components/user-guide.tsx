"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Upload, Award, FileSpreadsheet, Shield, Lightbulb, Target } from "lucide-react"

export default function UserGuide() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="w-6 h-6" />
            User Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Getting Started */}
          <section>
            <h3 className="text-xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Getting Started
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                <strong>Upload Logo:</strong> Click the circular upload area at the top to add your organization's logo
              </li>
              <li>
                <strong>Choose Type:</strong> Select between Certificate or ID Card generation
              </li>
              <li>
                <strong>Upload Template:</strong> Add your certificate template (the system will auto-detect field
                positions)
              </li>
              <li>
                <strong>Upload Data:</strong> Add your Excel file with user information
              </li>
              <li>
                <strong>Generate:</strong> Process all your documents at once
              </li>
            </ol>
          </section>

          {/* Medical Certificate Specific */}
          <section>
            <h3 className="text-xl font-semibold text-green-600 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Medical Certificate of Fitness
            </h3>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-green-800 font-medium mb-2">Optimized for Nigerian Medical Certificates</p>
              <p className="text-green-700 text-sm">
                This system is specifically configured for the Ministry of Health Medical Certificate of Fitness
                template.
              </p>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>
                <strong>Template Recognition:</strong> The system automatically detects the medical certificate template
              </li>
              <li>
                <strong>Precise Field Mapping:</strong> Name, NIN, DOB, and gender fields are positioned exactly
              </li>
              <li>
                <strong>Gender Underlining:</strong> Male/Female options are automatically underlined based on data
              </li>
              <li>
                <strong>Security Features:</strong> Barcode and QR code placement optimized for the template
              </li>
            </ol>
          </section>

          {/* Excel File Format */}
          <section>
            <h3 className="text-xl font-semibold text-orange-600 mb-4 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5" />
              Excel File Format for Medical Certificates
            </h3>
            <p className="text-gray-700 mb-3">Your Excel file should contain the following columns:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Name</Badge>
                <span className="text-sm text-gray-600">Full name of the person</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">NIN</Badge>
                <span className="text-sm text-gray-600">National Identification Number</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">DOB</Badge>
                <span className="text-sm text-gray-600">Date of birth (DD/MM/YYYY format)</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Gender</Badge>
                <span className="text-sm text-gray-600">Male or Female (for underlining)</span>
              </div>
            </div>
          </section>

          {/* Template Configuration */}
          <section>
            <h3 className="text-xl font-semibold text-purple-600 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Template Field Positioning
            </h3>
            <div className="bg-purple-50 p-4 rounded-lg mb-4">
              <p className="text-purple-800 font-medium mb-2">Precise Coordinate Mapping</p>
              <p className="text-purple-700 text-sm">
                Each field is positioned using exact coordinates for pixel-perfect placement.
              </p>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Name Field:</strong> Centered on the dotted line (X: 400, Y: 380)
              </li>
              <li>
                <strong>NIN Field:</strong> After "NIN:" label (X: 200, Y: 550)
              </li>
              <li>
                <strong>DOB Field:</strong> After "DOB:" label (X: 500, Y: 550)
              </li>
              <li>
                <strong>Gender Underlining:</strong> Male (X: 280) / Female (X: 380) at Y: 345
              </li>
              <li>
                <strong>Barcode:</strong> Centered below fields (X: 300, Y: 580)
              </li>
            </ul>
          </section>

          {/* Security Features */}
          <section>
            <h3 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Features
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>QR Code:</strong> Contains all user information and authority details (top-right corner)
              </li>
              <li>
                <strong>Barcode:</strong> Contains NIN for quick verification (center-bottom)
              </li>
              <li>
                <strong>Unique Identifiers:</strong> Each certificate has a unique NIN
              </li>
              <li>
                <strong>Authority Info:</strong> Issuing authority details embedded in security codes
              </li>
              <li>
                <strong>Tamper-Evident:</strong> Precise positioning makes forgery difficult
              </li>
            </ul>
          </section>

          {/* Offline & Desktop Features */}
          <section>
            <h3 className="text-xl font-semibold text-indigo-600 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Offline & Desktop Features
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                <strong>Fully Offline:</strong> Works without internet connection after initial setup
              </li>
              <li>
                <strong>Desktop Application:</strong> Runs as standalone Electron app
              </li>
              <li>
                <strong>Local File Processing:</strong> All data processing happens locally
              </li>
              <li>
                <strong>Batch Processing:</strong> Generate hundreds of certificates at once
              </li>
              <li>
                <strong>High-Quality Output:</strong> PDF and print-ready formats
              </li>
            </ul>
          </section>

          {/* Tips */}
          <section>
            <h3 className="text-xl font-semibold text-yellow-600 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Tips for Best Results
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Use the exact Medical Certificate template provided for best results</li>
              <li>Ensure Excel column names match exactly: Name, NIN, DOB, Gender</li>
              <li>Use DD/MM/YYYY format for dates</li>
              <li>Keep names under 50 characters for proper fitting</li>
              <li>Test with a small batch first before processing large files</li>
              <li>Verify gender spelling (Male/Female) for proper underlining</li>
              <li>Use high-resolution template images (minimum 800x1000 pixels)</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
