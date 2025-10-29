"use client"

import * as React from "react"
import { employeesApi } from "@/lib/api"
import type { Employee } from "@/lib/types"

interface EmployeesContextType {
  employees: Employee[]
  loading: boolean
  error: string | null
  addEmployee: (employee: Omit<Employee, "employee_id" | "created_at">) => Promise<void>
  updateEmployee: (employeeId: number, updates: Partial<Omit<Employee, "employee_id" | "created_at">>) => Promise<void>
  deleteEmployee: (employeeId: number) => Promise<void>
  refreshEmployees: () => Promise<void>
  searchTerm: string
  setSearchTerm: (term: string) => void
  departmentFilter: string
  setDepartmentFilter: (department: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  filteredEmployees: Employee[]
}

const EmployeesContext = React.createContext<EmployeesContextType | undefined>(undefined)

export function EmployeesProvider({ children }: { children: React.ReactNode }) {
  const [employees, setEmployees] = React.useState<Employee[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [departmentFilter, setDepartmentFilter] = React.useState("All Departments")
  const [statusFilter, setStatusFilter] = React.useState("All Status")

  // Fetch employees from backend on mount
  const refreshEmployees = React.useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await employeesApi.getAll()
      setEmployees(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch employees')
      console.error('Error fetching employees:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    refreshEmployees()
  }, [])

  const addEmployee = async (employeeData: Omit<Employee, "employee_id" | "created_at">) => {
    try {
      const newEmployee = await employeesApi.create(employeeData)
      setEmployees([...employees, newEmployee])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add employee')
      throw err
    }
  }

  const updateEmployee = async (employeeId: number, updates: Partial<Omit<Employee, "employee_id" | "created_at">>) => {
    try {
      const updatedEmployee = await employeesApi.update(employeeId, updates)
      setEmployees(
        employees.map((employee) =>
          employee.employee_id === employeeId ? updatedEmployee : employee
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update employee')
      throw err
    }
  }

  const deleteEmployee = async (employeeId: number) => {
    try {
      await employeesApi.delete(employeeId)
      setEmployees(employees.filter((employee) => employee.employee_id !== employeeId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee')
      throw err
    }
  }

  const filteredEmployees = React.useMemo(() => {
    return employees.filter((employee) => {
      // Search filter
      const matchesSearch =
        searchTerm === "" ||
        employee.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.role.toLowerCase().includes(searchTerm.toLowerCase())

      // Department filter
      const matchesDepartment =
        departmentFilter === "All Departments" || employee.department === departmentFilter

      // Status filter
      let matchesStatus = true
      if (statusFilter === "Active") {
        matchesStatus = employee.is_active
      } else if (statusFilter === "Inactive") {
        matchesStatus = !employee.is_active
      }

      return matchesSearch && matchesDepartment && matchesStatus
    })
  }, [employees, searchTerm, departmentFilter, statusFilter])

  return (
    <EmployeesContext.Provider
      value={{
        employees,
        loading,
        error,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        refreshEmployees,
        searchTerm,
        setSearchTerm,
        departmentFilter,
        setDepartmentFilter,
        statusFilter,
        setStatusFilter,
        filteredEmployees,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  )
}

export function useEmployees() {
  const context = React.useContext(EmployeesContext)
  if (context === undefined) {
    throw new Error("useEmployees must be used within an EmployeesProvider")
  }
  return context
}
