'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Calendar, 
  Target,
  TrendingUp,
  Plus,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// API functions (create these in your API layer)
const fetchDashboardStats = async () => {
  const response = await fetch('/api/recruitment/dashboard');
  if (!response.ok) throw new Error('Failed to fetch dashboard stats');
  return response.json();
};

export default function RecruitmentDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    activeJobPostings: 0,
    totalApplications: 0,
    pendingInterviews: 0,
    offersExtended: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const dashboardCards = [
    {
      title: 'Active Job Postings',
      value: stats.activeJobPostings,
      icon: Building2,
      color: 'text-blue-600 bg-blue-100',
      href: '/hr/recruitment/jobs',
      action: 'Manage postings'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: Users,
      color: 'text-green-600 bg-green-100',
      href: '/hr/recruitment/applications',
      action: 'Review applications'
    },
    {
      title: 'Pending Interviews',
      value: stats.pendingInterviews,
      icon: Calendar,
      color: 'text-yellow-600 bg-yellow-100',
      href: '/hr/recruitment/interviews',
      action: 'Schedule interviews'
    },
    {
      title: 'Offers Extended',
      value: stats.offersExtended,
      icon: Target,
      color: 'text-purple-600 bg-purple-100',
      href: '/hr/recruitment/offers',
      action: 'Track offers'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your recruitment activities</p>
        </div>
        <Link
          href="/hr/recruitment/jobs/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4" />
          Create Job Posting
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
            </div>
            <Link
              href={card.href}
              className="text-sm text-blue-600 mt-2 flex items-center gap-1 hover:underline"
            >
              <ArrowRight className="w-3 h-3" />
              {card.action}
            </Link>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/hr/recruitment/jobs/create"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Create Job Posting</p>
              <p className="text-xs text-gray-600">Post a new job opening</p>
            </div>
          </Link>

          <Link
            href="/hr/recruitment/applications"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Review Applications</p>
              <p className="text-xs text-gray-600">Screen pending candidates</p>
            </div>
          </Link>

          <Link
            href="/hr/recruitment/interviews"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Schedule Interview</p>
              <p className="text-xs text-gray-600">Set up candidate interviews</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}