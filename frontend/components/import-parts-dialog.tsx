"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Download, FileText, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Part } from "@/lib/types"

interface ImportPartsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImportParts: (parts: Omit<Part, "part_id" | "created_at" | "updated_at">[]) => void
}

interface ImportResult {
  success: number
  failed: number
  errors: string[]
}

export function ImportPartsDialog({ open, onOpenChange, onImportParts }: ImportPartsDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)

  const downloadTemplate = () => {
    const template = [
      ["Part Number", "Description", "Category", "Department", "Location", "Storage Detail", "Machine Used", "Current Stock", "Minimum Stock", "Unit", "Image URL"],
      ["PN-001", "Example Part", "Electronics", "Maintenance", "Warehouse", "A1-22", "Wave Soldering", "100", "20", "piece", ""],
      ["PN-002", "Sample Component", "Mechanical", "Production", "Test Area", "B2-15", "", "50", "10", "set", ""],
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "parts-import-template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Accept CSV files regardless of MIME type (Windows may report different types)
      if (selectedFile.name.endsWith('.csv') || selectedFile.type === "text/csv" || selectedFile.type === "application/vnd.ms-excel") {
        setFile(selectedFile)
        setResult(null)
      } else {
        alert("Please select a valid CSV file")
      }
    }
  }

  const parseCSV = (text: string): string[][] => {
    const lines: string[][] = []
    let currentLine: string[] = []
    let currentField = ""
    let inQuotes = false

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const nextChar = text[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentField += '"'
          i++
        } else {
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        currentLine.push(currentField)
        currentField = ""
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (currentField || currentLine.length > 0) {
          currentLine.push(currentField)
          if (currentLine.some(field => field.trim())) {
            lines.push(currentLine)
          }
          currentLine = []
          currentField = ""
        }
        if (char === '\r' && nextChar === '\n') i++
      } else {
        currentField += char
      }
    }

    if (currentField || currentLine.length > 0) {
      currentLine.push(currentField)
      if (currentLine.some(field => field.trim())) {
        lines.push(currentLine)
      }
    }

    return lines
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    const errors: string[] = []
    const validParts: Omit<Part, "part_id" | "created_at" | "updated_at">[] = []

    try {
      const text = await file.text()
      const rows = parseCSV(text)

      if (rows.length < 2) {
        errors.push("CSV file is empty or missing data rows")
        setResult({ success: 0, failed: 0, errors })
        setImporting(false)
        return
      }

      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i]
        const rowNum = i + 1

        try {
          // Validate required fields
          if (!row[0]?.trim()) {
            errors.push(`Row ${rowNum}: Part Number is required`)
            continue
          }
          if (!row[1]?.trim()) {
            errors.push(`Row ${rowNum}: Description is required`)
            continue
          }
          if (!row[2]?.trim()) {
            errors.push(`Row ${rowNum}: Category is required`)
            continue
          }
          if (!row[3]?.trim()) {
            errors.push(`Row ${rowNum}: Department is required`)
            continue
          }
          if (!row[4]?.trim()) {
            errors.push(`Row ${rowNum}: Location is required`)
            continue
          }

          const currentStock = parseInt(row[7] || "0")
          const minimumStock = parseInt(row[8] || "0")

          if (isNaN(currentStock) || currentStock < 0) {
            errors.push(`Row ${rowNum}: Invalid current stock value`)
            continue
          }
          if (isNaN(minimumStock) || minimumStock < 0) {
            errors.push(`Row ${rowNum}: Invalid minimum stock value`)
            continue
          }

          validParts.push({
            part_number: row[0].trim(),
            description: row[1].trim(),
            category: row[2].trim(),
            department: row[3].trim(),
            location: row[4].trim(),
            storage_detail: row[5]?.trim() || null,
            machine_used: row[6]?.trim() || null,
            current_stock: currentStock,
            minimum_stock: minimumStock,
            unit: row[9]?.trim() || "piece",
            image_url: row[10]?.trim() || null,
          })
        } catch (error) {
          errors.push(`Row ${rowNum}: ${error instanceof Error ? error.message : "Unknown error"}`)
        }
      }

      if (validParts.length > 0) {
        onImportParts(validParts)
      }

      setResult({
        success: validParts.length,
        failed: errors.length,
        errors,
      })
    } catch (error) {
      errors.push(`File processing error: ${error instanceof Error ? error.message : "Unknown error"}`)
      setResult({ success: 0, failed: 1, errors })
    }

    setImporting(false)
  }

  const handleClose = () => {
    setFile(null)
    setResult(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Parts from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple parts at once
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Download Template */}
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Download the CSV template to get started</span>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </AlertDescription>
          </Alert>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="csv-file">Select CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={importing}
            />
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {/* Import Result */}
          {result && (
            <div className="space-y-2">
              <Alert variant={result.failed === 0 ? "default" : "destructive"}>
                {result.failed === 0 ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="font-medium">Import Complete</div>
                  <div className="mt-1">
                    Successfully imported: {result.success} parts
                    {result.failed > 0 && ` • Failed: ${result.failed} rows`}
                  </div>
                </AlertDescription>
              </Alert>

              {result.errors.length > 0 && (
                <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
                  <p className="text-sm font-medium mb-2">Errors:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {result.errors.map((error, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="bg-muted p-4 rounded-md text-sm space-y-2">
            <p className="font-medium">CSV Format Instructions:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>First row must be the header (will be skipped)</li>
              <li>Required columns: Part Number, Description, Category, Department, Location</li>
              <li>Optional columns: Storage Detail, Machine Used, Image URL</li>
              <li>Stock values must be numeric (0 or greater)</li>
              <li>Unit defaults to "piece" if not specified</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={importing}>
            {result ? "Close" : "Cancel"}
          </Button>
          {!result && (
            <Button onClick={handleImport} disabled={!file || importing}>
              <Upload className="h-4 w-4 mr-2" />
              {importing ? "Importing..." : "Import Parts"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
