"use client"
import React, { useEffect, useState } from 'react';
import useStore from '../../store';
import Link from 'next/link'
import Image from 'next/image';
import axios from 'axios';
import { Logout } from './Logout';

export default function NavBar() {
  const [userName, setUserName] = useState(null);
  const [csrfToken, setCsrfToken] = useState(''); // CSRFトークンのステートを追加
  const { isLoggedIn } = useStore();

  useEffect(() => {
    if (!csrfToken) {
      // CSRFトークンを取得
      axios.get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/csrf`, { withCredentials: true })
        .then(response => {
          setCsrfToken(response.data.csrf_token); // ステートにセット
        })
        .catch(error => {
          console.error('CSRF token fetch error:', error);
        });
    }

    if (isLoggedIn && csrfToken) {
      axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
      axios.get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/user`, { withCredentials: true })
        .then(response => {
          // ユーザー情報を取得してステートにセット
          const userInfo = response.data;
          setUserName(userInfo.name);
        })
        .catch(error => {
          console.error('User information fetch error:', error);
        });
    } else {
      setUserName(null);
    }
  }, [isLoggedIn, csrfToken]); // 依存配列にcsrfTokenを追加

  return (
    <header className="bg-gray-800 p-4 flex items-center justify-between fixed top-0 w-full z-10 bg-opacity-50">
      <div className="flex items-center"> 
        <Image width="50" height="50" src="https://img.icons8.com/ios-filled/50/FAB005/logo.png" alt="logo"/>
        <span className="text-white font-bold text-xl pr-6">CocoNomi</span>
      </div>
      <div className="flex-grow"> 
        <nav className="space-x-4 flex items-center">     
          <Link
            href="/"
            className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
          >
            Home
          </Link>
          <Link
            href="/todo"
            className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
          >
            todo
          </Link>
          <Link
            href="/blogs"
            className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
          >
            blog
          </Link>
          <Link
            href="/auth"
            className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
          >
            Auth
          </Link>
          <Link
            href="/shops"
            className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
          >
            Shop
          </Link>
          <Link
            href="/mypage"
            className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
          >
            MyPage
          </Link>
        </nav>
      </div>
      <div> 
        {userName ? (
          <div className="flex items-center text-center"> {/* このdivは水平方向のflexコンテナとして機能します */}
          <div className="flex flex-col items-center pr-3"> {/* このdivは垂直方向のflexコンテナとして機能し、テキストを縦に並べます */}
            <span className="text-white">Welcome back!</span> {/* メッセージ行 */}
            <span className="text-white">{userName}</span> {/* ユーザー名行 */}
          </div>
          <Logout /> {/* ログアウトコンポーネントは外側のflexコンテナに直接配置され、ユーザー名の横に表示されます */}
        </div>
        ) : (
          <Link href="/auth" className="text-white pr-6 hover:underline">Sign Up</Link>
        )}
      </div>
    </header>
  );
}
