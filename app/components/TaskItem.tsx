"use client"
import { FC, memo } from 'react'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import useStore from '../../store'
import { Task } from '../../types'
import { useMutateTask } from '../../hooks/useMutateTask'

const TaskItemMemo: FC<Omit<Task, 'created_at' | 'updated_at'> & { onTaskChange: () => void }> = ({
  id,
  title,
  onTaskChange
}) => {
  const updateTask = useStore((state) => state.updateEditedTask)
  const { deleteTask } = useMutateTask()

  const handleDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      onTaskChange(); // タスクの削除が成功した後に、onTaskChange を呼び出す
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  }

  return (
    <li className="my-3">
      <span className="font-bold">{title}</span>
      <div className="flex float-right ml-20">
        <PencilIcon
          className="h-5 w-5 mx-1 text-blue-500 cursor-pointer"
          onClick={() => {
            updateTask({
              id: id,
              title: title,
            })
          }}
        />
        <TrashIcon
          className="h-5 w-5 text-blue-500 cursor-pointer"
          onClick={() => handleDelete(id)}
        />
      </div>
    </li>
  )
}
export const TaskItem = memo(TaskItemMemo);
