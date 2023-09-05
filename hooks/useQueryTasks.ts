import axios, { AxiosError } from 'axios';
import { useCallback } from 'react'; // useCallbackをインポート
import { Task } from '../types';
import { useError } from './useError';

export const useQueryTasks = () => {
  const { switchErrorHandling } = useError();

  const handleAxiosError = useCallback((err: unknown) => {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        if (err.response.data.message) {
          switchErrorHandling(err.response.data.message);
        } else {
          switchErrorHandling(err.response.data);
        }
      } else {
        switchErrorHandling("An unexpected error occurred.");
      }
    } else {
      // err は AxiosError 以外のエラー
      switchErrorHandling("An unexpected error occurred.");
    }
  }, [switchErrorHandling]);

  const getTasks = useCallback(async () => {
    try {
      const { data } = await axios.get<Task[]>(
        `${process.env.NEXT_PUBLIC_RESTAPI_URL}/tasks`,
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      handleAxiosError(err);
      throw err;
    }
  }, [handleAxiosError]); // ここに handleAxiosError を追加

  return getTasks;
};
