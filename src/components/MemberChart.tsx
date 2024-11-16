import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTrends } from '../hooks/useStats';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const MemberChart: React.FC = () => {
  const { data: trends, isLoading, error, refetch } = useTrends();

  if (isLoading) {
    return <LoadingSpinner message="Loading chart data..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Chart Error"
        message="Failed to load trend data"
        onRetry={refetch}
      />
    );
  }

  if (!trends?.length) {
    return (
      <div className="h-96 flex items-center justify-center text-gray-500">
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={trends}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          tickFormatter={(date) => new Date(date).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(date) => new Date(date).toLocaleDateString()}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="total_members" 
          stroke="#2563eb" 
          name="Total Members"
        />
        <Line 
          type="monotone" 
          dataKey="new_members" 
          stroke="#16a34a" 
          name="New Members"
        />
        <Line 
          type="monotone" 
          dataKey="left_members" 
          stroke="#dc2626" 
          name="Left Members"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MemberChart;