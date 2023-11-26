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
  editedBlog: EditedBlog;
  updateEditedBlog: (payload: EditedBlog) => void;
  resetEditedBlog: () => void;
  csrfToken: string | null;
  setCsrfToken: (token: string) => void;
  jwtToken: string | null; // 新しいプロパティ
  setJwtToken: (token: string) => void; // 新しいメソッド
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
}

const useStore = create<State>((set) => ({
  editedTask: { id: 0, title: '' },
  updateEditedTask: (payload) =>
    set({
      editedTask: payload,
    }),
  resetEditedTask: () => set({ editedTask: { id: 0, title: '' } }),
  editedBlog: { id: 0, title: '', content: '' },
  updateEditedBlog: (payload) =>
    set({
      editedBlog: payload,
    }),
  resetEditedBlog: () => set({ editedBlog: { id: 0, title: '', content: '' } }),
  csrfToken: null,
  setCsrfToken: (token) => set({ csrfToken: token }),
  jwtToken: null, // 新しい初期状態
  setJwtToken: (token) => set({ jwtToken: token }), // 新しいメソッド
  isLoggedIn: false,
  setIsLoggedIn: (status) => set({ isLoggedIn: status }),
}))

export default useStore;
