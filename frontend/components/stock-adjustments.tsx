"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

const adjustmentTypes = [
  { value: "increase", label: "Stock Increase", icon: TrendingUp, color: "text-success" },
  { value: "decrease", label: "Stock Decrease", icon: TrendingDown, color: "text-destructive" },
  { value: "correction", label: "Stock Correction", icon: AlertCircle, color: "text-warning" },
]

const adjustmentReasons = [
  "Physical count correction",
  "Damaged goods removal",
  "Found inventory",
  "System error correction",
  "Theft/Loss",
  "Quality control rejection",
  "Other",
]

const adjustmentHistory = [
  {
    id: 1,
    partNumber: "10000187-A",
    partName: "Intel Gigabit CT Adapter",
    type: "decrease",
    oldQuantity: 15,
    newQuantity: 5,
    adjustedBy: "Supervisor D",
    reason: "Physical count correction",
    date: "2025-09-22 10:30",
    notes: "Annual inventory count revealed discrepancy",
  },
  {
    id: 2,
    partNumber: "G104SN03 V5",
    partName: "10.4'' LVDS Panel",
    type: "increase",
    oldQuantity: 20,
    newQuantity: 23,
    adjustedBy: "Technician A",
    reason: "Found inventory",
    date: "2025-09-21 14:15",
    notes: "Found 3 units in secondary storage",
  },
]

export function StockAdjustments() {
  const [isAddingAdjustment, setIsAddingAdjustment] = useState(false)
  const [newAdjustment, setNewAdjustment] = useState({
    partNumber: "",
    type: "",
    currentStock: "",
    newStock: "",
    reason: "",
    notes: "",
  })

  const handleAddAdjustment = () => {
    console.log("Adding adjustment:", newAdjustment)
    setIsAddingAdjustment(false)
    setNewAdjustment({
      partNumber: "",
      type: "",
      currentStock: "",
      newStock: "",
      reason: "",
      notes: "",
    })
  }

  const getAdjustmentBadge = (type: string, oldQty: number, newQty: number) => {
    const adjustment = adjustmentTypes.find((adj) => adj.value === type)
    if (!adjustment) return null

    const Icon = adjustment.icon
    const difference = newQty - oldQty
    const sign = difference > 0 ? "+" : ""

    return (
      <Badge variant="outline" className={`${adjustment.color} border-current`}>
        <Icon className="h-3 w-3 mr-1" />
        {sign}
        {difference}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Adjustments</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adjustmentHistory.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Change</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">-7</div>
            <p className="text-xs text-muted-foreground">Units adjusted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Adjustment</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Yesterday</div>
            <p className="text-xs text-muted-foreground">Physical count</p>
          </CardContent>
        </Card>
      </div>

      {/* Adjustment Form and History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Stock Adjustments</CardTitle>
          <Dialog open={isAddingAdjustment} onOpenChange={setIsAddingAdjustment}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Adjustment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Stock Adjustment</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="partNumber">Part Number</Label>
                  <Input
                    id="partNumber"
                    value={newAdjustment.partNumber}
                    onChange={(e) => setNewAdjustment((prev) => ({ ...prev, partNumber: e.target.value }))}
                    placeholder="Enter part number"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Adjustment Type</Label>
                  <Select
                    value={newAdjustment.type}
                    onValueChange={(value) => setNewAdjustment((prev) => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select adjustment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {adjustmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className={`h-4 w-4 ${type.color}`} />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentStock">Current Stock</Label>
                    <Input
                      id="currentStock"
                      type="number"
                      value={newAdjustment.currentStock}
                      onChange={(e) => setNewAdjustment((prev) => ({ ...prev, currentStock: e.target.value }))}
                      placeholder="Current quantity"
                      disabled
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="newStock">New Stock</Label>
                    <Input
                      id="newStock"
                      type="number"
                      value={newAdjustment.newStock}
                      onChange={(e) => setNewAdjustment((prev) => ({ ...prev, newStock: e.target.value }))}
                      placeholder="New quantity"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Select
                    value={newAdjustment.reason}
                    onValueChange={(value) => setNewAdjustment((prev) => ({ ...prev, reason: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {adjustmentReasons.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newAdjustment.notes}
                    onChange={(e) => setNewAdjustment((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Additional details about this adjustment"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingAdjustment(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAdjustment}>Create Adjustment</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Stock Change</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Adjusted By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adjustmentHistory.map((adjustment) => (
                  <TableRow key={adjustment.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{adjustment.partName}</p>
                        <p className="text-sm text-muted-foreground font-mono">{adjustment.partNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getAdjustmentBadge(adjustment.type, adjustment.oldQuantity, adjustment.newQuantity)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="text-muted-foreground">{adjustment.oldQuantity}</span>
                        <span className="mx-2">→</span>
                        <span className="font-medium">{adjustment.newQuantity}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{adjustment.reason}</TableCell>
                    <TableCell className="text-sm">{adjustment.adjustedBy}</TableCell>
                    <TableCell className="text-sm">{adjustment.date}</TableCell>
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
