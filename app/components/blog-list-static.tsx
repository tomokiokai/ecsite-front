import Link from 'next/link';
import axios from 'axios';
import { Blog } from '../../types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function fetchBlogs(): Promise<Blog[]> {
  try {
    const cookieStore = cookies();
    const jwtToken = cookieStore.get('token');  // 'token'という名前のCookieを取得
    const csrfToken = cookieStore.get('_csrf');  // '_csrf'という名前のCookieを取得

    if (!csrfToken) {
      throw new Error("CSRF token is missing");
    }
    const headers = {
      ...jwtToken ? { Authorization: `${jwtToken.value}` } : {},
      'X-CSRF-Token': csrfToken.value  // Cookieから取得したCSRFトークンをヘッダーに設定
    };

    const response = await axios.get<Blog[]>(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/blogs`, {
      withCredentials: true,
      headers: headers
    });
    const blogs = response.data;
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
}

export default async function BlogListStatic() {
  const cookieStore = cookies();
  const jwtToken = cookieStore.get('token');  // 'token'という名前のCookieを取得

  // JWTトークンが存在しない場合、/auth にリダイレクト
  if (!jwtToken) {
    redirect('/auth'); // ここでリダイレクトを実行
    return null; // リダイレクト後、何もレンダリングしない
  }
  const blogs = await fetchBlogs();
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






