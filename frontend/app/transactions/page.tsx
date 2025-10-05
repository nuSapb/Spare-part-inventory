"use client"

import { Sidebar } from "@/components/sidebar"
import { TransactionHistory } from "@/components/transaction-history"
import { TransactionFilters } from "@/components/transaction-filters"
import { TransactionStats } from "@/components/transaction-stats"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"

export default function TransactionsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Transaction History</h1>
              <p className="text-muted-foreground">Track all part issues, returns, and employee activities</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Stats */}
          <TransactionStats />

          {/* Filters */}
          <TransactionFilters />

          {/* Transaction History */}
          <TransactionHistory />
        </div>
      </main>
    </div>
  )
}
