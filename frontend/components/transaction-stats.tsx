import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Users, Calendar } from "lucide-react"

const stats = [
  {
    title: "Total Transactions",
    value: "1,247",
    change: "+12%",
    changeType: "positive" as const,
    icon: Calendar,
  },
  {
    title: "Parts Issued",
    value: "892",
    change: "+8%",
    changeType: "positive" as const,
    icon: ArrowUpRight,
  },
  {
    title: "Parts Returned",
    value: "355",
    change: "+15%",
    changeType: "positive" as const,
    icon: ArrowDownLeft,
  },
  {
    title: "Active Employees",
    value: "24",
    change: "+2",
    changeType: "positive" as const,
    icon: Users,
  },
]

export function TransactionStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-green-400">{stat.change} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
