import RouterBtn from '../components/router-btn';
import ShopListStatic from '../components/shop-list-static';  

export default function ShopPage() {
  return (
    <div className="m-10 text-center">
      <span className="text-lg">
        Click a title on the left to view detail 🚀
      </span>
      <div className="my-5 flex justify-center">
        <RouterBtn />
      </div>
      <div className="mt-5">
        <ShopListStatic />  {/* ShopListStaticコンポーネントをレンダリング */}
      </div>
    </div>
  );
}

