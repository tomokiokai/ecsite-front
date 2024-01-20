import Link from 'next/link';
import { getServerSession } from "next-auth";
import { Blog } from '../../types';
import { redirect } from 'next/navigation';
import { authOptions } from "@/lib/auth"

// JWTトークンを使用してブログデータをフェッチする関数
async function fetchBlogs(jwt: string): Promise<Blog[]> {
  console.log('jwt:',jwt)
  try {
    const headers = {
      Authorization: jwt,  // JWTトークンをヘッダーに設定
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/blogs`, {
      method: 'GET',
      headers: headers,
      credentials: 'include',
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

// サーバーコンポーネント
export default async function BlogListStatic() {
  const session = await getServerSession(authOptions);
console.log('session1111:',session)
  // JWTトークンが存在しない場合、/auth にリダイレクト
  if (!session?.jwt) {
    redirect('/auth');
    return null;
  }

  const blogs = await fetchBlogs(typeof session?.jwt === 'string' ? session.jwt : "");
  return (
    <div className="p-4 ">
      <p className="mb-4 pb-3 text-xl font-medium underline underline-offset-4">
        Blogs
      </p>
      <ul>
        {blogs && blogs.map((blog) => (
          <li key={blog.id} className="my-1 text-base">
            <Link prefetch={false} href={`/blogs/${blog.id}`}>
              {blog.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


