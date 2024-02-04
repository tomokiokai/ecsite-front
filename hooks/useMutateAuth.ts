"use client";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import useStore from '../store';
import { Credential } from '../types';
import { useError } from '../hooks/useError';

export const useMutateAuth = () => {
  const router = useRouter();
  const { switchErrorHandling } = useError();
  const { setIsLoggedIn } = useStore();
  const resetEditedTask = useStore((state) => state.resetEditedTask);

  const login = async (user: Credential) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/login`, user, {
      withCredentials: true
      });
      setIsLoggedIn(true); 

      const result = await signIn('credentials', {
        redirect: false,
        email : user.email ,
        password: user.password,
      });

      if (result && !result.error) {
        setIsLoggedIn(true);
        router.push('/todo');
        router.refresh();
      } else {
        switchErrorHandling(result && result.error ? result.error : 'ログインに失敗しました。');
      }
    } catch (err) {
      switchErrorHandling('ログインエラーが発生しました。');
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
      // CSRFトークンを取得
        const csrfToken = axios.defaults.headers.common['X-CSRF-Token'] || '';

        // ログアウトリクエストを送信
        await axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/logout`, {}, {
            withCredentials: true,
            headers: {
                'X-CSRF-Token': csrfToken, // CSRFトークンをヘッダーに設定
            },
            });
              resetEditedTask();
              document.cookie = "authToken=; Max-Age=0; path=/;";
              await signOut({ redirect: false });
              setIsLoggedIn(false);
              localStorage.removeItem('user-store');
              router.push('/'); // ルートページへのリダイレクト
              router.refresh();
            } catch (err) {
              switchErrorHandling('ログアウトエラーが発生しました。');
            }
          };

  return { login, register, logout };
};