"use client"
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Blog } from '../../../../types';
import SaveButton from '../../../components/SaveButton';
import useStore from '../../../../store'; 
import { format } from 'date-fns';

export default function EditBlogPage() {
  const jwtToken = useStore(state => state.jwtToken);
  const csrfToken = useStore(state => state.csrfToken);
  const params = useParams();
  const blogId = params?.blogId;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['Authorization'] = jwtToken;
    axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;

    console.log("Axios default headers:", axios.defaults.headers.common);

    if (blogId) {
      const fetchBlogData = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/blogs/${blogId}`);

          const data: Blog = response.data;
          setBlog(data);
          setTitle(data.title);
          setContent(data.content);
        } catch (error) {
          console.error("Error fetching blog data:", error);
        }
      };

      fetchBlogData();
    }
  }, [blogId]);

  if (!blog) return <div>Loading...</div>;

  return (
  <div className="mt-16 p-8">
    <p className="mb-4">
      <strong className="mr-3">Task ID:</strong>{blog.id}
    </p>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
        Title:
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="title"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
        Content:
      </label>
      <textarea
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>
    <p className="mb-4">
      <strong className="mr-3">Created at:</strong>
      {blog && format(new Date(blog.created_at), 'yyyy-MM-dd HH:mm:ss')}
      </p>
      <p>
        <strong className="mr-3">Updated at:</strong>
        {blog && format(new Date(blog.updated_at), 'yyyy-MM-dd HH:mm:ss')}
      </p>
    <SaveButton blog={{ ...blog, title, content }} token={jwtToken} csrfToken={csrfToken} />
  </div>
);

}





