"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, ArrowUpRight, ArrowDownLeft, Package, User, Clock, FileText, Wrench } from "lucide-react"
import { sampleTransactions, sampleParts, sampleEmployees } from "@/lib/sample-data"

export function TransactionHistory() {
  const [selectedTransaction, setSelectedTransaction] = useState<(typeof sampleTransactions)[0] | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const getActionBadge = (actionType: string) => {
    switch (actionType) {
      case "issue":
        return (
          <Badge variant="destructive" className="gap-1">
            <ArrowUpRight className="h-3 w-3" />
            Issue
          </Badge>
        )
      case "return":
        return (
          <Badge variant="default" className="gap-1 bg-success/20 text-success border-success/30">
            <ArrowDownLeft className="h-3 w-3" />
            Return
          </Badge>
        )
      case "import":
        return (
          <Badge variant="secondary" className="gap-1 bg-info/20 text-info border-info/30">
            <Package className="h-3 w-3" />
            Import
          </Badge>
        )
      case "adjust":
        return (
          <Badge variant="outline" className="gap-1">
            <Wrench className="h-3 w-3" />
            Adjust
          </Badge>
        )
      default:
        return <Badge variant="outline">{actionType}</Badge>
    }
  }

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const getPartDetails = (partId: number) => sampleParts.find((p) => p.part_id === partId)
  const getEmployeeDetails = (employeeId: number) => sampleEmployees.find((e) => e.employee_id === employeeId)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Transaction History ({sampleTransactions.length} records)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Part</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Work Order</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleTransactions.map((transaction) => {
                const dateTime = formatDateTime(transaction.transaction_date)
                const part = getPartDetails(transaction.part_id)
                const employee = getEmployeeDetails(transaction.employee_id)

                return (
                  <TableRow key={transaction.transaction_id}>
                    <TableCell className="font-mono">#{transaction.transaction_id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{part?.description}</p>
                        <p className="text-xs text-muted-foreground font-mono">{part?.part_number}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getActionBadge(transaction.action_type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {transaction.action_type === "issue" ? "-" : "+"}
                          {transaction.quantity}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {transaction.work_order ? (
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-mono">{transaction.work_order}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{employee?.name}</p>
                          <p className="text-xs text-muted-foreground">{employee?.department}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{dateTime.date}</p>
                        <p className="text-xs text-muted-foreground">{dateTime.time}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Transaction Details</DialogTitle>
                          </DialogHeader>
                          {selectedTransaction &&
                            (() => {
                              const part = getPartDetails(selectedTransaction.part_id)
                              const employee = getEmployeeDetails(selectedTransaction.employee_id)
                              return (
                                <div className="grid gap-6">
                                  {/* Transaction Info */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">
                                        Transaction ID
                                      </label>
                                      <p className="font-mono text-lg">#{selectedTransaction.transaction_id}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Action Type</label>
                                      <div className="mt-1">{getActionBadge(selectedTransaction.action_type)}</div>
                                    </div>
                                  </div>

                                  {/* Part Info */}
                                  <div className="border rounded-lg p-4 bg-muted/20">
                                    <h4 className="font-medium mb-3">Part Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Part Number</label>
                                        <p className="font-mono">{part?.part_number}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                                        <p>{part?.description}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Category</label>
                                        <p>{part?.category}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Quantity</label>
                                        <p className="text-2xl font-bold">
                                          {selectedTransaction.action_type === "issue" ? "-" : "+"}
                                          {selectedTransaction.quantity}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {(selectedTransaction.work_order || selectedTransaction.machine_code) && (
                                    <div className="border rounded-lg p-4 bg-muted/20">
                                      <h4 className="font-medium mb-3">Work Details</h4>
                                      <div className="grid grid-cols-2 gap-4">
                                        {selectedTransaction.work_order && (
                                          <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                              Work Order
                                            </label>
                                            <p className="font-mono">{selectedTransaction.work_order}</p>
                                          </div>
                                        )}
                                        {selectedTransaction.machine_code && (
                                          <div>
                                            <label className="text-sm font-medium text-muted-foreground">
                                              Machine Code
                                            </label>
                                            <p className="font-mono">{selectedTransaction.machine_code}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Employee Info */}
                                  <div className="border rounded-lg p-4 bg-muted/20">
                                    <h4 className="font-medium mb-3">Employee Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Employee Name
                                        </label>
                                        <p>{employee?.name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Employee Code
                                        </label>
                                        <p className="font-mono">{employee?.employee_code}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Department</label>
                                        <p>{employee?.department}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Role</label>
                                        <Badge variant="outline">{employee?.role}</Badge>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">Date & Time</label>
                                        <p>{new Date(selectedTransaction.transaction_date).toLocaleString()}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Notes */}
                                  {selectedTransaction.notes && (
                                    <div>
                                      <label className="text-sm font-medium text-muted-foreground">Notes</label>
                                      <p className="mt-1 p-3 bg-muted/50 rounded-lg text-sm">
                                        {selectedTransaction.notes}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )
                            })()}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, sampleTransactions.length)} of {sampleTransactions.length}{" "}
            transactions
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage * itemsPerPage >= sampleTransactions.length}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
