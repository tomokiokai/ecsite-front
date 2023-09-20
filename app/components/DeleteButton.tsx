"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMutateBlog } from '../../hooks/useMutateBlog';
import axios from 'axios';

type DeleteButtonProps = {
  blogId: number;
  token: string | undefined;
  csrfToken: string;
};

export default function DeleteButton({ blogId, token, csrfToken }: DeleteButtonProps) {
  const router = useRouter();
  const { deleteBlog } = useMutateBlog();

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = token;
    axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
  }, [token, csrfToken]);

  const handleDelete = async () => {
    try {
      await deleteBlog(blogId);
      router.push('/blogs');
      router.refresh();
    } catch (error) {
      console.error("Error deleting the blog:", error);
    }
  };

  return (
    <button
      className="rounded bg-red-600 py-1 px-4 font-bold text-white hover:bg-red-700 focus:outline-none focus:shadow-outline" 
      onClick={handleDelete}
    >
      Delete
    </button>
  );
}
