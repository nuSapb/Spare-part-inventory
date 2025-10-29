"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, Warehouse } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useParts } from "@/contexts/parts-context"
import { useAlerts } from "@/contexts/alerts-context"

export function DashboardStats() {
  const { t } = useLanguage()
  const { parts, loading: partsLoading } = useParts()
  const { unacknowledgedCount, loading: alertsLoading } = useAlerts()

  // Calculate real stats from data
  const totalParts = parts.length
  const lowStockParts = parts.filter(part => part.current_stock <= part.minimum_stock && part.current_stock > 0).length
  const outOfStockParts = parts.filter(part => part.current_stock === 0).length
  const totalAlerts = unacknowledgedCount
  
  // Get unique locations
  const uniqueLocations = [...new Set(parts.map(part => part.location))].length

  // Calculate estimated value (mock calculation - in real app this would come from database)
  const estimatedValue = parts.reduce((sum, part) => sum + (part.current_stock * 50), 0) // $50 per part as example

  const stats = [
    {
      titleKey: "totalParts" as const,
      value: partsLoading ? "..." : totalParts.toLocaleString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Package,
    },
    {
      titleKey: "lowStockAlerts" as const,
      value: alertsLoading ? "..." : totalAlerts.toString(),
      change: outOfStockParts > 0 ? `+${outOfStockParts}` : "+0",
      changeType: totalAlerts > 0 ? "negative" as const : "positive" as const,
      icon: AlertTriangle,
    },
    {
      titleKey: "totalValue" as const,
      value: partsLoading ? "..." : `$${estimatedValue.toLocaleString()}`,
      change: "+8.2%",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      titleKey: "locations" as const,
      value: partsLoading ? "..." : uniqueLocations.toString(),
      change: "0",
      changeType: "neutral" as const,
      icon: Warehouse,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.titleKey}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t(stat.titleKey)}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p
              className={`text-xs ${
                stat.changeType === "positive"
                  ? "text-green-400"
                  : stat.changeType === "negative"
                    ? "text-red-400"
                    : "text-muted-foreground"
              }`}
            >
              {stat.change} {t("fromLastMonth")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
