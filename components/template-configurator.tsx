"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Save, Eye } from "lucide-react"
import type { TemplateConfig, FieldMapping } from "@/lib/template-mapper"

interface TemplateConfiguratorProps {
  templateImage: string | undefined
  onConfigUpdate: (config: TemplateConfig) => void
}

export default function TemplateConfigurator({ templateImage, onConfigUpdate }: TemplateConfiguratorProps) {
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [selectedField, setSelectedField] = useState<string>("name")
  const [fieldConfig, setFieldConfig] = useState<FieldMapping>({
    x: 400,
    y: 380,
    fontSize: 18,
    fontFamily: "Arial",
    fontWeight: "normal",
    color: "#000000",
    align: "center",
  })

  const handleFieldUpdate = (field: string, value: any) => {
    setFieldConfig((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSaveConfiguration = () => {
    // This would save the configuration for the current template
    console.log("Saving configuration for field:", selectedField, fieldConfig)
    // In a real implementation, this would update the template configuration
  }

  const handlePreview = () => {
    // This would show a preview with the current configuration
    console.log("Previewing configuration")
  }

  if (!templateImage) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Upload a template to configure field positions</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Template Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={isConfiguring ? "default" : "outline"}
            size="sm"
            onClick={() => setIsConfiguring(!isConfiguring)}
          >
            {isConfiguring ? "Exit Config" : "Configure Fields"}
          </Button>
        </div>

        {isConfiguring && (
          <div className="space-y-4">
            <div>
              <Label>Select Field</Label>
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="nin">NIN</SelectItem>
                  <SelectItem value="dob">Date of Birth</SelectItem>
                  <SelectItem value="authority">Authority</SelectItem>
                  <SelectItem value="issueDate">Issue Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>X Position</Label>
                <Input
                  type="number"
                  value={fieldConfig.x}
                  onChange={(e) => handleFieldUpdate("x", Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Y Position</Label>
                <Input
                  type="number"
                  value={fieldConfig.y}
                  onChange={(e) => handleFieldUpdate("y", Number.parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Font Size</Label>
                <Input
                  type="number"
                  value={fieldConfig.fontSize}
                  onChange={(e) => handleFieldUpdate("fontSize", Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Font Weight</Label>
                <Select
                  value={fieldConfig.fontWeight}
                  onValueChange={(value) => handleFieldUpdate("fontWeight", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Text Alignment</Label>
              <Select value={fieldConfig.align} onValueChange={(value) => handleFieldUpdate("align", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Text Color</Label>
              <Input
                type="color"
                value={fieldConfig.color}
                onChange={(e) => handleFieldUpdate("color", e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handlePreview} variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={handleSaveConfiguration} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Config
              </Button>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>
            <strong>Current Template:</strong> Medical Certificate of Fitness
          </p>
          <p>
            <strong>Configured Fields:</strong> Name, NIN, DOB, Gender (with underlining)
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
