import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, Shield, Eye } from "lucide-react"
import { sampleEmployees } from "@/lib/sample-data"

export function EmployeeStats() {
  const totalEmployees = sampleEmployees.length
  const activeEmployees = sampleEmployees.filter((e) => e.is_active).length
  const adminCount = sampleEmployees.filter((e) => e.role === "admin").length
  const technicianCount = sampleEmployees.filter((e) => e.role === "technician").length

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Active",
      value: activeEmployees,
      icon: UserCheck,
      color: "text-success",
    },
    {
      title: "Administrators",
      value: adminCount,
      icon: Shield,
      color: "text-warning",
    },
    {
      title: "Technicians",
      value: technicianCount,
      icon: Eye,
      color: "text-info",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
