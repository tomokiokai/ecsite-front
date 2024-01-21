import ReservePage from '../components/ReservePage';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 

export default async function Reserve() {
  const session = await getServerSession(authOptions); // セッションを取得
  const jwtToken = session?.jwt || ""; // JWTトークンをセッションから取得
  // JWTトークンがstring型であることを保証
  const jwtTokenString = typeof jwtToken === 'string' ? jwtToken : '';

  const fetchReservationsData = async () => {
    const headers = {
      'Content-Type': 'application/json',
      ...jwtToken ? { Authorization: jwtTokenString } : {}, // JWTトークンを文字列型としてヘッダーに設定
    };
    
      const res = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/reservations`, {
        headers: headers,
        next: { revalidate: 0 }
      });
      const reservations = await res.json();
      return reservations;
  };
  
  const reservations = await fetchReservationsData();

  return (
    <div className="m-10 text-center">
      <span className="text-lg">
        Please enter the date 🚀
      </span>
      <ReservePage token={jwtTokenString} reservations={reservations} />
    </div>
  );
}