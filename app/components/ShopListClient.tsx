"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ShopCard from './ShopCard';
import axios from 'axios';  // axiosをインポート

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

type Props = {
  shops: Shop[];
  initialFavorites: Set<number>;
  token: string | null;  
  csrfToken: string | null;  
  userInfo: string | null;
};

export default function ShopListClient({ shops, initialFavorites, token, csrfToken, userInfo }: Props) {
  const [favorites, setFavorites] = useState(initialFavorites);  // お気に入りの状態を管理するステート
  const router = useRouter();
  const onToggleFavorite = async (shopId: number) => {
    const isFavorite = favorites.has(shopId);  // 現在のお気に入りの状態をチェック
    const newFavorites = new Set(favorites);  // 現在のお気に入りのセットをコピー
    // userInfo を JavaScript オブジェクトに変換
    const userInfoObj = JSON.parse(userInfo || '{}');
    const userId = userInfoObj.id;  // user_id を取得
    console.log(favorites);
    
    if (isFavorite) {
      newFavorites.delete(shopId);  // お気に入りから削除
    } else {
      newFavorites.add(shopId);  // お気に入りに追加
    }
    setFavorites(newFavorites);  // ステートを更新

    // お気に入りの状態をトグルするAPIリクエストを送信
    try {
      await axios({
        url: isFavorite ? `${process.env.NEXT_PUBLIC_RESTAPI_URL}/favorites/${shopId}/${userId}` : `${process.env.NEXT_PUBLIC_RESTAPI_URL}/favorites`,
        method: isFavorite ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ,
          'X-CSRF-Token': csrfToken ,
        },
        data: JSON.stringify({ shop_id: shopId, user_id: userId }),
        withCredentials: true, 
      });

      router.refresh();
    } catch (error) {
      // エラーハンドリング
      console.error('Failed to toggle favorite', error);
    }
  };

  return (
    <div className="p-4">
      <p className="mb-4 pb-3 text-xl font-medium underline underline-offset-4">
        Shops
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        {shops.map(shop => (
          <ShopCard
            id={shop.id}
            imageUrl={shop.imageUrl}
            shopName={shop.name}
            description={shop.description}
            area={shop.area}
            address={shop.address}
            genre={shop.genre}
            isFavorite={favorites.has(shop.id)}  // お気に入りの状態を渡す
            onToggleFavorite={onToggleFavorite}  // お気に入りをトグルする関数を渡す
            link={`/shops/${shop.id}?imageUrl=${shop.imageUrl}`}  // リンクを渡す
            isLoggedIn={!!token}
            key={shop.id}
          />
        ))}
      </div>
    </div>
  );
}

