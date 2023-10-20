import ReservePage from '../components/ReservePage';
import { cookies } from 'next/headers';  

export default function Reserve() {
  const cookieStore = cookies();
  const jwtToken = cookieStore.get('token');  // 'token'という名前のCookieを取得
  const csrfToken = cookieStore.get('_csrf');  // '_csrf'という名前のCookieを取得
  
  return (
    <div className="m-10 text-center">
      <span className="text-lg">
        Please enter the date 🚀
      </span>
      <ReservePage token={jwtToken?.value || ""} csrfToken={csrfToken?.value || ""} />
    </div>
  );
}
