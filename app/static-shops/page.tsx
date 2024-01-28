import RouterBtn from '../components/router-btn';
import ShopListStaticWithoutSession from '../components/ShopListStaticWithoutSession';  

// ショップデータをフェッチする関数
async function fetchShops() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/shops`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'force-cache'
    });
    const shops = await response.json();
    return shops;
  } catch (error) {
    console.error("Error fetching shops:", error);
    return [];
  }
}

export default async  function ShopPage() {
  const shops = await fetchShops();
  return (
    <div className="m-10 text-center">
      <span className="text-lg">
        Click on the shop-card to view details 🚀
      </span>
      <div className="mt-5">
        <ShopListStaticWithoutSession  shops={shops} /> 
      </div>
    </div>
  );
}

