'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '../../lib/api'
import { Employee } from '../../types/api'

interface EmployeePageState {
  employees: Employee[]
  loading: boolean
  error: string | null
}

export default function EmployeesPage(): JSX.Element {
  const [state, setState] = useState<EmployeePageState>({
    employees: [],
    loading: true,
    error: null
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await apiClient.getEmployees()
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          employees: response.data || [],
          loading: false
        }))
      } else {
        setState(prev => ({
          ...prev,
          error: response.error || 'Failed to fetch employees',
          loading: false
        }))
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Error connecting to server',
        loading: false
      }))
      console.error('Error fetching employees:', error)
    }
  }

  const formatSalary = (salary: string | undefined): string => {
    if (!salary) return 'N/A'
    return `₹${parseFloat(salary).toLocaleString('en-IN')}`
  }

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-IN')
  }

  if (state.loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '1.5rem' }}>
          <p>Version 1.0.0</p>
          <p>TypeScript + Neon PostgreSQL</p>
        </div>
      </div>
    
  )
}
}