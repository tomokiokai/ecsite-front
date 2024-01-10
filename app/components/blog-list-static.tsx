import Link from 'next/link';
import { Blog } from '../../types';
// import { cookies,headers  } from 'next/headers';
import { getSpecificCookies } from "@/utils/getCookie";
import { redirect } from 'next/navigation';

const fetchCookies = async () => {
      try {
        // バックエンドのAPIエンドポイントにリクエストを送信
        const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/cookies`,{
    method: 'GET',
    cache: "no-store",
  });
        
        if (!response.ok) {
          throw new Error('Failed to fetch cookies');
        }

        // レスポンスからクッキー情報を取得
        const cookiesData = await response.json();
        console.log('Cookies:', cookiesData);
      } catch (error) {
        console.error('Error fetching cookies:', error);
      }
    };

    fetchCookies();
  

// export const getSpecificCookies = (): { token: string | null, csrfToken: string | null } => {
//   const requestHeaders = headers();
//   console.log("requestHeaders:", requestHeaders);
//   const cookieStore = cookies();
//   const allCookies = cookieStore.getAll();
//   console.log("allCookies:", allCookies);
//   // 特定のクッキーの値を取得
//   const token = allCookies.find(cookie => cookie.name === 'token')?.value || null;
//   const csrfToken = allCookies.find(cookie => cookie.name === '_csrf')?.value || null;

//   return { token, csrfToken };
// };

const fetchBlogs= async (): Promise<Blog[]> => {
  try {
    const { token, csrfToken } = getSpecificCookies();
  console.log("JWT Token:", token);
    console.log("CSRF Token:", csrfToken);
    const options: RequestInit = {
      headers: {
      ...token  ? { Authorization: `${token}` } : {},
      ...csrfToken ? { 'X-CSRF-Token': csrfToken } : {}
    },
    cache: "no-store",
  };
    
    if (!csrfToken) {
      throw new Error("CSRF token is missing");
    }

    // const headers = {
    //   ...token  ? { Authorization: `${token}` } : {},
    //   'X-CSRF-Token': csrfToken // Cookieから取得したCSRFトークンをヘッダーに設定
    // };
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/blogs`, options,);

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
  

  // JWTトークンが存在しない場合、/auth にリダイレクト
  // if (!token) {
  //   redirect('/auth'); // ここでリダイレクトを実行
  //   return null; // リダイレクト後、何もレンダリングしない
  // }
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






