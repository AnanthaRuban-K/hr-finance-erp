import { ApiResponse, Employee, Department, User, DashboardStats, NewEmployee } from '../types/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`API ${options.method || 'GET'} Error:`, error)
      throw error
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  // POST request
  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // PUT request
  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.get<ApiResponse>('/health')
  }

  // Employee APIs
  async getEmployees(): Promise<ApiResponse<Employee[]>> {
    return this.get<ApiResponse<Employee[]>>('/api/employees')
  }

  async createEmployee(employee: NewEmployee): Promise<ApiResponse<Employee>> {
    return this.post<ApiResponse<Employee>>('/api/employees', employee)
  }

  async getEmployee(id: string): Promise<ApiResponse<Employee>> {
    return this.get<ApiResponse<Employee>>(`/api/employees/${id}`)
  }

  // Department APIs
  async getDepartments(): Promise<ApiResponse<Department[]>> {
    return this.get<ApiResponse<Department[]>>('/api/departments')
  }

  // Dashboard APIs
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.get<ApiResponse<DashboardStats>>('/api/dashboard/stats')
  }

  // User APIs
  async getUsers(): Promise<ApiResponse<User[]>> {
    return this.get<ApiResponse<User[]>>('/api/users')
  }
}

export const apiClient = new ApiClient()