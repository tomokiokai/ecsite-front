import React from 'react';
import ShopListClient from './ShopListClient';
import { cookies } from 'next/headers';  // cookies関数をインポート

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

// ランダムな画像URLを生成する関数
function getRandomImageUrl() {
  const randomNum = Math.floor(Math.random() * 10);
  return `http://unsplash.it/500/300?random=${randomNum}`;
}

export default async function ShopListStatic() {
  const cookieStore = cookies();  // Cookieストアを取得
  const jwtToken = cookieStore.get('token')?.value || null;
  const csrfToken = cookieStore.get('_csrf')?.value || null;
  const userInfo = cookieStore.get('userInfo')?.value || null;

  async function fetchShops(): Promise<Shop[]> {
    try {
      

      if (!csrfToken) {
        throw new Error("CSRF token is missing");
      }

      const headers = {
        // ...jwtToken ? { Authorization: `${jwtToken}` } : {},
        // 'X-CSRF-Token': csrfToken  // Cookieから取得したCSRFトークンをヘッダーに設定
        'Content-Type': 'Content-Type',
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/shops`, {
        method: 'GET',
        credentials: 'include',  // credentialsオプションを追加
        headers: headers,  // headersオプションを追加
        next: { revalidate: 0 }
      });

      if (!response.ok) {
        const errorText = await response.text();  // サーバーからのエラーメッセージを取得
        throw new Error(`Failed to fetch data in server: ${errorText}`);
      }

      const shops: Shop[] = await response.json();
      return shops;
    } catch (error) {
      console.error("Error fetching shops:", error);
      return [];
    }
  }

  // お気に入りの情報を取得する新しい関数
  async function fetchFavorites(): Promise<Set<number>> {
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
    const userInfoObj = JSON.parse(userInfo || '{}');
    const userId = userInfoObj.id;

    const userFavorites = favoriteData.filter((fav: FavoriteItem) => fav.user.id === userId);
    const favoriteIds = new Set<number>();
    for (const item of userFavorites) {
      favoriteIds.add(item.shop.id);
    }
    return favoriteIds;
  }

  const shops = await fetchShops();
  const favorites = await fetchFavorites();

  // 各ショップに対してランダムな画像URLを生成
  const shopsWithRandomImage = shops.map(shop => ({
    ...shop,
    imageUrl: getRandomImageUrl(),
  }));

  return (
    <ShopListClient shops={shopsWithRandomImage} initialFavorites={favorites} token={jwtToken} csrfToken={csrfToken} userInfo={userInfo}/>
  );
};

