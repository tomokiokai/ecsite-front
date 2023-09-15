import { Auth } from '../components/Auth';
import { cookies } from 'next/headers';

export default function Home() {
  const cookieStore = cookies();
  const jwtToken = cookieStore.get('token');  // 'token'という名前のCookieを取得
  
  return (
        <main>
          <Auth token={jwtToken?.value || ""}/>
        </main>
  );
}
