"use client"
import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { CheckBadgeIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { useMutateAuth } from '../../hooks/useMutateAuth';
import { CsrfToken } from '../../types';
import { redirect } from 'next/navigation';
import useStore from '../../store';

export const Auth = ({ token }: { token: string }) => {
  const setCsrfToken = useStore((state) => state.setCsrfToken);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState(''); // ユーザー名を管理するための新しい state 変数
  const [isLogin, setIsLogin] = useState(true);
  const { login, register } = useMutateAuth(); // login と register を取得

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
    console.log(token);
    if (token) {
      redirect('/');
    }

    axios.defaults.withCredentials = true;
    const getCsrfToken = async () => {
      const { data } = await axios.get<CsrfToken>(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}/csrf`
      );
      axios.defaults.headers.common['X-CSRF-Token'] = data.csrf_token;
      setCsrfToken(data.csrf_token);
    };
    getCsrfToken();
  }, [token]);

  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <div className="flex items-center">
        <CheckBadgeIcon className="h-8 w-8 mr-2 text-blue-500" />
        <span className="text-center text-3xl font-extrabold">
          App by Next.js(Ver.13.4)/Go(Echo)
        </span>
      </div>
      <h2 className="my-6">{isLogin ? 'Login' : 'Create a new account'}</h2>
      <form onSubmit={submitAuthHandler}>
        {!isLogin && ( // 登録の場合のみ名前フィールドを表示
          <div>
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
        <div>
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
        <div>
          <input
            className="mb-3 px-3 text-sm py-2 border border-gray-300"
            name="password"
            type="password"
            placeholder="Password"
            onChange={(e) => setPw(e.target.value)}
            value={pw}
          />
        </div>
        <div className="flex justify-center my-2">
          <button
            className="disabled:opacity-40 py-2 px-4 rounded text-white bg-indigo-600"
            disabled={!email || !pw || (!isLogin && !name)} // 登録の場合、名前も必須
            type="submit"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </div>
      </form>
      <ArrowPathIcon
        onClick={() => setIsLogin(!isLogin)}
        className="h-6 w-6 my-2 text-blue-500 cursor-pointer"
      />
    </div>
  );
};
