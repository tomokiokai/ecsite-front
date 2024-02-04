"use client"
import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { CheckBadgeIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { useMutateAuth } from '../../hooks/useMutateAuth';
import { CsrfToken } from '../../types';
import { redirect } from 'next/navigation';
import { useSession, signIn } from "next-auth/react";
import useStore from '../../store';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export const Auth = ({ token }: { token: string }) => {
  const setCsrfToken = useStore((state) => state.setCsrfToken);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState(''); // ユーザー名を管理するための新しい state 変数
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useMutateAuth(); // login と register を取得
  const { data: session, status } = useSession();
  const setUser = useStore((state) => state.setUser);
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // OAuth認証が成功し、セッション情報が存在する場合
      const userInfo = { email: session.user.email, name: session.user.name };
      axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/auth/signup`, userInfo, {
        withCredentials: true
      }).then(response => {
        // バックエンドからユーザー情報とJWTトークンを含む応答が返されると仮定
        if (response.data.jwt) {
          // JWTトークンをlocalStorageに保存（オプショナル）
          localStorage.setItem('jwt', response.data.jwt);
        }
        // グローバルステートを更新
        setUser({ name: response.data.user.name, email: response.data.user.email });
        setIsLoggedIn(true);
      }).catch(error => {
        console.error('Failed to send user info to backend:', error);
      });
    } else if (status === 'unauthenticated') {
      // セッション情報がない場合、ユーザー情報をクリア
      setUser(null);
      setIsLoggedIn(false);
    }
  }, [status, session, setUser, setIsLoggedIn]);


  const submitAuthHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLogin) {
      await login({ email, password: pw }); // login 関数を使用
    } else {
      // register関数を呼び出す際にnameも送信
      await register({ email, password: pw, name }) // nameを追加
        .then(() => login({ email, password: pw })); // 登録後、ログインを試みる
    }
  };

  useEffect(() => {
  if (token) {
      redirect('/');
    }
  let isMounted = true;
  let retryTimeout: ReturnType<typeof setTimeout>;

  const fetchCsrfToken = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/csrf`, {
        withCredentials: true
      });
      if (isMounted) {
        axios.defaults.headers.common['X-CSRF-Token'] = data.csrf_token;
        setCsrfToken(data.csrf_token);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      if (isMounted) {
        // 3秒後にリトライ
        retryTimeout = setTimeout(fetchCsrfToken, 5000);
      }
    }
  };

  fetchCsrfToken();

  return () => {
    isMounted = false;
    clearTimeout(retryTimeout); // コンポーネントのアンマウント時にタイマーをクリア
  };
}, [setCsrfToken]);

  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <div className="flex items-center">
        <CheckBadgeIcon className="h-8 w-8 mr-2 text-blue-500" />
        <span className="text-center text-3xl font-extrabold">
          App by Next.js(Ver.14.0.1)/Go(Echo)
        </span>
      </div>
      <h2 className="my-6">{isLogin ? 'Login' : 'Create a new account'}</h2>
      <form onSubmit={submitAuthHandler}>
        {!isLogin && ( // 登録の場合のみ名前フィールドを表示
          <div className="w-full flex justify-center">
            <input
              className="mb-3 px-3 text-sm py-2 border border-gray-300"
              name="name"
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        )}
        <div className="w-full flex justify-center">
          <input
            className="mb-3 px-3 text-sm py-2 border border-gray-300"
            name="email"
            type="email"
            autoFocus
            placeholder="Email address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="w-full flex justify-center">
          <input
            className="mb-3 px-3 text-sm py-2 border border-gray-300"
            name="password"
            type="password"
            placeholder="Password"
            onChange={(e) => setPw(e.target.value)}
            value={pw}
          />
        </div>
        <div className="flex flex-col items-center my-2 w-full px-4">
          <button
            className="disabled:opacity-40 py-2 px-4 rounded text-white bg-indigo-600 mb-2"
            disabled={!email || !pw || (!isLogin && !name)}
            type="submit"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          <button
            onClick={() => signIn('google')}
            type="button"
            className="py-2 px-4 rounded bg-white border border-gray-300 text-gray-700 flex items-center mb-2"
            
          >
            <FcGoogle className="mr-2" /> Sign in with Google
          </button>

          <button
            onClick={() => signIn('github')}
            type="button"
            className="py-2 px-4 rounded text-white bg-gray-900 flex items-center"
            
          >
            <FaGithub className="mr-2" /> Sign in with GitHub
          </button>
        </div>
      </form>
      <ArrowPathIcon
        onClick={() => setIsLogin(!isLogin)}
        className="h-6 w-6 my-2 text-blue-500 cursor-pointer"
      />
      {isLoading && (
        <p className="text-red-500 text-lg font-bold animate-blink">
          Render無料枠のため、サーバー再起動中！少々お待ちください。
        </p>
      )}
    </div>
  );
};
