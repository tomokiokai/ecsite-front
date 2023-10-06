import ShopCard from '../../components/ShopCard';
import { Shop } from '../../../types';

type Params = {
  params: {
    shopId: string;
  };
};

const fetchShopData = async (shopId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/shops/${shopId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const shop: Shop = await res.json();
  return shop;
};

const fetchFavoriteStatus = async (shopId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/favorites/${shopId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const favoriteData = await res.json();
  return Boolean(favoriteData);
};

export default async function ShopPage({ params }: Params) {
  const shop = await fetchShopData(params.shopId);
  const isFavorite = await fetchFavoriteStatus(params.shopId);
  return (
    <ShopCard {...shop} shopName={shop.name} link={`/shops/${shop.id}`} isFavorite={isFavorite} />
  );
}

export async function generateStaticParams() {
  const resShop = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/shops`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const shops: Shop[] = await resShop.json();

  return shops.map((shop) => ({
    shopId: shop.id.toString(),
  }));
};

  


