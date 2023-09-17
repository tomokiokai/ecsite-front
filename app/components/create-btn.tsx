'use client'
import { useRouter } from 'next/navigation'

export default function CreateBtn() {
  const router = useRouter()
  return (
    <button
      className="rounded bg-indigo-600 py-2 px-4 font-bold text-white hover:bg-indigo-700 focus:outline-none focus:shadow-outline"
      onClick={() => {
        router.push('/blogs/new')
      }}
    >
      Create New Blog
    </button>
  )
}
