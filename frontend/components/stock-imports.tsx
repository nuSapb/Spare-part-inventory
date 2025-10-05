"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Eye, User, Calendar, Package } from "lucide-react"
import { transactionsApi, employeesApi, type Transaction, type Employee } from "@/lib/api"
import { useParts } from "@/contexts/parts-context"

export function StockImports() {
  const { parts } = useParts()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingImport, setIsAddingImport] = useState(false)
  const [newImport, setNewImport] = useState({
    partId: "",
    quantity: "",
    employeeId: "",
    department: "",
    referenceNumber: "",
    notes: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [transData, empData] = await Promise.all([
        transactionsApi.getAll(),
        employeesApi.getAll(),
      ])
      // Filter only receive transactions
      setTransactions(transData.filter(t => t.transaction_type === 'receive'))
      setEmployees(empData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddImport = async () => {
    try {
      const employee = employees.find(e => e.employee_id === parseInt(newImport.employeeId))
      await transactionsApi.create({
        part_id: parseInt(newImport.partId),
        transaction_type: 'receive',
        quantity: parseInt(newImport.quantity),
        reference_number: newImport.referenceNumber,
        employee_name: employee?.name,
        department: newImport.department || employee?.department,
        notes: newImport.notes,
      })
      await fetchData()
      setIsAddingImport(false)
      setNewImport({
        partId: "",
        quantity: "",
        employeeId: "",
        department: "",
        referenceNumber: "",
        notes: "",
      })
    } catch (error) {
      console.error('Error adding import:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Imports</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.reduce((sum, t) => sum + t.quantity, 0)}</div>
            <p className="text-xs text-muted-foreground">Units received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Import</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions.length > 0 ? new Date(transactions[0].transaction_date).toLocaleDateString() : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">{transactions[0]?.employee_name || 'No imports'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Import History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Import History</CardTitle>
          <Dialog open={isAddingImport} onOpenChange={setIsAddingImport}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Record Import
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Import</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="partId">Part</Label>
                  <Select
                    value={newImport.partId}
                    onValueChange={(value) => setNewImport((prev) => ({ ...prev, partId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select part" />
                    </SelectTrigger>
                    <SelectContent>
                      {parts.map((part) => (
                        <SelectItem key={part.part_id} value={part.part_id.toString()}>
                          {part.part_number} - {part.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">Quantity Received</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newImport.quantity}
                    onChange={(e) => setNewImport((prev) => ({ ...prev, quantity: e.target.value }))}
                    placeholder="Enter quantity received"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="employeeId">Received By</Label>
                  <Select
                    value={newImport.employeeId}
                    onValueChange={(value) => setNewImport((prev) => ({ ...prev, employeeId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((emp) => (
                        <SelectItem key={emp.employee_id} value={emp.employee_id.toString()}>
                          {emp.name} - {emp.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="referenceNumber">Reference Number (PO#)</Label>
                  <Input
                    id="referenceNumber"
                    value={newImport.referenceNumber}
                    onChange={(e) => setNewImport((prev) => ({ ...prev, referenceNumber: e.target.value }))}
                    placeholder="PO-2024-XXX"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={newImport.notes}
                    onChange={(e) => setNewImport((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional notes about this import"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingImport(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddImport}>Record Import</Button>
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
                  <TableHead>Import ID</TableHead>
                  <TableHead>Part</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Imported By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No import transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction) => {
                    const part = parts.find(p => p.part_id === transaction.part_id)
                    return (
                      <TableRow key={transaction.transaction_id}>
                        <TableCell className="font-mono">#{transaction.transaction_id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{part?.description || 'Unknown Part'}</p>
                            <p className="text-sm text-muted-foreground font-mono">{part?.part_number || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-success/20 text-success">
                            +{transaction.quantity}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {transaction.employee_name || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(transaction.transaction_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" title={transaction.notes || 'No notes'}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
