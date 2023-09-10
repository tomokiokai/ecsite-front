import { create } from 'zustand'

type EditedTask = {
  id: number;
  title: string;
}

type EditedBlog = {
  id: number;
  title: string;
  content: string;
}

type State = {
  editedTask: EditedTask;
  updateEditedTask: (payload: EditedTask) => void;
  resetEditedTask: () => void;
  editedBlog: EditedBlog; // 新しいプロパティ
  updateEditedBlog: (payload: EditedBlog) => void; // 新しいメソッド
  resetEditedBlog: () => void; // 新しいメソッド
}

const useStore = create<State>((set) => ({
  editedTask: { id: 0, title: '' },
  updateEditedTask: (payload) =>
    set({
      editedTask: payload,
    }),
  resetEditedTask: () => set({ editedTask: { id: 0, title: '' } }),
  editedBlog: { id: 0, title: '', content: '' }, // 新しい初期状態
  updateEditedBlog: (payload) => // 新しいメソッド
    set({
      editedBlog: payload,
    }),
  resetEditedBlog: () => set({ editedBlog: { id: 0, title: '', content: '' } }), // 新しいメソッド
}))

export default useStore

