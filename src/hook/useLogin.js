import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { logUser,registerUser } from '../api/authApi';
import {useAuth} from '../context/authContext';

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {login} = useAuth()

  return useMutation({
    mutationFn: async (loginData) => {
      const response = await logUser(loginData);
      const token = response?.token || response?.access_token;

      if (token) {
        localStorage.setItem('token', token);
        login(response.user)
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/home');
    },
    onError: (err) => {
      alert(err?.message || 'Login failed. Please try again.');
    },
  });
}

export function useRegister(){
  const querClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await registerUser(payload);
    }
  })
  
}