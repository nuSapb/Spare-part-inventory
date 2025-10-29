const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Debug: Log the API base URL
console.log('API_BASE_URL:', API_BASE_URL);

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
  role: "admin" | "manager" | "technician" | "viewer";
  is_active: boolean;
  created_at: string;
}

export interface Transaction {
  transaction_id: number;
  part_id: number;
  action_type: 'import' | 'issue' | 'return' | 'adjust';
  quantity: number;
  employee_id: number;
  machine_code: string | null;
  work_order: string | null;
  notes: string | null;
  transaction_date: string;
}

// Parts API
export const partsApi = {
  getAll: async (): Promise<Part[]> => {
    console.log('Fetching parts from:', `${API_BASE_URL}/api/parts`);
    try {
      const response = await fetch(`${API_BASE_URL}/api/parts`);
      console.log('Response status:', response.status, response.statusText);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch parts: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Parts data received:', data.length, 'items');
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
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

  create: async (employee: Omit<Employee, 'employee_id' | 'created_at'>): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/api/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    if (!response.ok) throw new Error('Failed to create employee');
    return response.json();
  },

  update: async (id: number, employee: Partial<Omit<Employee, 'employee_id' | 'created_at'>>): Promise<Employee> => {
    const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employee),
    });
    if (!response.ok) throw new Error('Failed to update employee');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete employee');
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

  update: async (id: number, transaction: Partial<Omit<Transaction, 'transaction_id' | 'transaction_date'>>): Promise<Transaction> => {
    const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error('Failed to update transaction');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete transaction');
  },
};

// Stock Alerts API
export const alertsApi = {
  getAll: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/api/stock-alerts`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  },

  create: async (alert: Omit<any, 'alert_id' | 'created_at'>): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/stock-alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alert),
    });
    if (!response.ok) throw new Error('Failed to create alert');
    return response.json();
  },

  acknowledge: async (id: number, acknowledgedBy: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/stock-alerts/${id}/acknowledge`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acknowledged_by: acknowledgedBy }),
    });
    if (!response.ok) throw new Error('Failed to acknowledge alert');
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/stock-alerts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete alert');
  },
};

// Image Upload API
export const uploadApi = {
  uploadImage: async (file: File, partId: number): Promise<any> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('partId', partId.toString());

    const response = await fetch(`${API_BASE_URL}/api/upload/image`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
  },

  deleteImage: async (partId: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/upload/image/${partId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete image');
    return response.json();
  },

  getImageInfo: async (partId: number): Promise<{ imageUrl: string | null }> => {
    const response = await fetch(`${API_BASE_URL}/api/upload/image/${partId}`);
    if (!response.ok) throw new Error('Failed to get image info');
    return response.json();
  },
};
