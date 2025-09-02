import { useState, useEffect, useCallback } from 'react';
import { payrollApi, Payroll, CreatePayrollRequest, UpdatePayrollRequest } from '@/lib/api/payrollApi';

interface UsePayrollReturn {
  payrolls: Payroll[];
  loading: boolean;
  error: string | null;
  stats: {
    total: number;
    paid: number;
    pending: number;
    totalAmount: number;
  };
  createPayroll: (data: CreatePayrollRequest) => Promise<void>;
  updatePayroll: (id: string, data: UpdatePayrollRequest) => Promise<void>;
  deletePayroll: (id: string) => Promise<void>;
  markAsPaid: (id: string) => Promise<void>;
  refreshPayrolls: () => Promise<void>;
  getPayrollById: (id: string) => Payroll | undefined;
  clearError: () => void;
}

export const usePayroll = (): UsePayrollReturn => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate stats
  const stats = {
    total: payrolls.length,
    paid: payrolls.filter(p => p.isPaid).length,
    pending: payrolls.filter(p => !p.isPaid).length,
    totalAmount: payrolls.reduce((sum, p) => sum + parseFloat(p.netPay.toString()), 0)
  };

  // Load all payrolls
  const loadPayrolls = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await payrollApi.getAllPayrolls();
      setPayrolls(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load payrolls';
      setError(errorMessage);
      console.error('Error loading payrolls:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new payroll
  const createPayroll = useCallback(async (data: CreatePayrollRequest) => {
    try {
      setError(null);
      await payrollApi.createPayroll(data);
      await loadPayrolls(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payroll';
      setError(errorMessage);
      throw err;
    }
  }, [loadPayrolls]);

  // Update existing payroll
  const updatePayroll = useCallback(async (id: string, data: UpdatePayrollRequest) => {
    try {
      setError(null);
      await payrollApi.updatePayroll(id, data);
      await loadPayrolls(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payroll';
      setError(errorMessage);
      throw err;
    }
  }, [loadPayrolls]);

  // Delete payroll
  const deletePayroll = useCallback(async (id: string) => {
    try {
      setError(null);
      await payrollApi.deletePayroll(id);
      await loadPayrolls(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete payroll';
      setError(errorMessage);
      throw err;
    }
  }, [loadPayrolls]);

  // Mark payroll as paid
  const markAsPaid = useCallback(async (id: string) => {
    try {
      setError(null);
      await payrollApi.markPayrollAsPaid(id);
      await loadPayrolls(); // Refresh the list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to mark payroll as paid';
      setError(errorMessage);
      throw err;
    }
  }, [loadPayrolls]);

  // Get payroll by ID
  const getPayrollById = useCallback((id: string) => {
    return payrolls.find(p => p.id === id);
  }, [payrolls]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Refresh payrolls (alias for loadPayrolls)
  const refreshPayrolls = useCallback(() => {
    return loadPayrolls();
  }, [loadPayrolls]);

  // Load payrolls on mount
  useEffect(() => {
    loadPayrolls();
  }, [loadPayrolls]);

  return {
    payrolls,
    loading,
    error,
    stats,
    createPayroll,
    updatePayroll,
    deletePayroll,
    markAsPaid,
    refreshPayrolls,
    getPayrollById,
    clearError
  };
};