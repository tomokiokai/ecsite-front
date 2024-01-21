import { Shop } from '../../types';
import BackBtn from '../components/back-btn';
import ReserveBtn from '../components/reserve-btn'
import Image from 'next/image';


type Props = {
  shop: Shop;
  token: string;
};

const ShopDetailModal: React.FC<Props> = ({ shop, token }) => {
  const { id: shopId } = shop;
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-[1000px] h-[600px] mx-auto overflow-auto flex flex-col justify-center items-center">
        <div className="flex flex-col gap-4">
          <div className="flex gap-8 justify-center items-center">
            <div className="flex flex-col">
              <p className="text-xl font-bold m-4">ショップ名：{shop.name}</p>
              <p className="text-lg m-4">ジャンル：{shop.genre}</p>
              <p className="text-lg m-4">エリア：{shop.area}</p>
              <p className="text-lg m-4">アドレス：{shop.address}</p>
            </div>
            <div className="flex justify-center items-center m-4">
              <Image
                src={shop.imageUrl}
                alt={`${shop.name} image`}
                width={500}
                height={300}
                className="rounded-lg shadow-lg" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-lg">コメント：{shop.description}</p>
          </div>
          <div className="my-5 flex justify-center space-x-8">
            <BackBtn />
            <ReserveBtn shopId={shopId.toString()} token={token} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailModal;
