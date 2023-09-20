"use client"
import { useRouter } from 'next/navigation';
import useStore from '../../store'; 

type EditButtonProps = {
  blogId: number;
  token: string | null | undefined;
  csrfToken: string;
};

export default function EditButton({ blogId, token, csrfToken }: EditButtonProps) {
  const router = useRouter();
  const setJwtToken = useStore(state => state.setJwtToken);
  const setCsrfToken = useStore(state => state.setCsrfToken);

  const handleEdit = () => {
    // tokenとcsrfTokenをzustandのストアに保存
    setJwtToken(token as string);
    setCsrfToken(csrfToken);

    router.push(`/blogs/edit/${blogId}`);
  };

  return (
    <button
      className="rounded bg-indigo-600 py-1 px-4 font-bold text-white hover:bg-indigo-700 focus:outline-none focus:shadow-outline mr-4 mt-3" 
      onClick={handleEdit}
    >
      Edit
    </button>
  );
}

