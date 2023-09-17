import NewBlog from '../../components/new-blog'
import { cookies } from 'next/headers';

export default function BlogPage() {
  const cookieStore = cookies();
  const jwtToken = cookieStore.get('token');  // 'token'という名前のCookieを取得
  const csrfToken = cookieStore.get('_csrf');  // '_csrf'という名前のCookieを取得

  return (
    <div className="m-10 w-full mx-auto">
      <div className="text-center">
        <span className="text-lg">
          Create a New Blog 🚀
        </span>
      </div>
      <div className="my-5 flex justify-center">
        <NewBlog token={jwtToken?.value || ""} csrfToken={csrfToken?.value || ""} />
      </div>
    </div>
  )
}

