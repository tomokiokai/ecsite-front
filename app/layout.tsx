import NavBar from './components/nav-bar';
import { cookies } from 'next/headers';
import './globals.css';

export const metadata = {
  title: 'Nextjs App',
  description: 'Generated by create next app',
}

async function getUserInfo() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/cookies`, {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Cookie: cookies().toString(),
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Response not OK:', res.status);
      return 'Failed to fetch user info'; // ここで特定の文字列を返す
    }

    const cookieMap = await res.json();
    // userInfo クッキーの値が存在するか確認する
    const userInfoEncoded = cookieMap.userInfo;
    if (!userInfoEncoded) {
      console.log('No userInfo cookie found');
      return 'No userInfo'; // ここで特定の文字列を返す
    }
    const userInfoDecoded = decodeURIComponent(userInfoEncoded);
    const userInfo = JSON.parse(userInfoDecoded);
    console.log(userInfo);
    return userInfo;
  } catch (error) {
    // エラーが発生した場合の処理
    console.error('Error fetching or parsing userInfo:', error);
    return 'Error occurred'; // ここで特定の文字列を返す
  }
}


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  const userInfo = await getUserInfo();
  return (
    <html>
      <body className="pt-16">
        <NavBar userInfo={userInfo}/>
          {children}
      </body>
    </html>
  );
}
