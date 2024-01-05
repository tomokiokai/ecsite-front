import Link from 'next/link';
import { Blog } from '../../types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';



export const getSpecificCookies = (): { token: string | null, csrfToken: string | null } => {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();

  // 特定のクッキーの値を取得
  const token = allCookies.find(cookie => cookie.name === 'token')?.value || null;
  const csrfToken = allCookies.find(cookie => cookie.name === '_csrf')?.value || null;

  return { token, csrfToken };
};

async function fetchBlogs(token: string | null, csrfToken: string | null): Promise<Blog[]> {
  try {
    
    if (!csrfToken) {
      throw new Error("CSRF token is missing");
    }

    const headers = {
      ...token  ? { Authorization: `${token}` } : {},
      'X-CSRF-Token': csrfToken // Cookieから取得したCSRFトークンをヘッダーに設定
    };
    console.log("headers:", headers)
    const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/blogs`, {
      method: 'GET',
      credentials: 'include',
      headers: headers,
      next: { revalidate: 0 }
      // cache: 'force-cache'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data in server');
    }

    const blogs: Blog[] = await response.json();
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogListStatic() {
  const { token, csrfToken } = getSpecificCookies();
  // console.log("JWT Token:", token);
  // console.log("CSRF Token:", csrfToken);

  // JWTトークンが存在しない場合、/auth にリダイレクト
  if (!token) {
    redirect('/auth'); // ここでリダイレクトを実行
    return null; // リダイレクト後、何もレンダリングしない
  }
  const blogs = await fetchBlogs(token, csrfToken);
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
};






