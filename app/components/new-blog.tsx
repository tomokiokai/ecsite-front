"use client"
import { FormEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useMutateBlog } from '../../hooks/useMutateBlog';

type NewBlogProps = {
  token: string;
  csrfToken: string;
};

export default function NewBlog({ token, csrfToken }: NewBlogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const { createBlog } = useMutateBlog();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const blogData = {
        title: title,
        content: content
    };

    try {
        const createdBlog = await createBlog(blogData); // createBlogメソッドを使用してブログを作成

        if (createdBlog) {
          router.push('/blogs');
          router.refresh();
        } else {
            console.error("Error posting the blog:", createdBlog);
        }
    } catch (error) {
        console.error("Error posting the blog:", error);
    }
  };

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = token;
    axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
  }, []);

  return (
    <div className="p-8 bg-gray-100 w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full ">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 ml-2" htmlFor="title">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            placeholder="Enter title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2 ml-2" htmlFor="content">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            id="content"
            placeholder="Enter content"
          ></textarea>
        </div>
        <div className="flex justify-center">
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
