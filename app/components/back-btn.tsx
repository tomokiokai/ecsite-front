'use client'
import { useRouter } from 'next/navigation'  // Correct import statement

export default function BackBtn() {
  const router = useRouter()
  return (
    <button
      className="rounded bg-indigo-600 px-3 py-1 font-medium text-white hover:bg-indigo-700"
      onClick={() => {
        router.back()  // Navigate back
      }}
    >
      Back
    </button>
  )
}