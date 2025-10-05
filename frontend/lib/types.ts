export type Part = {
  part_id: number
  part_number: string
  description: string
  category: string
  department: string
  location: string
  storage_detail: string | null
  machine_used: string | null
  current_stock: number
  minimum_stock: number
  unit: string
  image_url: string | null
  created_at: string
  updated_at: string
}

export type Employee = {
  employee_id: number
  employee_code: string
  name: string
  department: string
  role: "admin" | "manager" | "technician" | "viewer"
  is_active: boolean
  created_at: string
}

export type Transaction = {
  transaction_id: number
  part_id: number
  action_type: "import" | "issue" | "return" | "adjust"
  quantity: number
  employee_id: number
  machine_code: string | null
  work_order: string | null
  notes: string | null
  transaction_date: string
}

export type Alert = {
  alert_id: number
  part_id: number
  alert_type: "low_stock" | "out_of_stock"
  status: "active" | "acknowledged" | "resolved"
  created_at: string
  acknowledged_at: string | null
  acknowledged_by: number | null
  resolved_at: string | null
}

export type AlertNotification = {
  notification_id: number
  alert_id: number
  employee_id: number
  department: string
  is_read: boolean
  sent_at: string
  read_at: string | null
}

export type StockSummary = {
  part_id: number
  part_number: string
  description: string
  category: string
  department: string
  location: string
  machine_used: string | null
  current_stock: number
  minimum_stock: number
  status: "Out of Stock" | "Low Stock" | "OK"
}

export type RecentTransaction = {
  transaction_id: number
  transaction_date: string
  part_number: string
  description: string
  action_type: "import" | "issue" | "return" | "adjust"
  quantity: number
  employee_name: string
  department: string
  machine_code: string | null
  work_order: string | null
  notes: string | null
}

export type MyNotification = {
  notification_id: number
  employee_id: number
  department: string
  alert_id: number
  alert_type: "low_stock" | "out_of_stock"
  alert_status: "active" | "acknowledged" | "resolved"
  part_id: number
  part_number: string
  description: string
  category: string
  location: string
  current_stock: number
  minimum_stock: number
  is_read: boolean
  sent_at: string
  read_at: string | null
  hours_ago: number
}
