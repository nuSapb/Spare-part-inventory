"use client"

import { Sidebar } from "@/components/sidebar"
import { StockImports } from "@/components/stock-imports"
import { StockAdjustments } from "@/components/stock-adjustments"
import { BulkOperations } from "@/components/bulk-operations"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Upload, Download, Package } from "lucide-react"

export default function StockPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Stock Management</h1>
              <p className="text-muted-foreground">Import, adjust, and manage inventory levels</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Import
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="imports" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="imports" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Stock Imports
              </TabsTrigger>
              <TabsTrigger value="adjustments" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Adjustments
              </TabsTrigger>
              <TabsTrigger value="bulk" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Bulk Operations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="imports">
              <StockImports />
            </TabsContent>

            <TabsContent value="adjustments">
              <StockAdjustments />
            </TabsContent>

            <TabsContent value="bulk">
              <BulkOperations />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
