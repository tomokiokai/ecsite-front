import Image from 'next/image';
import Link from 'next/link';

type Props = {
  id: number;
  imageUrl: string;
  shopName: string;
  description: string;
  area: string;
  address: string;
  genre: string;
  reservationDate?: string;
  isFavorite: boolean; 
  onToggleFavorite?: (shopId: number) => Promise<void>;
  isLoggedIn?: boolean;
  link: string;
  reservationInfo?: { date: string; time: string | undefined; }[];
};

export default function ShopCard(props: Props) {
  const {
    id,
    imageUrl,
    shopName,
    description,
    area,
    address,
    genre,
    reservationDate,
    isFavorite,  
    onToggleFavorite,
    isLoggedIn,
    link,
    reservationInfo
  } = props;

  

  return (
    <div className="w-64 h-auto bg-white rounded-lg shadow-md p-4 hover:opacity-80 cursor-pointer relative">
        <Link prefetch={false} href={link}>  
          <div className="text-center">
            <div className="relative w-full h-40"> 
                <Image
                  src={imageUrl}
                  alt={shopName}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
            </div>
              <h2 className="text-lg font-bold mt-2">{shopName}</h2>
              <p className="text-sm text-gray-500 mt-1">{genre}</p>
              <p className="text-sm text-gray-500 mt-1">{area}</p>
              <p className="text-sm text-gray-500 mt-1">{address}</p>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
              {reservationInfo && reservationInfo.length > 0 && (
        <div className="mt-1">
          <p className="text-md text-blue-500">Reservations</p>
          <ul>
            {reservationInfo.map((info, index) => (
              <li key={index} className="text-sm text-gray-500">
                {`${info.date} at ${info.time}`} {/* 日付と時間を表示 */}
              </li>
            ))}
          </ul>
        </div>
      )}
          </div>
        </Link>
        {isLoggedIn && (
          <button onClick={() => {
            if (onToggleFavorite) {
              onToggleFavorite(id);
            }
          }}>
            {isFavorite ? (
              <span className="text-red-500">❤️</span>
            ) : (
              <span className="text-gray-500">♡</span>
            )}
          </button>
        )}
    </div>
    );
}

