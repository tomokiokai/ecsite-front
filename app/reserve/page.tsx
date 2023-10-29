import ReservePage from '../components/ReservePage';
import { cookies } from 'next/headers';  

export default async function Reserve() {
  const cookieStore = cookies();
  const jwtToken = cookieStore.get('token'); 
  const csrfToken = cookieStore.get('_csrf'); 

  const fetchReservationsData = async () => {
    if (csrfToken) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/reservations`, {
        headers: {
          // 'Content-Type': 'application/json',
          ...jwtToken ? { Authorization: `${jwtToken.value}` } : {},
          'X-CSRF-Token': csrfToken.value
        },
        next: { revalidate: 0 }
      });
      const reservations = await res.json();
      return reservations;
    } else {
      throw new Error("CSRF token is missing. Unable to proceed.");
    }
  };
  
  const reservations = await fetchReservationsData();

  return (
    <div className="m-10 text-center">
      <span className="text-lg">
        Please enter the date 🚀
      </span>
      <ReservePage token={jwtToken?.value || ""} csrfToken={csrfToken?.value || ""} reservations={reservations} />
    </div>
  );
}