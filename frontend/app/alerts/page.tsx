"use client"

import { Sidebar } from "@/components/sidebar"
import { AlertsOverview } from "@/components/alerts-overview"
import { AlertsTable } from "@/components/alerts-table"
import { AlertSettings } from "@/components/alert-settings"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Settings, CheckCircle } from "lucide-react"

export default function AlertsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-64 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Alert Management</h1>
              <p className="text-muted-foreground">Monitor and manage inventory alerts and notifications</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Test Alert
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Alert Overview
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Active Alerts
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <AlertsOverview />
            </TabsContent>

            <TabsContent value="active">
              <AlertsTable />
            </TabsContent>

            <TabsContent value="settings">
              <AlertSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
