import { create } from 'zustand'
import { persist } from 'zustand/middleware';

type EditedTask = {
  id: number;
  title: string;
};

type EditedBlog = {
  id: number;
  title: string;
  content: string;
};

type User = {
  name: string;
  email: string;
};

interface State {
  editedTask: EditedTask;
  updateEditedTask: (payload: EditedTask) => void;
  resetEditedTask: () => void;
  editedBlog: EditedBlog;
  updateEditedBlog: (payload: EditedBlog) => void;
  resetEditedBlog: () => void;
  csrfToken: string | null;
  setCsrfToken: (token: string) => void;
  jwtToken: string | null;
  setJwtToken: (token: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
}

const useStore = create(persist<State>(
  (set) => ({
    editedTask: { id: 0, title: '' },
    updateEditedTask: (payload) => set({ editedTask: payload }),
    resetEditedTask: () => set({ editedTask: { id: 0, title: '' } }),
    editedBlog: { id: 0, title: '', content: '' },
    updateEditedBlog: (payload) => set({ editedBlog: payload }),
    resetEditedBlog: () => set({ editedBlog: { id: 0, title: '', content: '' } }),
    csrfToken: null,
    setCsrfToken: (token) => set({ csrfToken: token }),
    jwtToken: null,
    setJwtToken: (token) => set({ jwtToken: token }),
    isLoggedIn: false,
    setIsLoggedIn: (status) => set({ isLoggedIn: status }),
    user: null,
    setUser: (user) => set({ user }),
  }),
  {
    name: 'user-store', // ローカルストレージに保存されるキー名
    getStorage: () => localStorage, // 使用するストレージタイプ
  }
));

export default useStore;
