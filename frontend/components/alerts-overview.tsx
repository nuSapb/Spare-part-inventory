import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, CheckCircle, Bell, Package, MapPin } from "lucide-react"

const alertStats = [
  {
    title: "Active Alerts",
    value: "23",
    change: "+5",
    changeType: "negative" as const,
    icon: AlertTriangle,
    color: "text-destructive",
  },
  {
    title: "Resolved Today",
    value: "12",
    change: "+8",
    changeType: "positive" as const,
    icon: CheckCircle,
    color: "text-success",
  },
  {
    title: "Pending Review",
    value: "7",
    change: "+2",
    changeType: "neutral" as const,
    icon: Clock,
    color: "text-warning",
  },
  {
    title: "Total This Month",
    value: "156",
    change: "+23%",
    changeType: "neutral" as const,
    icon: Bell,
    color: "text-info",
  },
]

const criticalAlerts = [
  {
    id: "501",
    partName: "Intel Gigabit CT Adapter",
    partNumber: "10000187-A",
    currentStock: 0,
    minStock: 10,
    location: "Warehouse",
    severity: "critical",
    createdAt: "2025-09-22 08:30",
    daysActive: 2,
  },
  {
    id: "502",
    partName: "Ethernet Cable 5m",
    partNumber: "CAB-ETH-001",
    currentStock: 0,
    minStock: 20,
    location: "Storage Room A",
    severity: "critical",
    createdAt: "2025-09-21 16:45",
    daysActive: 3,
  },
  {
    id: "503",
    partName: "15.6'' TFT-LCD Display",
    partNumber: "G156HTN01.0",
    currentStock: 1,
    minStock: 3,
    location: "Maintenance Area",
    severity: "warning",
    createdAt: "2025-09-22 15:05",
    daysActive: 1,
  },
]

export function AlertsOverview() {
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

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {alertStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.changeType === "positive"
                    ? "text-success"
                    : stat.changeType === "negative"
                      ? "text-destructive"
                      : "text-muted-foreground"
                }`}
              >
                {stat.change} from yesterday
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Critical Alerts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Critical Alerts Requiring Immediate Attention
          </CardTitle>
          <Badge variant="destructive">{criticalAlerts.filter((a) => a.severity === "critical").length}</Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start justify-between p-4 rounded-lg border ${
                  alert.severity === "critical"
                    ? "bg-destructive/10 border-destructive/20"
                    : "bg-warning/10 border-warning/20"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium text-sm">{alert.partName}</p>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1 font-mono">{alert.partNumber}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{alert.location}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className={`font-medium ${alert.currentStock === 0 ? "text-destructive" : "text-warning"}`}>
                      Current: {alert.currentStock}
                    </span>
                    <span className="text-muted-foreground">Minimum: {alert.minStock}</span>
                    <span className="text-muted-foreground">Active: {alert.daysActive} days</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant={alert.severity === "critical" ? "destructive" : "default"}>
                    {alert.currentStock === 0 ? "Emergency Order" : "Reorder"}
                  </Button>
                  <Button size="sm" variant="outline">
                    Resolve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alert Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <span className="text-sm">Low Stock Alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">18</span>
                  <Badge variant="destructive" className="text-xs">
                    +3
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <span className="text-sm">Expiry Warnings</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">5</span>
                  <Badge variant="secondary" className="text-xs">
                    +1
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-info"></div>
                  <span className="text-sm">System Notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">12</span>
                  <Badge variant="outline" className="text-xs">
                    +8
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Response Time</span>
                <span className="text-sm font-medium">2.3 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fastest Resolution</span>
                <span className="text-sm font-medium">15 minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Longest Pending</span>
                <span className="text-sm font-medium text-destructive">3 days</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Resolution Rate</span>
                <span className="text-sm font-medium text-success">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
