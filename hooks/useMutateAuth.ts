"use client"
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import useStore from '../store';
import { Credential } from '../types';
import { useError } from '../hooks/useError';

export const useMutateAuth = () => {
  const router = useRouter();
  const currentPath = usePathname();
  const resetEditedTask = useStore((state) => state.resetEditedTask);
  const { switchErrorHandling } = useError();
  const { setIsLoggedIn } = useStore();

  const login = async (user: Credential) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/login`, user, {
      withCredentials: true
      });
      // await axios.get(`${process.env.NEXT_PUBLIC_FE_URL}/api/token`, {
      // withCredentials: true
      // });
      setIsLoggedIn(true); 
      router.push('/todo');
      router.refresh();
    } catch (err: any) {
      if (err.response?.data?.message) {
        switchErrorHandling(err.response.data.message);
      } else {
        switchErrorHandling(err.response.data);
      }
    }
  };

  const register = async (user: Credential) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/signup`, user);
    } catch (err: any) {
      if (err.response?.data?.message) {
        switchErrorHandling(err.response.data.message);
      } else {
        switchErrorHandling(err.response.data);
      }
    }
  };

  const logout = async () => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/logout`);
    resetEditedTask();
    document.cookie = "authToken=; Max-Age=0; path=/;";
    setIsLoggedIn(false);
    router.push('/'); // 最終的にルートページにリダイレクト
    router.refresh();
  } catch (err: any) {
    if (err.response?.data?.message) {
      switchErrorHandling(err.response.data.message);
    } else {
      switchErrorHandling(err.response.data);
    }
  }
};

  return { login, register, logout };
};
