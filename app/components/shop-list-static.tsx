import Link from 'next/link';
import ShopCard from './ShopCard';
import { cookies } from 'next/headers';  // cookies関数をインポート

type Shop = {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
  area: string;
  address: string;
  genre: string;
};

// ランダムな画像URLを生成する関数
function getRandomImageUrl() {
  const randomNum = Math.floor(Math.random() * 10);
  return `http://unsplash.it/500/300?random=${randomNum}`;
}

export default async function ShopListStatic() {
  async function fetchShops(): Promise<Shop[]> {
    try {
      const cookieStore = cookies();  // Cookieストアを取得
      const jwtToken = cookieStore.get('token');  // 'token'という名前のCookieを取得
      const csrfToken = cookieStore.get('_csrf');  // '_csrf'という名前のCookieを取得

      if (!csrfToken) {
        throw new Error("CSRF token is missing");
      }

      const headers = {
        ...jwtToken ? { Authorization: `${jwtToken.value}` } : {},
        'X-CSRF-Token': csrfToken.value  // Cookieから取得したCSRFトークンをヘッダーに設定
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/shops`, {
        method: 'GET',
        credentials: 'include',  // credentialsオプションを追加
        // headers: headers,  // headersオプションを追加
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

  const shops = await fetchShops();

  // 各ショップに対してランダムな画像URLを生成
  const shopsWithRandomImage = shops.map(shop => ({
    ...shop,
    imageUrl: getRandomImageUrl(),
  }));

  return (
    <div className="p-4">
      <p className="mb-4 pb-3 text-xl font-medium underline underline-offset-4">
        Shops
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        {shopsWithRandomImage && shopsWithRandomImage.map((shop) => (
          <Link prefetch={false} href={`/shops/${shop.id}?imageUrl=${shop.imageUrl}`} key={shop.id}>  
            <ShopCard
              id={shop.id}
              imageUrl={shop.imageUrl}
              shopName={shop.name}
              description={shop.description}
              area={shop.area}
              address={shop.address}
              genre={shop.genre}
            />
        </Link>
        ))}
      </div>
    </div>
  );
};

