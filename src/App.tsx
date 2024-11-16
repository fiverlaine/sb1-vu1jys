import React from 'react';
import { BarChart3, Users, UserPlus, UserMinus, Download, Calendar } from 'lucide-react';
import MemberChart from './components/MemberChart';
import StatsCard from './components/StatsCard';
import MemberTable from './components/MemberTable';
import DateRangePicker from './components/DateRangePicker';
import ErrorBoundary from './components/ErrorBoundary';
import { useStats } from './hooks/useStats';

function Dashboard() {
  const { data: stats, isLoading, error } = useStats();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
          <h1 className="text-xl font-bold text-red-600 mb-4">Error Loading Data</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Group Analytics Dashboard</h1>
            <button
              onClick={() => {/* Handle report generation */}}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <DateRangePicker />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatsCard
            title="Total Members"
            value={stats?.totalMembers || 0}
            change="+2.5%"
            icon={<Users className="h-6 w-6 text-blue-600" />}
            isLoading={isLoading}
          />
          <StatsCard
            title="New Today"
            value={stats?.newToday || 0}
            change={`+${stats?.newToday || 0}`}
            icon={<UserPlus className="h-6 w-6 text-green-600" />}
            isLoading={isLoading}
          />
          <StatsCard
            title="Left Today"
            value={stats?.leftToday || 0}
            change={`-${stats?.leftToday || 0}`}
            icon={<UserMinus className="h-6 w-6 text-red-600" />}
            isLoading={isLoading}
          />
          <StatsCard
            title="Active Users"
            value={stats?.activeUsers || 0}
            change="+1.2%"
            icon={<BarChart3 className="h-6 w-6 text-purple-600" />}
            isLoading={isLoading}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Member Growth Trends</h2>
          <MemberChart />
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Member Activity</h2>
          </div>
          <MemberTable />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Dashboard />
    </ErrorBoundary>
  );
}

export default App;