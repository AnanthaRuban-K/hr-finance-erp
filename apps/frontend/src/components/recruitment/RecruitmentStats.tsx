'use client';

import React from 'react';
import { 
  Users, 
  Building2, 
  Calendar, 
  Target, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown,
  Clock
} from 'lucide-react';

interface RecruitmentStatsProps {
  stats: {
    activeJobPostings: number;
    totalApplications: number;
    pendingInterviews: number;
    offersExtended: number;
    newApplicationsToday?: number;
    interviewsThisWeek?: number;
    averageTimeToHire?: number;
    applicationsBySource?: Array<{
      source: string;
      count: number;
      percentage: number;
    }>;
    applicationsByStatus?: Array<{
      status: string;
      count: number;
      percentage: number;
    }>;
  };
  className?: string;
}

export default function RecruitmentStats({ stats, className = '' }: RecruitmentStatsProps) {
  const keyMetrics = [
    {
      title: 'Active Job Postings',
      value: stats.activeJobPostings,
      icon: Building2,
      color: 'text-blue-600 bg-blue-100',
      change: '+2 from last month',
      changeType: 'positive'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: Users,
      color: 'text-green-600 bg-green-100',
      change: `+${stats.newApplicationsToday || 0} today`,
      changeType: 'positive'
    },
    {
      title: 'Pending Interviews',
      value: stats.pendingInterviews,
      icon: Calendar,
      color: 'text-yellow-600 bg-yellow-100',
      change: `${stats.interviewsThisWeek || 0} this week`,
      changeType: 'neutral'
    },
    {
      title: 'Offers Extended',
      value: stats.offersExtended,
      icon: Target,
      color: 'text-purple-600 bg-purple-100',
      change: stats.averageTimeToHire ? `${stats.averageTimeToHire} days avg. hire time` : '',
      changeType: 'neutral'
    }
  ];

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <ArrowUp className="w-3 h-3 text-green-600" />;
      case 'negative':
        return <ArrowDown className="w-3 h-3 text-red-600" />;
      default:
        return <Clock className="w-3 h-3 text-gray-600" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{metric.value}</p>
                {metric.change && (
                  <div className="flex items-center gap-1 mt-2">
                    {getChangeIcon(metric.changeType)}
                    <p className="text-sm text-gray-600">{metric.change}</p>
                  </div>
                )}
              </div>
              <div className={`p-3 rounded-full ${metric.color}`}>
                <metric.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Sources */}
        {stats.applicationsBySource && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Application Sources</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {stats.applicationsBySource.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                      index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {source.source.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {source.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application Pipeline */}
        {stats.applicationsByStatus && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Application Pipeline</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {stats.applicationsByStatus.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      status.status === 'received' ? 'bg-blue-500' :
                      status.status === 'screening' ? 'bg-yellow-500' :
                      status.status === 'shortlisted' ? 'bg-green-500' :
                      status.status === 'interviewed' ? 'bg-purple-500' :
                      status.status === 'offer_extended' ? 'bg-indigo-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {status.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          status.status === 'received' ? 'bg-blue-500' :
                          status.status === 'screening' ? 'bg-yellow-500' :
                          status.status === 'shortlisted' ? 'bg-green-500' :
                          status.status === 'interviewed' ? 'bg-purple-500' :
                          status.status === 'offer_extended' ? 'bg-indigo-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${status.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {status.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Performance Insights */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {stats.totalApplications > 0 ? Math.round((stats.offersExtended / stats.totalApplications) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">Conversion Rate</div>
            <div className="text-xs text-gray-500 mt-1">Applications to Offers</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {stats.averageTimeToHire || 0}
            </div>
            <div className="text-sm text-gray-600">Days to Hire</div>
            <div className="text-xs text-gray-500 mt-1">Average Time</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {stats.activeJobPostings > 0 ? Math.round(stats.totalApplications / stats.activeJobPostings) : 0}
            </div>
            <div className="text-sm text-gray-600">Avg Applications</div>
            <div className="text-xs text-gray-500 mt-1">Per Job Posting</div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.newApplicationsToday !== undefined && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-900">{stats.newApplicationsToday}</div>
              <div className="text-xs text-gray-600">New Today</div>
            </div>
          )}
          {stats.interviewsThisWeek !== undefined && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-900">{stats.interviewsThisWeek}</div>
              <div className="text-xs text-gray-600">Interviews This Week</div>
            </div>
          )}
          {stats.averageTimeToHire !== undefined && (
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-900">{stats.averageTimeToHire}</div>
              <div className="text-xs text-gray-600">Days to Hire</div>
            </div>
          )}
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-gray-900">
              {stats.totalApplications > 0 ? Math.round((stats.pendingInterviews / stats.totalApplications) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-600">Interview Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}