"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Blog } from '../../types';
import { useMutateBlog } from '../../hooks/useMutateBlog';
import axios from 'axios';

type SaveButtonProps = {
  blog: Blog;
  token: string | undefined | null;
  csrfToken: string | undefined | null;
};

export default function SaveButton({ blog, token, csrfToken }: SaveButtonProps) {
  const router = useRouter();
  const { updateBlog } = useMutateBlog();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = token;
    axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
  }, [token, csrfToken]);

  const handleSave = async () => {
    try {
      await updateBlog(blog);
      router.push(`/blogs/${blog.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error updating the blog:", error);
    }
  };

  return (
    <button
      className="rounded bg-indigo-600 py-1 px-4 font-bold text-white hover:bg-indigo-700 focus:outline-none focus:shadow-outline mr-4 mt-3"
      onClick={handleSave}
    >
      Save
    </button>
  );
}

