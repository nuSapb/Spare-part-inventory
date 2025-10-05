"use client"

import { Sidebar } from "@/components/sidebar"
import { EmployeeList } from "@/components/employee-list"
import { EmployeeStats } from "@/components/employee-stats"
import { Button } from "@/components/ui/button"
import { UserPlus, Download } from "lucide-react"

export default function EmployeesPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Employee Management</h1>
              <p className="text-muted-foreground">Manage employees and their access to the inventory system</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>

          {/* Stats */}
          <EmployeeStats />

          {/* Employee List */}
          <EmployeeList />
        </div>
      </main>
    </div>
  )
}
