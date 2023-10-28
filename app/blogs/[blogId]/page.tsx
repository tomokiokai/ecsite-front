import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import { Blog } from '../../../types';
import { cookies } from 'next/headers';
import DeleteButton from '../../components/DeleteButton';
import EditButton from '../../components/EditButton';

type PageProps = {
  blog: Blog;
  params: {
    blogId: string;
  };
};
type FetchBlogResult = {
  blog: Blog;
  token: string | undefined;
  csrfToken: string;
};

async function fetchBlog(blogId: string): Promise<FetchBlogResult> {
  const cookieStore = cookies();
  const jwtToken = cookieStore.get('token');
  const csrfToken = cookieStore.get('_csrf');

  if (!csrfToken) {
    throw new Error("CSRF token is missing");
  }

  const headers = {
    ...jwtToken ? { Authorization: `${jwtToken.value}` } : {},
    'X-CSRF-Token': csrfToken.value,
    'Content-Type': 'application/json',
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/blogs/${blogId}`, {
    headers: headers,
    next: { revalidate: 0 }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const blog = await res.json();
  return { blog, token: jwtToken?.value, csrfToken: csrfToken.value };
}

export default async function BlogDetailPage({ params }: { params: { blogId: string } }) {
  const { blog, token, csrfToken } = await fetchBlog(params.blogId);
  if (!blog) return notFound();
  return (
    <div className="mt-16 p-8">
      <p>
        <strong className="mr-3">Task ID:</strong> {blog.id}
      </p>
      <p>
        <strong className="mr-3">Title:</strong> {blog.title}
      </p>
      <p>
        <strong className="mr-3">Content:</strong> {blog.content}
      </p>
      <p>
        <strong className="mr-3">Created at:</strong>
        {blog && format(new Date(blog.created_at), 'yyyy-MM-dd HH:mm:ss')}
      </p>
      <p>
        <strong className="mr-3">Updated at:</strong>
        {blog && format(new Date(blog.updated_at), 'yyyy-MM-dd HH:mm:ss')}
      </p>

      <EditButton blogId={blog.id} token={token} csrfToken={csrfToken} />

      <DeleteButton blogId={blog.id} token={token} csrfToken={csrfToken} />
      <Link href={`/blogs`}>
        <ArrowUturnLeftIcon className="mt-3 h-6 w-6 cursor-pointer text-blue-500" />
      </Link>
    </div>
  );
};

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/build/blogs`, {
    headers: {
      'Content-Type': 'application/json',
      'X-BUILD-API-KEY': process.env.BUILD_API_KEY || 'default_value'
    },
  });
  const blogs: Blog[] = await res.json();

  return blogs.map((blog) => ({
    blogId: blog.id.toString() ,
  }));
}

