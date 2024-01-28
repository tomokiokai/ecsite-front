import ShopDetailModal from '../../components/ShopDetailModal';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Shop } from '../../../types';

type SearchParams = {
  imageUrl: string;
};

type Params = {
  params: {
    shopId: string;
  };
  shop: Shop;
  searchParams: SearchParams;
};

// Fetch shop data directly inside the component
const fetchShopData = async (shopId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/shops/${shopId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const shop: Shop = await res.json();
  return shop;
};

export default async function ShopDetailPage({ params, searchParams }: { params: { shopId: string }, searchParams: SearchParams }) {
  const session = await getServerSession(authOptions);
  const token = typeof session?.jwt === 'string' ? session.jwt : "";
  const shop = await fetchShopData(params.shopId);
  const imageUrl = searchParams.imageUrl;
  return (
    <ShopDetailModal
      shop={{ ...shop, imageUrl }}
      token={token || ""}
    />
  );
};

export async function generateStaticParams() {
  // Fetch all shop IDs
  const res = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/shops`,{
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const shops: Shop[] = await res.json();

  return shops.map((shop) => ({
    shopId: shop.id.toString() ,
  }));
};

