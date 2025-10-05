"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import { useParts } from "@/contexts/parts-context"

const locations = ["All Locations", "Warehouse", "Test Area", "Maintenance Area", "Maintenance Room"]

const stockStatus = ["All Status", "In Stock", "Low Stock", "Out of Stock"]

export function PartsFilters() {
  const { searchTerm, setSearchTerm, locationFilter, setLocationFilter, statusFilter, setStatusFilter } = useParts()
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    const filters = []
    if (locationFilter !== "All Locations") {
      filters.push(`Location: ${locationFilter}`)
    }
    if (statusFilter !== "All Status") {
      filters.push(`Status: ${statusFilter}`)
    }
    setActiveFilters(filters)
  }, [locationFilter, statusFilter])

  const handleFilterChange = (type: string, value: string) => {
    if (type === "location") {
      setLocationFilter(value)
    } else if (type === "status") {
      setStatusFilter(value)
    }
  }

  const removeFilter = (filter: string) => {
    if (filter.startsWith("Location:")) {
      setLocationFilter("All Locations")
    } else if (filter.startsWith("Status:")) {
      setStatusFilter("All Status")
    }
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    setLocationFilter("All Locations")
    setStatusFilter("All Status")
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Search and Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search parts by name, number, or barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={locationFilter} onValueChange={(value) => handleFilterChange("location", value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stockStatus.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {activeFilters.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
              )}
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
