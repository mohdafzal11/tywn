import { useState, useEffect } from 'react';
import { getApiUrl } from '@/lib/utils';
import { User } from '@/types';

interface UseUserReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  logout: () => Promise<void>;
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(getApiUrl('/user'), {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          setUser(null);
          return;
        }
        throw new Error('Failed to fetch user');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(getApiUrl('/logout'), {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      const data = await response.json();
      
      if (data.success) {
        // Clear user state
        setUser(null);
        // Redirect to login page from frontend
        window.location.href = '/login';
      } else {
        throw new Error(data.message || 'Logout failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    logout,
  };
}