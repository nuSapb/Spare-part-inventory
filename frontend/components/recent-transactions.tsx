"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { sampleTransactions, sampleParts, sampleEmployees } from "@/lib/sample-data"

export function RecentTransactions() {
  const [mounted, setMounted] = React.useState(false)
  const recentTransactions = sampleTransactions.slice(0, 3)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getPartDetails = (partId: number) => sampleParts.find((p) => p.part_id === partId)
  const getEmployeeDetails = (employeeId: number) => sampleEmployees.find((e) => e.employee_id === employeeId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => {
            const part = getPartDetails(transaction.part_id)
            const employee = getEmployeeDetails(transaction.employee_id)

            return (
              <div
                key={transaction.transaction_id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{part?.description}</p>
                  <p className="text-xs text-muted-foreground">{part?.part_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {employee?.name} • {mounted ? new Date(transaction.transaction_date).toLocaleString() : "..."}
                  </p>
                  {transaction.work_order && (
                    <p className="text-xs text-muted-foreground font-mono">WO: {transaction.work_order}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={transaction.action_type === "issue" ? "destructive" : "default"}>
                    {transaction.action_type.charAt(0).toUpperCase() + transaction.action_type.slice(1)}
                  </Badge>
                  <span className="text-sm font-medium">×{transaction.quantity}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
