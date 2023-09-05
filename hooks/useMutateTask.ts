"use client"
import axios from 'axios';
import { Task } from '../types';
import useStore from '../store';
import { useError } from './useError';

export const useMutateTask = () => {
  const resetEditedTask = useStore((state) => state.resetEditedTask);
  const { switchErrorHandling } = useError();

  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await axios.post<Task>(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/tasks`, task, {
        // headers: {
        //   'Cache-Control': 'no-store'
        // }
      });
      resetEditedTask();
      return response.data;
    } catch (err) {
      handleError(err);
    }
  };

  const updateTask = async (task: Omit<Task, 'created_at' | 'updated_at'>) => {
    try {
      const response = await axios.put<Task>(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/tasks/${task.id}`, {
        title: task.title,
      }, {
        // headers: {
        //   'Cache-Control': 'no-store'
        // }
      });
      resetEditedTask();
      return response.data;
    } catch (err) {
      handleError(err);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_RESTAPI_URL}/tasks/${id}`, {
        // headers: {
        //   'Cache-Control': 'no-store'
        // }
      });
      resetEditedTask();
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
    createTask,
    updateTask,
    deleteTask,
  };
};

