import React from 'react';
import ShopListClient from './ShopListClient';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"
import { Session } from "next-auth";

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

type ShopListStaticProps = {
  shops: Shop[];
};

// ランダムな画像URLを生成する関数
function getRandomImageUrl() {
  const randomNum = Math.floor(Math.random() * 10);
  return `http://unsplash.it/500/300?random=${randomNum}`;
}

export default async function ShopListStatic({ shops }: ShopListStaticProps) {
  const session = await getServerSession(authOptions);
  

  // お気に入りの情報を取得する新しい関数
  async function fetchFavorites(session: Session | null): Promise<Set<number>> {
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
    const userId = session?.user.id || null;  // セッションからユーザーIDを取得
    const userFavorites = favoriteData.filter((fav: FavoriteItem) => fav.user.id === userId);
    const favoriteIds = new Set<number>();
    for (const item of userFavorites) {
      favoriteIds.add(item.shop.id);
    }
    return favoriteIds;
  }


  const favorites = await fetchFavorites(session);

  // 各ショップに対してランダムな画像URLを生成
  const shopsWithRandomImage = shops.map(shop => ({
    ...shop,
    imageUrl: getRandomImageUrl(),
  }));

  // セッション情報から必要なデータを取り出し
  const jwtToken = session?.jwt || null;
  const userInfo = session?.user || null;

  // jwtToken が string 型かどうかを確認
  const tokenForClient = typeof jwtToken === 'string' ? jwtToken : null;

  // userInfo が null でないことを確認し、必要に応じて処理を行う
  const userInfoForClient = userInfo ? {
  name: userInfo.name || '',
  email: userInfo.email || '', 
  id: typeof userInfo.id === 'number' ? userInfo.id : 0,
} : null;


  return (
    <ShopListClient
      shops={shopsWithRandomImage}
      initialFavorites={favorites}
      token={tokenForClient}
      userInfo={userInfoForClient}
    />
  );
};

