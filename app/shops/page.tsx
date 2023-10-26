import RouterBtn from '../components/router-btn';
import ShopListStatic from '../components/shop-list-static';  

export default function ShopPage() {
  return (
    <div className="m-10 text-center">
      <span className="text-lg">
        Click on the shop-card to view details 🚀
      </span>
      <div className="mt-5">
        <ShopListStatic />  {/* ShopListStaticコンポーネントをレンダリング */}
      </div>
    </div>
  );
}

