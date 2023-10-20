'use client'
import { useRouter } from 'next/navigation'; 

type Props = {
  shopId: string; 
};

const ReserveBtn: React.FC<Props> = ({ shopId }) => {
  const router = useRouter();

  // Function to handle the button click
  const handleReserve = () => {
    // Navigate to the reservation page with the shopId as a query parameter
    router.push(`/reserve?shopId=${shopId}`);
  };

  return (
    <button
      className="rounded bg-green-600 px-3 py-1 font-medium text-white hover:bg-green-700"
      onClick={handleReserve}  // Set the click handler
    >
      Reserve
    </button>
  );
};

export default ReserveBtn;
