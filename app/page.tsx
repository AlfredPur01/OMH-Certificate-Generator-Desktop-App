"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, Award, BadgeIcon as IdCard, Info, Table, FileImage, FileSpreadsheet, Images } from "lucide-react"
import LogoUpload from "@/components/logo-upload"
import FileUploadArea from "@/components/file-upload-area"
import CertificateGenerator from "@/components/certificate-generator"
import IdCardGenerator from "@/components/id-card-generator"
import DataTable from "@/components/data-table"
import PreviewArea from "@/components/preview-area"
import UserGuide from "@/components/user-guide"
import { useAppState } from "@/hooks/use-app-state"
import ExcelPreview from "@/components/excel-preview"

export default function CertificateApp() {
  const {
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
  } = useAppState()

  const [activeTab, setActiveTab] = useState("certificates")
  const [certAuthority, setCertAuthority] = useState("")
  const [idAuthority, setIdAuthority] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800">
      <div className="container mx-auto p-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 my-8">
          {/* Header */}
          <div className="text-center mb-8">
            <LogoUpload logo={logo} onLogoChange={setLogo} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Certificate & ID Card Generator
            </h1>
            <p className="text-gray-600 text-lg">
              Generate professional certificates and ID cards with security features
            </p>
          </div>

          {/* Alerts */}
          <div className="space-y-2 mb-6">
            {alerts.map((alert) => (
              <Alert
                key={alert.id}
                className={`border-l-4 ${
                  alert.type === "success"
                    ? "border-green-500 bg-green-50"
                    : alert.type === "error"
                      ? "border-red-500 bg-red-50"
                      : alert.type === "warning"
                        ? "border-yellow-500 bg-yellow-50"
                        : "border-blue-500 bg-blue-50"
                }`}
              >
                <AlertDescription className="flex justify-between items-center">
                  {alert.message}
                  <Button variant="ghost" size="sm" onClick={() => removeAlert(alert.id)} className="h-auto p-1">
                    ×
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="certificates" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Certificates
              </TabsTrigger>
              <TabsTrigger value="idcards" className="flex items-center gap-2">
                <IdCard className="w-4 h-4" />
                ID Cards
              </TabsTrigger>
              <TabsTrigger value="guide" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                User Guide
              </TabsTrigger>
            </TabsList>

            {/* Certificate Tab */}
            <TabsContent value="certificates">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Upload Files
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label className="text-base font-semibold mb-2 block">Certificate Template</Label>
                        <FileUploadArea
                          accept=".jpg,.jpeg,.png,.pdf"
                          onFileUpload={(file) => {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                              setTemplateImages((prev) => ({
                                ...prev,
                                certificate: e.target?.result as string,
                              }))
                              addAlert("Certificate template uploaded successfully!", "success")
                            }
                            reader.readAsDataURL(file)
                          }}
                          icon={<FileImage className="w-12 h-12 text-gray-400" />}
                          title="Click or drag to upload certificate template"
                          subtitle="Supported: JPG, PNG, PDF"
                        />
                      </div>

                      <div>
                        <Label className="text-base font-semibold mb-2 block">Excel Data File</Label>
                        <FileUploadArea
                          accept=".xls,.xlsx,.csv"
                          onFileUpload={async (file) => {
                            try {
                              addAlert("Processing Excel file...", "info")

                              // Load XLSX library if not loaded
                              if (!window.XLSX) {
                                const script = document.createElement("script")
                                script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
                                document.head.appendChild(script)
                                await new Promise((resolve) => {
                                  script.onload = resolve
                                })
                              }

                              const reader = new FileReader()
                              reader.onload = (e) => {
                                try {
                                  const data = new Uint8Array(e.target?.result as ArrayBuffer)
                                  const workbook = window.XLSX.read(data, { type: "array" })
                                  const sheetName = workbook.SheetNames[0]
                                  const worksheet = workbook.Sheets[sheetName]

                                  // Convert to JSON with proper handling
                                  const jsonData = window.XLSX.utils.sheet_to_json(worksheet, {
                                    header: 1,
                                    defval: "",
                                    blankrows: false,
                                  })

                                  if (jsonData.length === 0) {
                                    throw new Error("Excel file is empty")
                                  }

                                  // Process headers and data
                                  const headers = jsonData[0] as string[]
                                  const processedData = []

                                  for (let i = 1; i < jsonData.length; i++) {
                                    const row = jsonData[i] as any[]
                                    if (row.some((cell) => cell !== "")) {
                                      const rowObject: any = {}
                                      headers.forEach((header, index) => {
                                        if (header && header.trim()) {
                                          rowObject[header.trim()] = row[index] || ""
                                        }
                                      })
                                      processedData.push(rowObject)
                                    }
                                  }

                                  console.log("Processed certificate data:", processedData)
                                  setCertificateData(processedData)
                                  updateStats("certCount", processedData.length)
                                  addAlert(
                                    `Successfully loaded ${processedData.length} certificate records!`,
                                    "success",
                                  )
                                } catch (error) {
                                  console.error("Excel processing error:", error)
                                  addAlert("Error parsing Excel file. Please check the format.", "error")
                                }
                              }
                              reader.readAsArrayBuffer(file)
                            } catch (error) {
                              addAlert("Error loading Excel file.", "error")
                              console.error("File loading error:", error)
                            }
                          }}
                          icon={<FileSpreadsheet className="w-12 h-12 text-green-500" />}
                          title="Click or drag to upload Excel file"
                          subtitle="Supported: XLS, XLSX, CSV"
                        />
                      </div>

                      <div>
                        <Label htmlFor="cert-authority" className="text-base font-semibold">
                          Issuing Authority
                        </Label>
                        <Input
                          id="cert-authority"
                          value={certAuthority}
                          onChange={(e) => setCertAuthority(e.target.value)}
                          placeholder="Enter issuing authority name"
                          className="mt-2"
                        />
                      </div>

                      <CertificateGenerator
                        templateImage={templateImages.certificate}
                        data={certificateData}
                        authority={certAuthority}
                        logo={logo}
                        onGenerate={(count) => {
                          updateStats("certGenerated", count)
                          addAlert("Certificates generated successfully!", "success")
                        }}
                        onProgress={setProgress}
                        isGenerating={isGenerating}
                        setIsGenerating={setIsGenerating}
                      />
                    </CardContent>
                  </Card>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-blue-600 mb-1">{stats.certCount}</div>
                        <div className="text-gray-600">Certificates</div>
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-green-600 mb-1">{stats.certGenerated}</div>
                        <div className="text-gray-600">Generated</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-6">
                  <PreviewArea
                    title="Certificate Preview"
                    icon={<Award className="w-5 h-5" />}
                    emptyIcon={<Award className="w-20 h-20 text-gray-300" />}
                    emptyText="Certificate preview will appear here"
                    templateImage={templateImages.certificate}
                    type="certificate"
                  />

                  <div className="space-y-4">
                    <ExcelPreview data={certificateData} type="certificate" />
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Table className="w-5 h-5" />
                          Excel Data Preview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DataTable data={certificateData} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="mt-6">
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </TabsContent>

            {/* ID Cards Tab */}
            <TabsContent value="idcards">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5" />
                        Upload Files
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label className="text-base font-semibold mb-2 block">ID Card Template</Label>
                        <FileUploadArea
                          accept=".jpg,.jpeg,.png,.pdf"
                          onFileUpload={(file) => {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                              setTemplateImages((prev) => ({
                                ...prev,
                                idcard: e.target?.result as string,
                              }))
                              addAlert("ID card template uploaded successfully!", "success")
                            }
                            reader.readAsDataURL(file)
                          }}
                          icon={<FileImage className="w-12 h-12 text-gray-400" />}
                          title="Click or drag to upload ID card template"
                          subtitle="Supported: JPG, PNG, PDF"
                        />
                      </div>

                      <div>
                        <Label className="text-base font-semibold mb-2 block">Excel Data File</Label>
                        <FileUploadArea
                          accept=".xls,.xlsx,.csv"
                          onFileUpload={async (file) => {
                            try {
                              addAlert("Processing Excel file...", "info")

                              // Load XLSX library if not loaded
                              if (!window.XLSX) {
                                const script = document.createElement("script")
                                script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
                                document.head.appendChild(script)
                                await new Promise((resolve) => {
                                  script.onload = resolve
                                })
                              }

                              const reader = new FileReader()
                              reader.onload = (e) => {
                                try {
                                  const data = new Uint8Array(e.target?.result as ArrayBuffer)
                                  const workbook = window.XLSX.read(data, { type: "array" })
                                  const sheetName = workbook.SheetNames[0]
                                  const worksheet = workbook.Sheets[sheetName]

                                  // Convert to JSON with proper handling
                                  const jsonData = window.XLSX.utils.sheet_to_json(worksheet, {
                                    header: 1,
                                    defval: "",
                                    blankrows: false,
                                  })

                                  if (jsonData.length === 0) {
                                    throw new Error("Excel file is empty")
                                  }

                                  // Process headers and data
                                  const headers = jsonData[0] as string[]
                                  const processedData = []

                                  for (let i = 1; i < jsonData.length; i++) {
                                    const row = jsonData[i] as any[]
                                    if (row.some((cell) => cell !== "")) {
                                      const rowObject: any = {}
                                      headers.forEach((header, index) => {
                                        if (header && header.trim()) {
                                          rowObject[header.trim()] = row[index] || ""
                                        }
                                      })
                                      processedData.push(rowObject)
                                    }
                                  }

                                  console.log("Processed ID card data:", processedData)
                                  setIdCardData(processedData)
                                  updateStats("idCount", processedData.length)
                                  addAlert(`Successfully loaded ${processedData.length} ID card records!`, "success")
                                } catch (error) {
                                  console.error("Excel processing error:", error)
                                  addAlert("Error parsing Excel file. Please check the format.", "error")
                                }
                              }
                              reader.readAsArrayBuffer(file)
                            } catch (error) {
                              addAlert("Error loading Excel file.", "error")
                              console.error("File loading error:", error)
                            }
                          }}
                          icon={<FileSpreadsheet className="w-12 h-12 text-green-500" />}
                          title="Click or drag to upload Excel file"
                          subtitle="Supported: XLS, XLSX, CSV"
                        />
                      </div>

                      <div>
                        <Label className="text-base font-semibold mb-2 block">Photos</Label>
                        <FileUploadArea
                          accept="image/*"
                          multiple
                          onFileUpload={(files) => {
                            const newPhotoFiles: { [key: string]: string } = {}
                            let processed = 0

                            Array.from(files).forEach((file) => {
                              const reader = new FileReader()
                              reader.onload = (e) => {
                                newPhotoFiles[file.name] = e.target?.result as string
                                processed++

                                if (processed === files.length) {
                                  setPhotoFiles((prev) => ({ ...prev, ...newPhotoFiles }))
                                  addAlert(`Uploaded ${files.length} photos successfully!`, "success")
                                }
                              }
                              reader.readAsDataURL(file)
                            })
                          }}
                          icon={<Images className="w-12 h-12 text-blue-500" />}
                          title="Click or drag to upload photos"
                          subtitle="Multiple photos supported"
                        />
                      </div>

                      <div>
                        <Label htmlFor="id-authority" className="text-base font-semibold">
                          Issuing Authority
                        </Label>
                        <Input
                          id="id-authority"
                          value={idAuthority}
                          onChange={(e) => setIdAuthority(e.target.value)}
                          placeholder="Enter issuing authority name"
                          className="mt-2"
                        />
                      </div>

                      <IdCardGenerator
                        templateImage={templateImages.idcard}
                        data={idCardData}
                        authority={idAuthority}
                        logo={logo}
                        photoFiles={photoFiles}
                        onGenerate={(count) => {
                          updateStats("idGenerated", count)
                          addAlert("ID cards generated successfully!", "success")
                        }}
                        onProgress={setProgress}
                        isGenerating={isGenerating}
                        setIsGenerating={setIsGenerating}
                      />
                    </CardContent>
                  </Card>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-blue-600 mb-1">{stats.idCount}</div>
                        <div className="text-gray-600">ID Cards</div>
                      </CardContent>
                    </Card>
                    <Card className="text-center">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-green-600 mb-1">{stats.idGenerated}</div>
                        <div className="text-gray-600">Generated</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-6">
                  <PreviewArea
                    title="ID Card Preview"
                    icon={<IdCard className="w-5 h-5" />}
                    emptyIcon={<IdCard className="w-20 h-20 text-gray-300" />}
                    emptyText="ID card preview will appear here"
                    templateImage={templateImages.idcard}
                    type="idcard"
                  />

                  <div className="space-y-4">
                    <ExcelPreview data={idCardData} type="idcard" />
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Table className="w-5 h-5" />
                          Excel Data Preview
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <DataTable data={idCardData} />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="mt-6">
                  <Progress value={progress} className="w-full" />
                </div>
              )}
            </TabsContent>

            {/* User Guide Tab */}
            <TabsContent value="guide">
              <UserGuide />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
