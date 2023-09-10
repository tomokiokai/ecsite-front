import axios from 'axios';
import { Blog } from '../types'; // Blog の型定義をインポート
import useStore from '../store';
import { useError } from './useError';

export const useMutateBlog = () => {
  const resetEditedBlog = useStore((state) => state.resetEditedBlog); // ストアから resetEditedBlog を取得
  const { switchErrorHandling } = useError();

  const createBlog = async (blog: Omit<Blog, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await axios.post<Blog>(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/blogs`, blog);
      resetEditedBlog();
      return response.data;
    } catch (err) {
      handleError(err);
    }
  };

  const updateBlog = async (blog: Omit<Blog, 'created_at' | 'updated_at'>) => {
    try {
      const response = await axios.put<Blog>(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/blogs/${blog.id}`, {
        title: blog.title,
        content: blog.content, // content の更新も追加
      });
      resetEditedBlog();
      return response.data;
    } catch (err) {
      handleError(err);
    }
  };

  const deleteBlog = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/blogs/${id}`);
      resetEditedBlog();
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err: any) => {
    if (err.response.data.message) {
      switchErrorHandling(err.response.data.message);
    } else {
      switchErrorHandling(err.response.data);
    }
  };

  return {
    createBlog,
    updateBlog,
    deleteBlog,
  };
};