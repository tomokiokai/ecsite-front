'use client'
import { useRouter } from 'next/navigation'  // Correct import statement

export default function BackBtn() {
  const router = useRouter()
  return (
    <button
      className="rounded bg-blue-500 px-3 py-1 font-medium text-white hover:bg-blue-700"
      onClick={() => {
        router.back()  // Navigate back
      }}
    >
      Back
    </button>
  )
}