"use client"
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
  favorites, 
  reservations, 
  jwtToken, 
  csrfToken, 
  userInfo 
}) => {

  const userInfoObj = JSON.parse(userInfo || '{}');
  const currentUserId = userInfoObj.id;

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  let month = date.getMonth() + 1; // getMonth()は0から11までの値を返すため、1を加算します。
  let day = date.getDate();

  // 月と日が10未満の場合は、先頭に'0'を付けて2桁にします。
  const monthStr = (month < 10 ? '0' : '') + month.toString();
  const dayStr = (day < 10 ? '0' : '') + day.toString();

  return `${year}-${monthStr}-${dayStr}`;
}

function findReservationsForShop(reservations: ReservationItem[], shopId: number, userId: number) {
  // 特定のショップの予約を見つけ、ログインしているユーザーの予約のみをフィルタリングする
  const shopReservations = reservations.filter(res => res.shop_id === shopId && res.user_id === userId);
  
  // 予約の日付と時間の配列を返します。この際、日付は指定された形式に変換します。
  return shopReservations.map(res => ({ 
    date: res.date ? formatDate(res.date) : '',
    time: res.time
  }));
}

async function handleToggleFavorite(shopId: number, isFavorite: boolean, jwtToken: string | null, csrfToken: string | null, userInfo: string | null) {
  // お気に入りの追加または削除を行う
  // この関数は、ShopCardコンポーネントからトリガーされ、お気に入りの状態が変更されたときに呼び出されます。

  const method = isFavorite ? 'DELETE' : 'POST'; // isFavoriteは現在のお気に入りの状態を反映する変数です
  const url = isFavorite ? 
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/favorites/${shopId}` : 
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}/favorites`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    // jwtToken または csrfToken が null の場合、ヘッダーに追加しない
    ...(jwtToken ? { 'Authorization': jwtToken } : {}),
    ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
  };

  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify({ shopId, userId: userInfoObj.id }), // userInfoからユーザーIDを取得します
  });

  if (!response.ok) {
    throw new Error('Failed to toggle favorite');
  }

}

  return (
  <div className="mypage-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
    <div className="favorites-section" style={{ flex: 1, marginRight: '10px' }}>
      <h2>Favorite</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'start' }}> {/* gapの値を'10px'から'5px'に変更 */}
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
            onToggleFavorite={() => handleToggleFavorite(shop.id, favorites.has(shop.id), jwtToken, csrfToken, userInfo)}
            link={`/shops/${shop.id}`}
            isLoggedIn={!!jwtToken}
          />
        ))}
      </div>
    </div>

    {/* ここに縦線を追加します。 */}
    <div style={{ width: '2px', backgroundColor: '#D1D5DB', margin: '0 10px' }}></div>

    <div className="reservations-section" style={{ flex: 1, marginLeft: '10px' }}>
      <h2>Reservation</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'start' }}> {/* gapの値を'10px'から'5px'に変更 */}
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
            link={`/shops/${shop.id}`}
          />
        ))}
      </div>
    </div>
  </div>
);
}

export default MyPageContent;
