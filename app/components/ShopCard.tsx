import Image from 'next/image';

type Props = {
  id: number;
  imageUrl: string;
  shopName: string;
  description: string;
  area: string;
  address: string;
  genre: string;
  reservationDate?: string;
  // onClick: (id: number) => void;
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
    // onClick,
  } = props;

  return (
    <div
      className="w-64 h-auto bg-white rounded-lg shadow-md p-4 hover:opacity-80 cursor-pointer relative"  // relative を追加
      // onClick={() => onClick(id)}
    >
      <div className="text-center">
        <div className="relative w-full h-40">  {/* この div を追加 */}
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
        {reservationDate && (
          <p className="text-md text-blue-500 mt-1">
            Reservation: {reservationDate}
          </p>
        )}
      </div>
    </div>
  );
}
