'use client'
import { useRouter } from 'next/navigation'; 

type Props = {
  shopId: string;
  token: string | undefined;
};

const ReserveBtn: React.FC<Props> = ({ shopId, token }) => {
  const router = useRouter();

  const handleReserve = () => {
    if (!token) {
      router.push('/auth');
    } else {
      router.push(`/reserve?shopId=${shopId}`);
    }
  };

  return (
    <button
      className="rounded bg-green-600 px-3 py-1 font-medium text-white hover:bg-green-700"
      onClick={handleReserve}
    >
      Reserve
    </button>
  );
};

export default ReserveBtn;
