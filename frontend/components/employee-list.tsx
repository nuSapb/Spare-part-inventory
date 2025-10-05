"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Eye, Edit, UserX, UserCheck, Users, Building2, Shield } from "lucide-react"
import { sampleEmployees } from "@/lib/sample-data"

export function EmployeeList() {
  const [selectedEmployee, setSelectedEmployee] = useState<(typeof sampleEmployees)[0] | null>(null)

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">Admin</Badge>
      case "manager":
        return (
          <Badge variant="default" className="bg-warning/20 text-warning border-warning/30">
            Manager
          </Badge>
        )
      case "technician":
        return <Badge variant="secondary">Technician</Badge>
      case "viewer":
        return <Badge variant="outline">Viewer</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Employee Directory ({sampleEmployees.length} employees)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleEmployees.map((employee) => (
                <TableRow key={employee.employee_id}>
                  <TableCell className="font-mono text-sm">{employee.employee_code}</TableCell>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                      {employee.department}
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(employee.role)}</TableCell>
                  <TableCell>
                    {employee.is_active ? (
                      <Badge variant="default" className="gap-1 bg-success/20 text-success border-success/30">
                        <UserCheck className="h-3 w-3" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1">
                        <UserX className="h-3 w-3" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedEmployee(employee)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Employee Details</DialogTitle>
                          </DialogHeader>
                          {selectedEmployee && (
                            <div className="grid gap-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Employee Code</label>
                                  <p className="font-mono text-lg">{selectedEmployee.employee_code}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                                  <p className="text-lg font-medium">{selectedEmployee.name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Department</label>
                                  <p>{selectedEmployee.department}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                                  <div className="mt-1">{getRoleBadge(selectedEmployee.role)}</div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                                  <div className="mt-1">
                                    {selectedEmployee.is_active ? (
                                      <Badge
                                        variant="default"
                                        className="gap-1 bg-success/20 text-success border-success/30"
                                      >
                                        <UserCheck className="h-3 w-3" />
                                        Active
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className="gap-1">
                                        <UserX className="h-3 w-3" />
                                        Inactive
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Created At</label>
                                  <p>{new Date(selectedEmployee.created_at).toLocaleDateString()}</p>
                                </div>
                              </div>

                              <div className="border rounded-lg p-4 bg-muted/20">
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  Permissions
                                </h4>
                                <div className="space-y-2 text-sm">
                                  {selectedEmployee.role === "admin" && (
                                    <>
                                      <p>✓ Full system access</p>
                                      <p>✓ Manage employees</p>
                                      <p>✓ Configure system settings</p>
                                      <p>✓ View all reports</p>
                                    </>
                                  )}
                                  {selectedEmployee.role === "manager" && (
                                    <>
                                      <p>✓ View all inventory</p>
                                      <p>✓ Approve transactions</p>
                                      <p>✓ Generate reports</p>
                                      <p>✓ Manage department stock</p>
                                    </>
                                  )}
                                  {selectedEmployee.role === "technician" && (
                                    <>
                                      <p>✓ Issue parts</p>
                                      <p>✓ Return parts</p>
                                      <p>✓ View inventory</p>
                                      <p>✓ Scan barcodes</p>
                                    </>
                                  )}
                                  {selectedEmployee.role === "viewer" && (
                                    <>
                                      <p>✓ View inventory</p>
                                      <p>✓ View reports</p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
