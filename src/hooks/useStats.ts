import { useQuery } from 'react-query';

interface Stats {
  totalMembers: number;
  newToday: number;
  leftToday: number;
  activeUsers: number;
}

interface Member {
  telegram_id: string;
  username: string | null;
  first_name: string;
  last_name: string | null;
  join_date: string;
  leave_date: string | null;
  is_active: boolean;
}

interface TrendData {
  date: string;
  total_members: number;
  new_members: number;
  left_members: number;
}

const defaultQueryConfig = {
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  staleTime: 30000,
  refetchInterval: 30000,
};

async function fetchApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`/api${endpoint}`);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
    throw new Error('An unknown error occurred');
  }
}

export function useStats() {
  return useQuery<Stats, Error>(
    'stats', 
    () => fetchApi<Stats>('/stats'),
    defaultQueryConfig
  );
}

export function useMemberActivity() {
  return useQuery<Member[], Error>(
    'members', 
    () => fetchApi<Member[]>('/members'),
    defaultQueryConfig
  );
}

export function useTrends() {
  return useQuery<TrendData[], Error>(
    'trends', 
    () => fetchApi<TrendData[]>('/trends'),
    defaultQueryConfig
  );
}