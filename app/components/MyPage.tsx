import React from 'react';
import MyPageContent from './MyPageContent'; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';

type Shop = {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
  area: string;
  address: string;
  genre: string;
  is_favorite: boolean;
};

type FavoriteItem = {
  id: number;
  shop: {
    id: number;
  };
  user: {
    id: number;
  };
};

interface ReservationItem {
  id: number;
  user?: {
    id: number;
  };
  shop?: {
    id: number;
  };
  user_id?: number;
  shop_id?: number;
}

function getRandomImageUrl() {
  const randomNum = Math.floor(Math.random() * 10);
  return `http://unsplash.it/500/300?random=${randomNum}`;
}

export default async function MyPage() {
  const session = await getServerSession(authOptions); // セッションを取得
  const jwtToken = session?.jwt || null;
  const userInfo = session?.user ? JSON.stringify(session.user) : null;
  const userId = session?.user?.id || null;
  const jwtTokenAsString = jwtToken ? jwtToken.toString() : "";

  const userIdAsString = userId != null ? userId.toString() : "";

  if (!jwtToken) {
    return redirect('/auth'); // ここでリダイレクトを実行
  }

  // ショップ、お気に入り、予約のデータを取得
  const shops = await fetchShops(jwtTokenAsString);
  const favorites = await fetchFavorites(userIdAsString); // ここでの引数は不要になりました
  const reservations = await fetchReservations(jwtTokenAsString);

  // お気に入りと予約に基づいてショップをフィルタリング
  const favoriteShops = shops.filter(shop => favorites.has(shop.id));
  const reservedShopIds = new Set(reservations.map(res => res.shop_id));
  
  
// reservedShopIdsに含まれるIDを持つショップのみをフィルタリング
  const reservedShops = shops.filter(shop => reservedShopIds.has(shop.id));

  const favoriteShopsWithImages = favoriteShops.map(shop => {
  return {
    ...shop,
    imageUrl: getRandomImageUrl(), // ランダムな画像URLを割り当てる
  };
});

// 予約されたショップにランダムな画像を割り当てる
const reservedShopsWithImages = reservedShops.map(shop => {
  return {
    ...shop,
    imageUrl: getRandomImageUrl(),
  };
});

  // MyPageContentコンポーネントにデータを渡し、レンダリングを行います。
  return (
    <MyPageContent 
      favoriteShops={favoriteShopsWithImages}
      reservedShops={reservedShopsWithImages}
      favorites={favorites}
      reservations={reservations}
      jwtToken={jwtTokenAsString}
      userInfo={userInfo}
    />
  );
}

async function fetchShops(jwtToken: string | null) {
  
  const headers: HeadersInit = {};
  if (jwtToken) {
    headers['Authorization'] = jwtToken;
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/shops`, {
    method: 'GET',
    headers: headers,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch shops');
  }

  const shops: Shop[] = await response.json();
  return shops;
}

// お気に入りの情報を取得する新しい関数
async function fetchFavorites(userId: string): Promise<Set<number>> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/build/favorites`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-BUILD-API-KEY': process.env.BUILD_API_KEY || 'default_value'
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch favorites: ${errorText}`);
  }

  const favoriteData = await response.json();
  

  const userFavorites = favoriteData.filter((fav: FavoriteItem) => fav.user.id.toString() === userId);
  const favoriteIds = new Set<number>();
  for (const item of userFavorites) {
    favoriteIds.add(item.shop.id);
  }
  return favoriteIds;
}

async function fetchReservations(jwtToken: string | null) {
  // 予約データを取得
  const headers: HeadersInit = {
    ...jwtToken ? { 'Authorization': jwtToken } : {}, // jwtTokenがnullでない場合にのみAuthorizationヘッダーを追加
  };

  const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/reservations`, {
    method: 'GET',
    headers: headers,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reservations');
  }

  const reservations: ReservationItem[] = await response.json();
  return reservations;
}



