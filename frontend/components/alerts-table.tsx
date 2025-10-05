"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Eye, CheckCircle, AlertTriangle, MapPin, Clock } from "lucide-react"

// Sample alert data based on the provided table structure
const alertsData = [
  {
    alertId: 501,
    partId: 1,
    partNumber: "10000187-A",
    partName: "Intel Gigabit CT Adapter",
    currentStock: 0,
    minStock: 10,
    location: "Warehouse",
    status: "active",
    severity: "critical",
    createdAt: "2025-09-21 14:05",
    resolvedAt: null,
    assignedTo: "Supervisor D",
    notes: "Urgent reorder required for production",
  },
  {
    alertId: 502,
    partId: 3,
    partNumber: "G156HTN01.0",
    partName: "15.6'' TFT-LCD Display",
    currentStock: 1,
    minStock: 3,
    location: "Maintenance Area",
    status: "active",
    severity: "warning",
    createdAt: "2025-09-22 15:05",
    resolvedAt: null,
    assignedTo: "Technician A",
    notes: "Monitor stock levels closely",
  },
  {
    alertId: 503,
    partId: 4,
    partNumber: "PWR-001",
    partName: "Power Supply Unit 24V",
    currentStock: 8,
    minStock: 8,
    location: "Warehouse",
    status: "resolved",
    severity: "warning",
    createdAt: "2025-09-20 10:30",
    resolvedAt: "2025-09-21 09:15",
    assignedTo: "Manager E",
    notes: "Stock replenished successfully",
  },
]

const severityOptions = ["All Severities", "Critical", "Warning", "Info"]
const statusOptions = ["All Status", "Active", "Resolved", "Pending"]
const assigneeOptions = ["All Assignees", "Supervisor D", "Technician A", "Technician B", "Manager E"]

export function AlertsTable() {
  const [selectedAlert, setSelectedAlert] = useState<(typeof alertsData)[0] | null>(null)
  const [isResolvingAlert, setIsResolvingAlert] = useState(false)
  const [resolutionNotes, setResolutionNotes] = useState("")
  const [filters, setFilters] = useState({
    severity: "All Severities",
    status: "All Status",
    assignee: "All Assignees",
  })

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "warning":
        return (
          <Badge variant="secondary" className="bg-warning/20 text-warning">
            Warning
          </Badge>
        )
      case "info":
        return (
          <Badge variant="default" className="bg-info/20 text-info">
            Info
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Active</Badge>
      case "resolved":
        return (
          <Badge variant="default" className="bg-success/20 text-success">
            Resolved
          </Badge>
        )
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleResolveAlert = (alertId: number) => {
    console.log(`Resolving alert ${alertId} with notes: ${resolutionNotes}`)
    setIsResolvingAlert(false)
    setResolutionNotes("")
  }

  const getDaysActive = (createdAt: string, resolvedAt: string | null) => {
    const created = new Date(createdAt)
    const resolved = resolvedAt ? new Date(resolvedAt) : new Date()
    const diffTime = Math.abs(resolved.getTime() - created.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input placeholder="Search alerts by part number or name..." className="pl-4" />
            </div>
            <div className="flex gap-2">
              <Select
                value={filters.severity}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, severity: value }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {severityOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.status}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.assignee}
                onValueChange={(value) => setFilters((prev) => ({ ...prev, assignee: value }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assigneeOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Alerts ({alertsData.filter((a) => a.status === "active").length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert ID</TableHead>
                  <TableHead>Part</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertsData.map((alert) => (
                  <TableRow key={alert.alertId}>
                    <TableCell className="font-mono">#{alert.alertId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{alert.partName}</p>
                        <p className="text-xs text-muted-foreground font-mono">{alert.partNumber}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">{alert.location}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span
                          className={`font-medium ${alert.currentStock === 0 ? "text-destructive" : alert.currentStock <= alert.minStock ? "text-warning" : "text-success"}`}
                        >
                          {alert.currentStock}
                        </span>
                        <span className="text-muted-foreground"> / {alert.minStock} min</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(alert.status)}</TableCell>
                    <TableCell className="text-sm">{alert.assignedTo}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{getDaysActive(alert.createdAt, alert.resolvedAt)}d</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(alert)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Alert Details</DialogTitle>
                            </DialogHeader>
                            {selectedAlert && (
                              <div className="grid gap-6">
                                {/* Alert Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Alert ID</label>
                                    <p className="font-mono text-lg">#{selectedAlert.alertId}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Severity</label>
                                    <div className="mt-1">{getSeverityBadge(selectedAlert.severity)}</div>
                                  </div>
                                </div>

                                {/* Part Info */}
                                <div className="border rounded-lg p-4 bg-muted/20">
                                  <h4 className="font-medium mb-3">Part Information</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Part Number</label>
                                      <p className="font-mono">{selectedAlert.partNumber}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Part Name</label>
                                      <p>{selectedAlert.partName}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Current Stock</label>
                                      <p className="text-2xl font-bold text-destructive">
                                        {selectedAlert.currentStock}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Minimum Stock</label>
                                      <p className="text-2xl font-bold">{selectedAlert.minStock}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Alert Details */}
                                <div className="border rounded-lg p-4 bg-muted/20">
                                  <h4 className="font-medium mb-3">Alert Details</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                                      <div className="mt-1">{getStatusBadge(selectedAlert.status)}</div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                                      <p>{selectedAlert.assignedTo}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Created</label>
                                      <p>{selectedAlert.createdAt}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Days Active</label>
                                      <p>{getDaysActive(selectedAlert.createdAt, selectedAlert.resolvedAt)} days</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Notes */}
                                {selectedAlert.notes && (
                                  <div>
                                    <label className="text-sm font-medium text-muted-foreground">Notes</label>
                                    <p className="mt-1 p-3 bg-muted/50 rounded-lg text-sm">{selectedAlert.notes}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        {alert.status === "active" && (
                          <Dialog open={isResolvingAlert} onOpenChange={setIsResolvingAlert}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Resolve Alert</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="resolution-notes">Resolution Notes</Label>
                                  <Textarea
                                    id="resolution-notes"
                                    value={resolutionNotes}
                                    onChange={(e) => setResolutionNotes(e.target.value)}
                                    placeholder="Describe how this alert was resolved..."
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setIsResolvingAlert(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={() => handleResolveAlert(alert.alertId)}>Resolve Alert</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
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
