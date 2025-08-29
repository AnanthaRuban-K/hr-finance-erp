'use client';

import { useState, useEffect } from 'react';
import { recruitmentApi } from '@/lib/api/recruitment';
import type { JobPosting, CreateJobPostingData } from '@/lib/api/recruitment';

export function useJobPostings(filters: any = {}) {
  const [data, setData] = useState<{
    jobPostings: JobPosting[];
    total: number;
    loading: boolean;
    error: string | null;
  }>({
    jobPostings: [],
    total: 0,
    loading: true,
    error: null
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        const response = await recruitmentApi.getJobPostings(filters);
        setData({
          jobPostings: response.data,
          total: response.pagination.total,
          loading: false,
          error: null
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred'
        }));
      }
    };

    fetchData();
  }, [filters, refreshTrigger]);

  const refresh = () => setRefreshTrigger(prev => prev + 1);

  const createJobPosting = async (jobData: CreateJobPostingData) => {
    try {
      const response = await recruitmentApi.createJobPosting(jobData);
      refresh(); // Refresh the list after creation
      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    ...data,
    refresh,
    createJobPosting
  };
}

export function useDashboardStats() {
  const [data, setData] = useState({
    stats: {
      activeJobPostings: 0,
      totalApplications: 0,
      pendingInterviews: 0,
      offersExtended: 0
    },
    loading: true,
    error: null as string | null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setData(prev => ({ ...prev, loading: true, error: null }));
        const response = await recruitmentApi.getDashboardStats();
        setData({
          stats: response.data,
          loading: false,
          error: null
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to load stats'
        }));
      }
    };

    fetchStats();
  }, []);

  return data;
}