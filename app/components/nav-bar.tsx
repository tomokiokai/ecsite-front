"use client"
import React, { useEffect } from 'react';
import useStore from '../../store';
import Link from 'next/link'
import Image from 'next/image';
import axios from 'axios';
import { Logout } from './Logout';

export default function NavBar() {
  const { user, isLoggedIn, csrfToken, setCsrfToken, jwtToken } = useStore();
  useEffect(() => {  
    if (!csrfToken) {
      axios.defaults.withCredentials = true;
      axios.get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/csrf`, { withCredentials: true })
        .then(response => {
          const newCsrfToken = response.data.csrf_token;
          setCsrfToken(newCsrfToken);
          // CSRF トークンを Axios デフォルトヘッダーに設定
          axios.defaults.headers.common['X-CSRF-Token'] = newCsrfToken;
        })
        .catch(error => {
          console.error('CSRF token fetch error:', error);
        });
    } else {
      // 既にCSRFトークンが存在する場合は、Axiosのデフォルト設定を更新
      axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
    }
  }, [csrfToken, isLoggedIn, setCsrfToken]);

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
          {/* ログイン状態に応じたリンク先の切り替え */}
          <Link
            href={isLoggedIn || jwtToken ? "/todo" : "/auth"}
            className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
          >
            Todo
          </Link>
          <Link
            href="/blogs"
            className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
          >
            Blog
          </Link>
          <Link
            href="/auth"
            className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
          >
            Auth
          </Link>
          <Link
            href={isLoggedIn || jwtToken ? "/shops" : "/static-shops"}
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
          <Link
            href={isLoggedIn || jwtToken ? "/books" : "/auth"}
            className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
          >
            Purchase
          </Link>
        </nav>
      </div>
      <div> 
        {isLoggedIn ? (
          <div className="flex items-center text-center"> {/* このdivは水平方向のflexコンテナとして機能します */}
          <div className="flex flex-col items-center pr-3"> {/* このdivは垂直方向のflexコンテナとして機能し、テキストを縦に並べます */}
            <span className="text-white">Welcome back!</span> {/* メッセージ行 */}
            <span className="text-white">{user?.name}</span> {/* ユーザー名行 */}
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
