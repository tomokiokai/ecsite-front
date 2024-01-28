import React from 'react';
import ShopCard from './ShopCard';

type Shop = {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
  area: string;
  address: string;
  genre: string;
};

type ShopListStaticWithoutSessionProps = {
  shops: Shop[];
};

// ランダムな画像URLを生成する関数
function getRandomImageUrl() {
  const randomNum = Math.floor(Math.random() * 10);
  return `https://unsplash.it/500/300?random=${randomNum}`;
}

export default function ShopListStaticWithoutSession({ shops }: ShopListStaticWithoutSessionProps) {
  // 各ショップに対してランダムな画像URLを生成
  const shopsWithRandomImage = shops.map(shop => ({
    ...shop,
    imageUrl: getRandomImageUrl(), // ランダムな画像URLを割り当て
  }));

  return (
    <div className="p-4">
      <p className="mb-4 pb-3 text-xl font-medium underline underline-offset-4">
        Shops
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        {shopsWithRandomImage.map(shop => (
          <ShopCard
            key={shop.id}
            id={shop.id}
            imageUrl={shop.imageUrl}
            shopName={shop.name}
            description={shop.description}
            area={shop.area}
            address={shop.address}
            genre={shop.genre}
            link={`/static-shops/${shop.id}?imageUrl=${shop.imageUrl}`}
          />
        ))}
      </div>
    </div>
  );
}