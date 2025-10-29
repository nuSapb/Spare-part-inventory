"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Package } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useParts } from "@/contexts/parts-context"

export function StockAlerts() {
  const { t } = useLanguage()
  const { parts, loading: partsLoading } = useParts()

  // Calculate low stock alerts from parts data
  const stockAlerts = React.useMemo(() => {
    return parts.filter(part => part.current_stock <= part.minimum_stock)
      .sort((a, b) => {
        // Sort by stock level percentage (lowest first)
        const aPercentage = a.current_stock / a.minimum_stock
        const bPercentage = b.current_stock / b.minimum_stock
        return aPercentage - bPercentage
      })
      .slice(0, 5) // Show top 5 alerts
  }, [parts])

  if (partsLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            {t("stockAlerts")}
          </CardTitle>
          <Badge variant="destructive">...</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          {t("stockAlerts")}
        </CardTitle>
        <Badge variant={stockAlerts.length > 0 ? "destructive" : "secondary"}>
          {stockAlerts.length}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stockAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{t("noData")}</p>
            </div>
          ) : (
            stockAlerts.map((part) => (
              <div
                key={part.part_id}
                className={`flex items-start justify-between p-3 rounded-lg border ${
                  part.current_stock === 0 
                    ? "bg-destructive/10 border-destructive/20" 
                    : "bg-warning/10 border-warning/20"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium text-sm">{part.description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{part.part_number}</p>
                  <p className="text-xs text-muted-foreground">{part.location}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant={part.current_stock === 0 ? "destructive" : "outline"} 
                      className="text-xs"
                    >
                      {t("stock")}: {part.current_stock}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {t("minimumStock")}: {part.minimum_stock}
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  {t("reorder")}
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
