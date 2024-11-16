import React from 'react';
import { useMemberActivity } from '../hooks/useStats';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const MemberTable: React.FC = () => {
  const { data: members, isLoading, error, refetch } = useMemberActivity();

  if (isLoading) {
    return <LoadingSpinner message="Loading member data..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Member Data Error"
        message="Failed to load member activity"
        onRetry={refetch}
      />
    );
  }

  if (!members?.length) {
    return (
      <div className="p-8 text-center text-gray-500">
        No member activity to display
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              User Info
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Telegram ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Join Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {members.map((member) => (
            <tr key={member.telegram_id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {member.first_name} {member.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {member.username ? `@${member.username}` : 'No username'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-mono text-gray-500">
                  {member.telegram_id}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(member.join_date).toLocaleString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {member.is_active ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    No grupo
                  </span>
                ) : (
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-1">
                      Saiu do grupo
                    </span>
                    <div className="text-xs text-gray-500">
                      {new Date(member.leave_date).toLocaleString()}
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;