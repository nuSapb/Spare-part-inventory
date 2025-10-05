"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, CheckSquare, Square } from "lucide-react"

const bulkOperations = [
  { value: "update-stock", label: "Update Stock Levels" },
  { value: "update-location", label: "Update Locations" },
  { value: "update-minimum", label: "Update Minimum Stock" },
  { value: "export-data", label: "Export Selected Data" },
]

const sampleParts = [
  {
    id: 1,
    partNumber: "10000187-A",
    partName: "Intel Gigabit CT Adapter",
    currentStock: 5,
    location: "Warehouse",
    minimumStock: 10,
  },
  {
    id: 2,
    partNumber: "G104SN03 V5",
    partName: "10.4'' LVDS Panel",
    currentStock: 23,
    location: "Test Area",
    minimumStock: 5,
  },
  {
    id: 3,
    partNumber: "G156HTN01.0",
    partName: "15.6'' TFT-LCD Display",
    currentStock: 1,
    location: "Maintenance Area",
    minimumStock: 3,
  },
]

export function BulkOperations() {
  const [selectedParts, setSelectedParts] = useState<number[]>([])
  const [selectedOperation, setSelectedOperation] = useState("")
  const [bulkValue, setBulkValue] = useState("")

  const handleSelectAll = () => {
    if (selectedParts.length === sampleParts.length) {
      setSelectedParts([])
    } else {
      setSelectedParts(sampleParts.map((part) => part.id))
    }
  }

  const handleSelectPart = (partId: number) => {
    setSelectedParts((prev) => (prev.includes(partId) ? prev.filter((id) => id !== partId) : [...prev, partId]))
  }

  const handleBulkOperation = () => {
    console.log("Performing bulk operation:", {
      operation: selectedOperation,
      parts: selectedParts,
      value: bulkValue,
    })
  }

  const isAllSelected = selectedParts.length === sampleParts.length
  const isPartiallySelected = selectedParts.length > 0 && selectedParts.length < sampleParts.length

  return (
    <div className="space-y-6">
      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedOperation} onValueChange={setSelectedOperation}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select operation" />
              </SelectTrigger>
              <SelectContent>
                {bulkOperations.map((op) => (
                  <SelectItem key={op.value} value={op.value}>
                    {op.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedOperation && selectedOperation !== "export-data" && (
              <Input
                placeholder="Enter new value"
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                className="w-full sm:w-48"
              />
            )}

            <Button
              onClick={handleBulkOperation}
              disabled={!selectedOperation || selectedParts.length === 0}
              className="w-full sm:w-auto"
            >
              Apply to {selectedParts.length} items
            </Button>
          </div>

          {selectedParts.length > 0 && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>{selectedParts.length}</strong> parts selected for bulk operation
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import/Export Tools */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Upload a CSV file to bulk import or update part information</p>
            <div className="flex items-center gap-2">
              <Input type="file" accept=".csv" className="flex-1" />
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
            <Button variant="link" size="sm" className="p-0 h-auto">
              Download CSV template
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Export selected parts data to CSV format</p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export All Parts
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export Low Stock Items
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parts Selection Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Select Parts for Bulk Operations</span>
            <Badge variant="outline">
              {selectedParts.length} of {sampleParts.length} selected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Button variant="ghost" size="sm" onClick={handleSelectAll} className="h-8 w-8 p-0">
                      {isAllSelected ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : isPartiallySelected ? (
                        <Square className="h-4 w-4 opacity-50" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>Part Number</TableHead>
                  <TableHead>Part Name</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Min Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleParts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedParts.includes(part.id)}
                        onCheckedChange={() => handleSelectPart(part.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-sm">{part.partNumber}</TableCell>
                    <TableCell className="font-medium">{part.partName}</TableCell>
                    <TableCell>
                      <Badge variant={part.currentStock <= part.minimumStock ? "destructive" : "default"}>
                        {part.currentStock}
                      </Badge>
                    </TableCell>
                    <TableCell>{part.location}</TableCell>
                    <TableCell>{part.minimumStock}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
