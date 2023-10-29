"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ShopCard from './ShopCard';

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
  date?: string;
  time?: string;
}

type Props = {
  favoriteShops: Shop[];
  reservedShops: Shop[];
  favorites: Set<number>;
  reservations: ReservationItem[];
  jwtToken: string | null;
  csrfToken: string | null;
  userInfo: string | null;
};

const MyPageContent: React.FC<Props> = ({ 
  favoriteShops, 
  reservedShops, 
  favorites: initialFavorites,
  reservations, 
  jwtToken, 
  csrfToken, 
  userInfo 
}) => {
  const [favorites, setFavorites] = useState(new Set<number>(initialFavorites))
  const router = useRouter();
  const userInfoObj = JSON.parse(userInfo || '{}');
  const currentUserId = userInfoObj.id;

function formatDate(dateString: string) {
  // DateオブジェクトをUTCで解析する
  const date = new Date(dateString);
  const year = date.getUTCFullYear(); // UTCの年を取得
  let month = date.getUTCMonth() + 1; // UTCの月を取得（0-11の範囲なので1を加算）
  let day = date.getUTCDate(); // UTCの日を取得

  // 月と日が10未満の場合は、先頭に'0'を付けて2桁にします。
  const monthStr = (month < 10 ? '0' : '') + month.toString();
  const dayStr = (day < 10 ? '0' : '') + day.toString();

  // UTC日付の文字列を返す
  return `${year}-${monthStr}-${dayStr}`;
}


function findReservationsForShop(reservations: ReservationItem[], shopId: number, userId: number) {
  // 特定のショップの予約を見つけ、ログインしているユーザーの予約のみをフィルタリングする
  const shopReservations = reservations.filter(res => res.shop_id === shopId && res.user_id === userId);
  console.log(shopReservations)
  // 予約の日付と時間の配列を返します。この際、日付は指定された形式に変換します。
  return shopReservations.map(res => ({ 
    id: res.id,
    date: res.date ? formatDate(res.date) : '',
    time: res.time
  }));
}

const handleToggleFavorite = async (shopId: number) => {
    const isFavorite = favorites.has(shopId);
    const newFavorites = new Set(favorites);

    if (isFavorite) {
      newFavorites.delete(shopId);
    } else {
      newFavorites.add(shopId);
    }

    setFavorites(newFavorites); // お気に入りの状態を更新

    // APIエンドポイントの設定
    const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}/favorites/${isFavorite ? `${shopId}/${currentUserId}` : ''}`;
    const method = isFavorite ? 'DELETE' : 'POST';

    // リクエストヘッダーの設定
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': jwtToken, // トークンがnullでないことを確認
      'X-CSRF-Token': csrfToken,
    };

    // リクエストデータの設定（お気に入りを追加する場合のみ）
    const data = isFavorite ? null : JSON.stringify({ shop_id: shopId, user_id: currentUserId });

    try {
      // axiosを使用してHTTPリクエストを送信
      await axios({
        method,
        url: apiUrl,
        headers,
        data,
        withCredentials: true, // クッキー情報を含める場合
      });

      // ページのデータをリフレッシュ
      router.refresh(); // router.refresh() ではなく router.reload() を使用
    } catch (error) {
      console.error('Failed to toggle favorite', error);
      // ここでエラーメッセージをユーザーに表示するなど、追加のエラーハンドリングを行うことができます。
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    console.log("Called handleCancelReservation with:", reservationId);
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}/reservations/${reservationId}`;

    // リクエストヘッダーの設定
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': jwtToken, // トークンがnullでないことを確認
    };

    // axiosを使用してHTTP DELETEリクエストを送信
    await axios.delete(apiUrl, { headers });

    // ページのデータをリフレッシュ
    router.refresh();
  } catch (error) {
    console.error('Failed to cancel reservation', error);
    // ここでエラーメッセージをユーザーに表示するなど、追加のエラーハンドリングを行うことができます。
  }
};

  return (
  <div className="mypage-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
    <div className="favorites-section" style={{ flex: 1, marginRight: '5px' }}>
      <h2>Favorite</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'start' }}> {/* gapの値を'10px'から'5px'に変更 */}
        {favoriteShops.map(shop => (
          <ShopCard
            key={shop.id}
            id={shop.id}
            imageUrl={shop.imageUrl}
            shopName={shop.name}
            description={shop.description}
            area={shop.area}
            address={shop.address}
            genre={shop.genre}
            isFavorite={favorites.has(shop.id)}
            onToggleFavorite={() => handleToggleFavorite(shop.id)}
            link={`/shops/${shop.id}?imageUrl=${shop.imageUrl}`}
            isLoggedIn={!!jwtToken}
          />
        ))}
      </div>
    </div>

    {/* ここに縦線を追加します。 */}
    <div style={{ width: '2px', backgroundColor: '#D1D5DB', margin: '0 5px' }}></div>

    <div className="reservations-section" style={{ flex: 1, marginLeft: '10px' }}>
      <h2>Reservation</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'start' }}> {/* gapの値を'10px'から'5px'に変更 */}
        {reservedShops.map(shop => (
          <ShopCard
            key={shop.id}
            id={shop.id}
            imageUrl={shop.imageUrl}
            shopName={shop.name}
            description={shop.description}
            area={shop.area}
            address={shop.address}
            genre={shop.genre}
            reservationInfo={findReservationsForShop(reservations, shop.id, currentUserId)}
            isFavorite={favorites.has(shop.id)}
            link={`/shops/${shop.id}?imageUrl=${shop.imageUrl}`}
            onCancelReservation={(reservationId) => handleCancelReservation(reservationId)}
          />
        ))}
      </div>
    </div>
  </div>
);
}

export default MyPageContent;
