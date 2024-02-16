import Book from "../components/Book";
import { BookType, Purchase } from "../../types";;
import { getAllBooks } from "@/lib/microcms/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"
import { Suspense } from "react";
import Link from 'next/link';

export default async function Home() {
  

  const session = await getServerSession(authOptions);
  const user: any = session?.user;

  const { contents } = await getAllBooks();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_FE_URL}/api/purchases/${user.id}`
  );
  const purchasesData = await response.json();
  const purchasedIds = purchasesData.map(
    (purchase: Purchase) => purchase.bookId
  );
  

  return (
    <>
      <main className="flex flex-wrap justify-center items-center md:mt-20 mt-20">
        <span className="text-lg">
        Book Commerce 🚀
        </span>
        <div className="w-full text-center mb-4">
          <Link
            href="/history"
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
          >
            Purchase History
          </Link>
        </div>
          {contents.map((book: BookType) => (
            <Book
              key={book.id}
              book={book}
              user={user}
              isPurchased={purchasedIds.includes(book.id)}
            />
          ))}
      </main>
    </>
  );
}