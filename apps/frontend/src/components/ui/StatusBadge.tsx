import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'recruitment' | 'application';
}

export default function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    if (variant === 'recruitment') {
      const configs = {
        active: { color: 'bg-green-100 text-green-800', label: 'Active' },
        draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
        paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Paused' },
        closed: { color: 'bg-red-100 text-red-800', label: 'Closed' }
      };
      return configs[status] || configs.draft;
    }

    if (variant === 'application') {
      const configs = {
        received: { color: 'bg-blue-100 text-blue-800', label: 'Received' },
        screening: { color: 'bg-yellow-100 text-yellow-800', label: 'Screening' },
        shortlisted: { color: 'bg-green-100 text-green-800', label: 'Shortlisted' },
        interviewed: { color: 'bg-purple-100 text-purple-800', label: 'Interviewed' },
        rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' }
      };
      return configs[status] || configs.received;
    }

    return { color: 'bg-gray-100 text-gray-800', label: status };
  };

  const config = getStatusConfig();
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}