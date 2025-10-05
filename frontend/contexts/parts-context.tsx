"use client"

import * as React from "react"
import { partsApi } from "@/lib/api"
import type { Part } from "@/lib/types"

interface PartsContextType {
  parts: Part[]
  loading: boolean
  error: string | null
  addPart: (part: Omit<Part, "part_id" | "created_at" | "updated_at">) => Promise<void>
  importParts: (parts: Omit<Part, "part_id" | "created_at" | "updated_at">[]) => Promise<void>
  updatePart: (partId: number, updates: Partial<Part>) => Promise<void>
  deletePart: (partId: number) => Promise<void>
  refreshParts: () => Promise<void>
  searchTerm: string
  setSearchTerm: (term: string) => void
  locationFilter: string
  setLocationFilter: (location: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  filteredParts: Part[]
}

const PartsContext = React.createContext<PartsContextType | undefined>(undefined)

export function PartsProvider({ children }: { children: React.ReactNode }) {
  const [parts, setParts] = React.useState<Part[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [locationFilter, setLocationFilter] = React.useState("All Locations")
  const [statusFilter, setStatusFilter] = React.useState("All Status")

  // Fetch parts from backend on mount
  const refreshParts = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await partsApi.getAll()
      setParts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch parts')
      console.error('Error fetching parts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    refreshParts()
  }, [])

  const addPart = async (partData: Omit<Part, "part_id" | "created_at" | "updated_at">) => {
    try {
      const newPart = await partsApi.create(partData)
      setParts([...parts, newPart])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add part')
      throw err
    }
  }

  const importParts = async (partsData: Omit<Part, "part_id" | "created_at" | "updated_at">[]) => {
    try {
      const newParts = await Promise.all(
        partsData.map(partData => partsApi.create(partData))
      )
      setParts([...parts, ...newParts])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import parts')
      throw err
    }
  }

  const updatePart = async (partId: number, updates: Partial<Part>) => {
    try {
      const updatedPart = await partsApi.update(partId, updates)
      setParts(
        parts.map((part) =>
          part.part_id === partId ? updatedPart : part
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update part')
      throw err
    }
  }

  const deletePart = async (partId: number) => {
    try {
      await partsApi.delete(partId)
      setParts(parts.filter((part) => part.part_id !== partId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete part')
      throw err
    }
  }

  const filteredParts = React.useMemo(() => {
    return parts.filter((part) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        part.part_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.category.toLowerCase().includes(searchTerm.toLowerCase())

      // Location filter
      const matchesLocation =
        locationFilter === "All Locations" || part.location === locationFilter

      // Status filter
      let matchesStatus = true
      if (statusFilter === "Out of Stock") {
        matchesStatus = part.current_stock === 0
      } else if (statusFilter === "Low Stock") {
        matchesStatus = part.current_stock > 0 && part.current_stock <= part.minimum_stock
      } else if (statusFilter === "In Stock") {
        matchesStatus = part.current_stock > part.minimum_stock
      }

      return matchesSearch && matchesLocation && matchesStatus
    })
  }, [parts, searchTerm, locationFilter, statusFilter])

  return (
    <PartsContext.Provider
      value={{
        parts,
        loading,
        error,
        addPart,
        importParts,
        updatePart,
        deletePart,
        refreshParts,
        searchTerm,
        setSearchTerm,
        locationFilter,
        setLocationFilter,
        statusFilter,
        setStatusFilter,
        filteredParts,
      }}
    >
      {children}
    </PartsContext.Provider>
  )
}

export function useParts() {
  const context = React.useContext(PartsContext)
  if (context === undefined) {
    throw new Error("useParts must be used within a PartsProvider")
  }
  return context
}
