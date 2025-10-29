"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useLanguage } from "@/contexts/language-context"
import { useEmployees } from "@/contexts/employees-context"
import { useToast } from "@/hooks/use-toast"

interface AddEmployeeDialogProps {
  onSuccess?: () => void
}

export function AddEmployeeDialog({ onSuccess }: AddEmployeeDialogProps) {
  const { t } = useLanguage()
  const { addEmployee } = useEmployees()
  const { toast } = useToast()
  
  const [formData, setFormData] = React.useState({
    employee_code: "",
    name: "",
    department: "",
    role: "technician" as const,
    is_active: true,
  })
  
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.employee_code || !formData.name || !formData.department) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      await addEmployee(formData)
      toast({
        title: "Success",
        description: "Employee added successfully",
      })
      
      // Reset form
      setFormData({
        employee_code: "",
        name: "",
        department: "",
        role: "technician",
        is_active: true,
      })
      
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add employee",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employee_code">{t("employeeCode") || "Employee Code"}</Label>
          <Input
            id="employee_code"
            value={formData.employee_code}
            onChange={(e) => setFormData(prev => ({ ...prev, employee_code: e.target.value }))}
            placeholder="EMP001"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="John Doe"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">{t("department")}</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
            placeholder="Maintenance"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">{t("role")}</Label>
          <Select value={formData.role} onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="technician">Technician</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">{t("active")}</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => onSuccess?.()}>
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : t("save")}
        </Button>
      </div>
    </form>
  )
}
