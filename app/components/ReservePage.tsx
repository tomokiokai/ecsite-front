'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import BackBtn from '../components/back-btn';
import Image from 'next/image';
import axios from 'axios';

type Reservation = {
    id: number;
    date: string; 
    time: string;
    shop_id: number; 
    user_id: number;
    num: number;
};

type ReservePageProps = {
  token: string;
  csrfToken: string;
  reservations: Reservation[];
};

export default function ReservePage({ token, csrfToken, reservations }: ReservePageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shopId, setShopId] = useState<string | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState(0);

  useEffect(() => {
    const shopIdValue = searchParams?.get('shopId');
    if (shopIdValue) {
      setShopId(shopIdValue);
    }
  }, [searchParams]);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = token;
    axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const generateWeekDates = (index: number) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + index * 7);

    return Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(startDate);
    date.setUTCDate(date.getUTCDate() + i);
    return {
      date,
      dateString: `${date.getUTCMonth() + 1}/${date.getUTCDate()}(${["日", "月", "火", "水", "木", "金", "土"][date.getUTCDay()]})`
    };
  });
};

  const dates = generateWeekDates(currentWeekIndex);
  const times = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const bookedTimeSlots: { [key: string]: string[] } = {};

  if (shopId !== null) {
  const currentShopReservations = reservations.filter(reservation => reservation.shop_id === parseInt(shopId));

  currentShopReservations.forEach((reservation) => {
    const reservedDate = new Date(reservation.date);
    const reservedDateString = `${reservedDate.getUTCMonth() + 1}/${reservedDate.getUTCDate()}(${["日", "月", "火", "水", "木", "金", "土"][reservedDate.getUTCDay()]})`;

    const reservedTime = reservation.time;

    if (!bookedTimeSlots[reservedDateString]) {
      bookedTimeSlots[reservedDateString] = [];
    }
    bookedTimeSlots[reservedDateString].push(reservedTime);
  });
    } else {
  console.error('shopId is null. Unable to process reservations.');
}

  const handleSlotClick = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setNumberOfPeople(1);
  };

  const handlePrevWeek = () => {
    setCurrentWeekIndex(prev => prev - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeekIndex(prev => prev + 1);
  };

  const handleReserve = async () => {
    if (!shopId || !selectedDate || !selectedTime || numberOfPeople === 0) {
      console.log('Reservation details are not complete.');
      return;
    }

    try {
      const dateMatch = selectedDate.match(/(\d+)\/(\d+)/);
      if (!dateMatch) {
        console.error('Invalid date format.');
        return;
      }

      const [, month, day] = dateMatch;
      const year = new Date().getFullYear();
      const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      const dateTimeString = `${isoDate}T${selectedTime}:00Z`;

      const requestBody = {
        date: dateTimeString,
        time: selectedTime,
        num: numberOfPeople,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}/reservations/shop/${shopId}`,
        requestBody
      );

      if (response.status === 201) {
        console.log('Reservation successful!');
        alert('Your reservation is confirmed');
        router.refresh();
      } else {
        console.error('Reservation failed.');
      }
    } catch (error) {
      console.error('An error occurred while making a reservation:', error);
    }
  };

  const showPrevWeekButton = currentWeekIndex > 0;

  return (
    <div className="m-10 text-center">
      {/* ページネーションのボタンとBackボタンの配置を調整するコンテナ */}
      <div className="flex justify-between items-center mb-4 mx-auto">
        {showPrevWeekButton ? (
          <button onClick={handlePrevWeek}>
            <Image width="50" height="50" src="https://img.icons8.com/pastel-glyph/64/circled-chevron-right.png" className="transform rotate-180" alt="前の週" />
          </button>
        ) : (
          <div style={{ width: '50px', height: '50px', pointerEvents: 'none' }}></div>
        )}

        {/* 「戻る」ボタンをここに移動し、フレックスアイテムの中央に配置します。 */}
        <div className="flex-grow text-center">
          <BackBtn />
        </div>

        <button onClick={handleNextWeek}>
          <Image width="50" height="50" src="https://img.icons8.com/pastel-glyph/64/circled-chevron-right.png" alt="次の週" />
        </button>
      </div>

      {/* 以下のコードは変更なし */}
      <div className="grid grid-cols-7 gap-4 mb-4">
        {dates.map(({ date, dateString }) => (
          <div key={dateString} className={`text-center ${date < today ? 'opacity-50 pointer-events-none' : ''}`}>
            {dateString}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {dates.map(({ date, dateString }) => (
          <div key={dateString}>
            {times.map(time => {
              const isBooked = bookedTimeSlots[dateString] && bookedTimeSlots[dateString].includes(time);
              return (
                <div
                  key={time}
                  className={`relative rounded mb-2 ${selectedDate === dateString && selectedTime === time ? 'bg-blue-500 text-white' : 'bg-gray-300'} ${isBooked ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => !isBooked && handleSlotClick(dateString, time)}
                  style={{ height: '40px' }}
                >
                  <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    {time}
                  </span>
                  {selectedDate === dateString && selectedTime === time && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center">
                      <button
                        onClick={(e) => { e.stopPropagation(); setNumberOfPeople(Math.max(1, numberOfPeople - 1)); }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-l"
                      >
                        -
                      </button>
                      <span className="border-2 border-gray-300 px-2 py-1">{`${numberOfPeople}人`}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setNumberOfPeople(numberOfPeople + 1); }}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded-r"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <button onClick={handleReserve} className="mr-4 bg-blue-500 hover:bg-indigo-700 px-3 py-1 text-white font-medium rounded">
          Confirm Reservation
        </button>
      </div>
    </div>
  );
}
