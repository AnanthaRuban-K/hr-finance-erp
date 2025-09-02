const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Payroll {
  id: string;
  employeeId: string;
  month: string;
  baseSalary: number | string;
  bonus?: number | string;
  deductions?: number | string;
  netPay: number | string;
  isPaid: boolean;
  payDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePayrollRequest {
  employeeId: string;
  month: string;
  baseSalary: number;
  bonus?: number;
  deductions?: number;
}

export interface UpdatePayrollRequest extends Partial<CreatePayrollRequest> {}

export interface PayrollResponse {
  data?: Payroll[];
  error?: string;
  message?: string;
}

class PayrollAPI {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getAllPayrolls(): Promise<Payroll[]> {
    return this.request<Payroll[]>('/payroll');
  }

  async getPayrollById(id: string): Promise<Payroll> {
    return this.request<Payroll>(`/payroll/${id}`);
  }

  async createPayroll(data: CreatePayrollRequest): Promise<Payroll> {
    return this.request<Payroll>('/payroll', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePayroll(id: string, data: UpdatePayrollRequest): Promise<Payroll> {
    return this.request<Payroll>(`/payroll/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePayroll(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/payroll/${id}`, {
      method: 'DELETE',
    });
  }

  async markPayrollAsPaid(id: string): Promise<Payroll> {
    return this.request<Payroll>(`/payroll/${id}/pay`, {
      method: 'PATCH',
    });
  }

  // Utility methods
  async getPayrollStats(): Promise<{
    total: number;
    paid: number;
    pending: number;
    totalAmount: number;
  }> {
    const payrolls = await this.getAllPayrolls();
    
    return {
      total: payrolls.length,
      paid: payrolls.filter(p => p.isPaid).length,
      pending: payrolls.filter(p => !p.isPaid).length,
      totalAmount: payrolls.reduce((sum, p) => sum + parseFloat(p.netPay.toString()), 0)
    };
  }

  async getPayrollsByEmployee(employeeId: string): Promise<Payroll[]> {
    const allPayrolls = await this.getAllPayrolls();
    return allPayrolls.filter(p => p.employeeId === employeeId);
  }

  async getPayrollsByMonth(month: string): Promise<Payroll[]> {
    const allPayrolls = await this.getAllPayrolls();
    return allPayrolls.filter(p => p.month.toLowerCase().includes(month.toLowerCase()));
  }
}

export const payrollApi = new PayrollAPI();
export default payrollApi;