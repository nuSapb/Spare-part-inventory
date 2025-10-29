"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/contexts/language-context"
import { useTransactions } from "@/contexts/transactions-context"
import { useParts } from "@/contexts/parts-context"
import { useEmployees } from "@/contexts/employees-context"

export function RecentTransactions() {
  const [mounted, setMounted] = React.useState(false)
  const { t, language } = useLanguage()
  const { filteredTransactions, loading: transactionsLoading } = useTransactions()
  const { parts } = useParts()
  const { employees } = useEmployees()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Get recent transactions (last 5)
  const recentTransactions = filteredTransactions.slice(0, 5)

  const getPartDetails = (partId: number) => parts.find((p) => p.part_id === partId)
  const getEmployeeDetails = (employeeId: number) => employees.find((e) => e.employee_id === employeeId)

  if (transactionsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("recentTransactions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recentTransactions")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>{t("noRecentTransactions")}</p>
            </div>
          ) : (
            recentTransactions.map((transaction) => {
              const part = getPartDetails(transaction.part_id)
              const employee = getEmployeeDetails(transaction.employee_id)

              return (
                <div
                  key={transaction.transaction_id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{part?.description || t("unknownPart")}</p>
                    <p className="text-xs text-muted-foreground">{part?.part_number || `ID: ${transaction.part_id}`}</p>
                    <p className="text-xs text-muted-foreground">
                      {employee?.name || t("unknownEmployee")} • {mounted ? new Date(transaction.transaction_date).toLocaleString(language === "th" ? "th-TH" : "en-US") : "..."}
                    </p>
                    {transaction.work_order && (
                      <p className="text-xs text-muted-foreground font-mono">WO: {transaction.work_order}</p>
                    )}
                    {transaction.notes && (
                      <p className="text-xs text-muted-foreground italic">{transaction.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        transaction.action_type === "issue" ? "destructive" : 
                        transaction.action_type === "return" ? "default" :
                        transaction.action_type === "import" ? "secondary" : "outline"
                      }
                    >
                      {t(transaction.action_type as "issue" | "return" | "import" | "adjust")}
                    </Badge>
                    <span className="text-sm font-medium">×{transaction.quantity}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
