"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { PartsTable } from "@/components/parts-table"
import { PartsFilters } from "@/components/parts-filters"
import { AddPartDialog } from "@/components/add-part-dialog"
import { ImportPartsDialog } from "@/components/import-parts-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Download, Upload } from "lucide-react"
import { PartsProvider, useParts } from "@/contexts/parts-context"

function PartsPageContent() {
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const { addPart, importParts, filteredParts } = useParts()

  const handleExport = () => {
    const csv = [
      ["Part Number", "Description", "Category", "Department", "Location", "Current Stock", "Minimum Stock", "Unit"].join(","),
      ...filteredParts.map((part) =>
        [
          part.part_number,
          `"${part.description}"`,
          part.category,
          part.department,
          part.location,
          part.current_stock,
          part.minimum_stock,
          part.unit,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `parts-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Parts Catalog</h1>
              <p className="text-muted-foreground">Manage your spare parts inventory</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setImportDialogOpen(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" onClick={() => setAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Part
              </Button>
            </div>
          </div>

          {/* Filters */}
          <PartsFilters />

          {/* Parts Table */}
          <PartsTable />
        </div>
      </main>

      <AddPartDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAddPart={addPart} />
      <ImportPartsDialog open={importDialogOpen} onOpenChange={setImportDialogOpen} onImportParts={importParts} />
    </div>
  )
}

export default function PartsPage() {
  return (
    <PartsProvider>
      <PartsPageContent />
    </PartsProvider>
  )
}
