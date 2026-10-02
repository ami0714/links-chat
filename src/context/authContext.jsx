import { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { post, get } from '../utils/apiHelper';

const AuthContext = createContext();

export function useAuth() {
  if(!AuthContext) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }
  return useContext(AuthContext);
}



export default function AuthContextProvider({ children }) {
  const queryClient = useQueryClient();

  const fetchUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      return null;
    }

    try {
      const res = await get('/user');
      return res ?? res;
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  };



  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    enabled: !!localStorage.getItem('token'),
    staleTime: 60000,

  });





  const login = (userData) => {
    queryClient.setQueryData(['user'], userData);
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      queryClient.setQueryData(['user'], null);
      return;
    }

    try {
      await post('/logout');
    } catch (error) {
      // Ignore logout request errors and clear the client session.
    } finally {
      localStorage.removeItem('token');
      queryClient.setQueryData(['user'], null);
    }
  };

  const value = { user, login, logout, isLoading, error };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}