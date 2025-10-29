"use client"

import * as React from "react"
import { alertsApi } from "@/lib/api"
import type { Alert } from "@/lib/types"

interface AlertsContextType {
  alerts: Alert[]
  loading: boolean
  error: string | null
  addAlert: (alert: Omit<Alert, "alert_id" | "created_at">) => Promise<void>
  acknowledgeAlert: (alertId: number, acknowledgedBy: string) => Promise<void>
  deleteAlert: (alertId: number) => Promise<void>
  refreshAlerts: () => Promise<void>
  typeFilter: string
  setTypeFilter: (type: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  filteredAlerts: Alert[]
  unacknowledgedCount: number
}

const AlertsContext = React.createContext<AlertsContextType | undefined>(undefined)

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = React.useState<Alert[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [typeFilter, setTypeFilter] = React.useState("All Types")
  const [statusFilter, setStatusFilter] = React.useState("Active")

  // Fetch alerts from backend on mount
  const refreshAlerts = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await alertsApi.getAll()
      setAlerts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch alerts')
      console.error('Error fetching alerts:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    refreshAlerts()
  }, [])

  const addAlert = async (alertData: Omit<Alert, "alert_id" | "created_at">) => {
    try {
      const newAlert = await alertsApi.create(alertData)
      setAlerts([newAlert, ...alerts])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add alert')
      throw err
    }
  }

  const acknowledgeAlert = async (alertId: number, acknowledgedBy: string) => {
    try {
      const updatedAlert = await alertsApi.acknowledge(alertId, acknowledgedBy)
      setAlerts(
        alerts.map((alert) =>
          alert.alert_id === alertId ? updatedAlert : alert
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to acknowledge alert')
      throw err
    }
  }

  const deleteAlert = async (alertId: number) => {
    try {
      await alertsApi.delete(alertId)
      setAlerts(alerts.filter((alert) => alert.alert_id !== alertId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete alert')
      throw err
    }
  }

  const filteredAlerts = React.useMemo(() => {
    return alerts.filter((alert) => {
      // Type filter
      const matchesType =
        typeFilter === "All Types" || alert.alert_type === typeFilter

      // Status filter
      let matchesStatus = true
      if (statusFilter === "Active") {
        matchesStatus = alert.status === "active"
      } else if (statusFilter === "Acknowledged") {
        matchesStatus = alert.status === "acknowledged"
      } else if (statusFilter === "Resolved") {
        matchesStatus = alert.status === "resolved"
      }

      return matchesType && matchesStatus
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [alerts, typeFilter, statusFilter])

  const unacknowledgedCount = React.useMemo(() => {
    return alerts.filter(alert => alert.status === "active").length
  }, [alerts])

  return (
    <AlertsContext.Provider
      value={{
        alerts,
        loading,
        error,
        addAlert,
        acknowledgeAlert,
        deleteAlert,
        refreshAlerts,
        typeFilter,
        setTypeFilter,
        statusFilter,
        setStatusFilter,
        filteredAlerts,
        unacknowledgedCount,
      }}
    >
      {children}
    </AlertsContext.Provider>
  )
}

export function useAlerts() {
  const context = React.useContext(AlertsContext)
  if (context === undefined) {
    throw new Error("useAlerts must be used within an AlertsProvider")
  }
  return context
}
