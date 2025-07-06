'use client'

import { useState, useEffect } from 'react'

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Test basic fetch first
    console.log('Component mounted, testing API...')
    testAPI()
  }, [])

  const testAPI = async () => {
    try {
      console.log('Fetching from API...')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      console.log('API URL:', API_URL)
      
      const response = await fetch(`${API_URL}/api/employees`)
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('API Response:', data)
      
      if (data.success && data.data) {
        setEmployees(data.data)
        setError(null)
      } else {
        setError('API returned unsuccessful response')
      }
    } catch (error) {
      console.error('API Error:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Employee Management</h1>
        <p>Loading employees...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Employee Management</h1>
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#dc2626', 
          padding: '1rem', 
          borderRadius: '4px' 
        }}>
          <p><strong>Error:</strong> {error}</p>
          <button onClick={testAPI} style={{ 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Employee Management ({employees.length})</h1>
      
      {employees.length === 0 ? (
        <p>No employees found in database</p>
      ) : (
        <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px' }}>
          <h2>Employees:</h2>
          <ul>
            {employees.map((emp: any) => (
              <li key={emp.id || emp.employeeId}>
                {emp.firstName} {emp.lastName} - {emp.department} ({emp.employeeId})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}