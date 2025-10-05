import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package } from "lucide-react"

const alerts = [
  {
    id: "501",
    partName: "Intel Gigabit CT Adapter",
    partNumber: "10000187-A",
    currentStock: 5,
    minStock: 10,
    location: "Warehouse",
    createdAt: "2025-09-21 14:05",
  },
  {
    id: "502",
    partName: "15.6'' TFT-LCD Display",
    partNumber: "G156HTN01.0",
    currentStock: 1,
    minStock: 3,
    location: "Maintenance Area",
    createdAt: "2025-09-22 15:05",
  },
]

export function StockAlerts() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Stock Alerts
        </CardTitle>
        <Badge variant="destructive">{alerts.length}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <p className="font-medium text-sm">{alert.partName}</p>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{alert.partNumber}</p>
                <p className="text-xs text-muted-foreground">{alert.location}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    Stock: {alert.currentStock}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Min: {alert.minStock}
                  </Badge>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Reorder
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
