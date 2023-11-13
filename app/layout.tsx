import NavBar from './components/nav-bar';
import { cookies } from 'next/headers';
import './globals.css';

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Nextjs App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  async function getUserInfo() {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll(); // すべてのクッキーを取得する配列
  console.log(allCookies);
  // userInfoクッキーを探す
  const userCookie = allCookies.find(cookie => cookie.name === 'userInfo');

  if (!userCookie) {
    console.log('No userInfo cookie found', allCookies);
    return 'No userInfo';
  }

  const userInfoDecoded = decodeURIComponent(userCookie.value);
  const userInfo = JSON.parse(userInfoDecoded);
  console.log('User Info:', userInfo);
  return userInfo;
}
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

