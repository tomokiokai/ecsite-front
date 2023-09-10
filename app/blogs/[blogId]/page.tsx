import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { Blog } from '../../../types';

type PageProps = {
  blog: Blog;
};

async function fetchBlog(blogId: string): Promise<Blog> {
  const response = await axios.get<Blog[]>(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/blogs?id=${blogId}`);
  return response.data[0];
}

const BlogDetailPage = ({ blog }: PageProps) => {
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
      <Link href={`/blogs`}>
        <ArrowUturnLeftIcon className="mt-3 h-6 w-6 cursor-pointer text-blue-500" />
      </Link>
    </div>
  );
};

export async function getStaticProps({ params }: { params: { blogId: string } }) {
  const blog = await fetchBlog(params.blogId);
  return {
    props: {
      blog,
    },
    revalidate: 1, 
  };
}

export async function generateStaticParams() {
  const response = await axios.get<Blog[]>(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/blogs`);
  const blogs = response.data;

  return {
    paths: blogs.map((blog) => ({
      params: {
        blogId: blog.id.toString(),
      },
    })),
    fallback: 'blocking',
  };
}

export default BlogDetailPage;
