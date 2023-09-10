"use client"
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function NewBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/blogs`, {
        title,
        content,
      });
      router.push('/blogs');
    } catch (error) {
      console.error("Error posting the blog:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
