"use client"
import { FormEvent, useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Blog } from '../../types'; 

type NewBlogProps = {
  token: string;
  csrfToken: string;
};

export default function NewBlog({ token, csrfToken }: NewBlogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const blogData = {
        title: title,
        content: content
    };

    try {
        const headers = {
            Authorization: token,
            'X-CSRF-Token': csrfToken
        };

        const response = await axios.post<Blog>(
            `${process.env.NEXT_PUBLIC_RESTAPI_URL}/blogs`,
            blogData,
            { headers: headers }
        );

        if (response.status === 201) {
            router.push('/blogs');
        } else {
            console.error("Error posting the blog:", response.data);
        }
    } catch (error) {
        console.error("Error posting the blog:", error);
    }
};

  useEffect(() => {
    axios.defaults.withCredentials = true;
    // Authorization ヘッダーを設定
    axios.defaults.headers.common['Authorization'] = token;
    console.log("Authorization header:", axios.defaults.headers.common['Authorization']);

    axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;


    // const getCsrfToken = async () => {
    //   const { data } = await axios.get<CsrfToken>(
    //     `${process.env.NEXT_PUBLIC_RESTAPI_URL}/csrf`
    //   );
    //   axios.defaults.headers.common['X-CSRF-Token'] = data.csrf_token;
    //   setCsrfToken(data.csrf_token);
    // };
    // // X-CSRF-Token ヘッダーが設定されていない場合のみ getCsrfToken を実行
    // if (!axios.defaults.headers.common['X-CSRF-Token']) {
    //   getCsrfToken();
    // }
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
