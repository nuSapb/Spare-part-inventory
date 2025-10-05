"use client"

import { Sidebar } from "@/components/sidebar"
import { BarcodeScanner } from "@/components/barcode-scanner"

export default function ScannerPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Barcode Scanner</h1>
              <p className="text-muted-foreground">Scan parts for quick lookup and transactions</p>
            </div>
          </div>

          <BarcodeScanner />
        </div>
      </main>
    </div>
  )
}
