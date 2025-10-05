"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, X, CalendarIcon } from "lucide-react"
import { format } from "date-fns"

const actionTypes = ["All Actions", "Issue", "Return", "Import"]

const employees = ["All Employees", "Technician A", "Technician B", "Technician C", "Supervisor D", "Manager E"]

export function TransactionFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAction, setSelectedAction] = useState("All Actions")
  const [selectedEmployee, setSelectedEmployee] = useState("All Employees")
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const handleFilterChange = (type: string, value: string) => {
    if (type === "action") {
      setSelectedAction(value)
      if (value !== "All Actions") {
        setActiveFilters((prev) => [...prev.filter((f) => !f.startsWith("Action:")), `Action: ${value}`])
      } else {
        setActiveFilters((prev) => prev.filter((f) => !f.startsWith("Action:")))
      }
    } else if (type === "employee") {
      setSelectedEmployee(value)
      if (value !== "All Employees") {
        setActiveFilters((prev) => [...prev.filter((f) => !f.startsWith("Employee:")), `Employee: ${value}`])
      } else {
        setActiveFilters((prev) => prev.filter((f) => !f.startsWith("Employee:")))
      }
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter))
    if (filter.startsWith("Action:")) {
      setSelectedAction("All Actions")
    } else if (filter.startsWith("Employee:")) {
      setSelectedEmployee("All Employees")
    }
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setSelectedAction("All Actions")
    setSelectedEmployee("All Employees")
    setDateFrom(undefined)
    setDateTo(undefined)
    setActiveFilters([])
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Search and Filters Row */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by part number, employee, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={selectedAction} onValueChange={(value) => handleFilterChange("action", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((action) => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedEmployee} onValueChange={(value) => handleFilterChange("employee", value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee} value={employee}>
                      {employee}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40 justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, "MMM dd") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40 justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "MMM dd") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus />
                </PopoverContent>
              </Popover>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="gap-1">
                  {filter}
                  <button
                    onClick={() => removeFilter(filter)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {(dateFrom || dateTo) && (
                <Badge variant="secondary" className="gap-1">
                  Date: {dateFrom ? format(dateFrom, "MMM dd") : "Start"} - {dateTo ? format(dateTo, "MMM dd") : "End"}
                  <button
                    onClick={() => {
                      setDateFrom(undefined)
                      setDateTo(undefined)
                    }}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
