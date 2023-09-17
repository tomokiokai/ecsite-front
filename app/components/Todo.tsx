"use client"
import { FormEvent, useState, useEffect } from 'react';
import {
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/solid';
import useStore from '../../store';
import { useQueryTasks } from '../../hooks/useQueryTasks';
import { useMutateAuth } from '../../hooks/useMutateAuth';
import { useMutateTask } from '../../hooks/useMutateTask';
import { TaskItem } from './TaskItem';
import { Task } from '../../types';
import axios from 'axios';

export const Todo = ({ csrfToken }: { csrfToken: string }) => {
  const setCsrfToken = useStore((state) => state.setCsrfToken); // ZustandからsetCsrfTokenを取得
  
  const { editedTask } = useStore();
  const updateTask = useStore((state) => state.updateEditedTask);
  const getTasks = useQueryTasks();
  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [taskChanged, setTaskChanged] = useState(false);
  const { createTask, updateTask: updateExistingTask } = useMutateTask();
  const { logout } = useMutateAuth();

  useEffect(() => {
    console.log("CSRF Token:", csrfToken);

    // CSRFトークンが存在しない場合、新しいトークンを取得
    if (!csrfToken) {
      axios.defaults.withCredentials = true;
      const getCsrfToken = async () => {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_RESTAPI_URL}/csrf`
        );
        axios.defaults.headers.common['X-CSRF-Token'] = data.csrf_token;
        setCsrfToken(data.csrf_token); // ZustandのストアにCSRFトークンを保存
      };
      getCsrfToken();
    } else {
      axios.defaults.headers.common['X-CSRF-Token'] = csrfToken;
    }

    (async () => {
      setIsLoading(true);
      try {
        const tasks = await getTasks();
        setData(tasks);
      } catch (error) {
        // エラーハンドリング
      } finally {
        setIsLoading(false);
      }
    })();
  }, [taskChanged, csrfToken]);

  const submitTaskHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editedTask.id === 0) {
      await createTask({ title: editedTask.title });
    } else {
      await updateExistingTask(editedTask);
    }
    setTaskChanged(!taskChanged);
  };


  return (
    <div className="flex justify-center items-center flex-col min-h-screen text-gray-600 font-mono">
      <div className="flex items-center my-3">
        <ShieldCheckIcon className="h-8 w-8 mr-3 text-indigo-500 cursor-pointer" />
        <span className="text-center text-3xl font-extrabold">
          Task Manager
        </span>
      </div>
      <ArrowRightOnRectangleIcon
        onClick={logout}
        className="h-6 w-6 my-6 text-blue-500 cursor-pointer"
      />
      <form onSubmit={submitTaskHandler}>
        <input
          className="mb-3 mr-3 px-3 py-2 border border-gray-300"
          placeholder="title ?"
          type="text"
          onChange={(e) => updateTask({ ...editedTask, title: e.target.value })}
          value={editedTask.title || ''}
        />
        <button
          className="disabled:opacity-40 mx-3 py-2 px-3 text-white bg-indigo-600 rounded"
          disabled={!editedTask.title}
        >
          {editedTask.id === 0 ? 'Create' : 'Update'}
        </button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul className="my-5">
        {data.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title} onTaskChange={() => setTaskChanged(!taskChanged)} />
        ))}
      </ul>
      )}
    </div>
  );
};
