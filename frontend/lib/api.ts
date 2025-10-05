const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Part {
  part_id: number;
  part_number: string;
  description: string;
  category: string;
  department: string;
  location: string;
  storage_detail?: string;
  machine_used?: string;
  current_stock: number;
  minimum_stock: number;
  unit: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  employee_id: number;
  employee_code: string;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  is_active: boolean;
}

export interface Transaction {
  transaction_id: number;
  part_id: number;
  transaction_type: 'issue' | 'return' | 'receive' | 'adjustment';
  quantity: number;
  reference_number?: string;
  employee_name?: string;
  department?: string;
  notes?: string;
  transaction_date: string;
}

// Parts API
export const partsApi = {
  getAll: async (): Promise<Part[]> => {
    const response = await fetch(`${API_BASE_URL}/api/parts`);
    if (!response.ok) throw new Error('Failed to fetch parts');
    return response.json();
  },

  getById: async (id: number): Promise<Part> => {
    const response = await fetch(`${API_BASE_URL}/api/parts/${id}`);
    if (!response.ok) throw new Error('Failed to fetch part');
    return response.json();
  },

  create: async (part: Omit<Part, 'part_id' | 'created_at' | 'updated_at'>): Promise<Part> => {
    const response = await fetch(`${API_BASE_URL}/api/parts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(part),
    });
    if (!response.ok) throw new Error('Failed to create part');
    return response.json();
  },

  update: async (id: number, part: Partial<Omit<Part, 'part_id' | 'created_at' | 'updated_at'>>): Promise<Part> => {
    const response = await fetch(`${API_BASE_URL}/api/parts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(part),
    });
    if (!response.ok) throw new Error('Failed to update part');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/parts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete part');
  },
};

// Employees API
export const employeesApi = {
  getAll: async (): Promise<Employee[]> => {
    const response = await fetch(`${API_BASE_URL}/api/employees`);
    if (!response.ok) throw new Error('Failed to fetch employees');
    return response.json();
  },

  create: async (employee: Omit<Employee, 'employee_id'>): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/api/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    if (!response.ok) throw new Error('Failed to create employee');
    return response.json();
  },
};

// Transactions API
export const transactionsApi = {
  getAll: async (): Promise<Transaction[]> => {
    const response = await fetch(`${API_BASE_URL}/api/transactions`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  },

  create: async (transaction: Omit<Transaction, 'transaction_id' | 'transaction_date'>): Promise<Transaction> => {
    const response = await fetch(`${API_BASE_URL}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error('Failed to create transaction');
    return response.json();
  },
};
