import PurchaseProduct from "../components/PurchaseProduct";
import { getDetailBook } from "@/lib/microcms/client";
import { BookType, Purchase } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"

export default async function ProfilePage() {
  // const [detailBooks, setDetailBooks] = useState<BookType[]>([]);

  // 以下、カード情報追加のための関数などの追加
  const session = await getServerSession(authOptions);
  const user: any = session?.user;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_FE_URL}/api/purchases/${user.id}`
  );
  const data = await response.json();

  // // 各購入履歴に対してmicroCMSから詳細情報を取得
  const detailBooks = await Promise.all(
    data.map(async (purchase: Purchase) => {
      return await getDetailBook(purchase.bookId);
    })
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">profile</h1>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex items-center">
          <h2 className="text-lg ml-4 font-semibold">Name：{user?.name}</h2>
        </div>
      </div>

      <span className="font-medium text-lg mb-4 mt-4 block">Purchase history</span>
      <div className="flex items-center gap-6">
        {detailBooks.map((detailBook: BookType) => (
          <PurchaseProduct key={detailBook.id} detailBook={detailBook} />
        ))}
      </div>
    </div>
  );
}