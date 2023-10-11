import Link from 'next/link'
import Image from 'next/image';

export default function NavBar() {
  return (
    <header className="bg-gray-800 p-4 flex items-center fixed top-0 w-full z-10 bg-opacity-50">
      <div className="flex items-center "> 
        <Image width="50" height="50" src="https://img.icons8.com/ios-filled/50/FAB005/logo.png" alt="logo"/>
        <span className="text-white font-bold text-xl pr-6">CocoNomi</span>
      </div>
      
      <nav className="space-x-4 flex items-center ">     
        <Link
          href="/"
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          Home
        </Link>
        <Link
          href="/todo"
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          todo
        </Link>
        <Link
          href="/blogs"
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          blog
        </Link>
        <Link
          href="/auth"
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          Auth
        </Link>
        <Link
          href="/shops"
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          Shop
        </Link>
        <Link
          href="/auth"
          className="rounded bg-gray-700 px-3 py-2 text-white hover:bg-gray-500"
        >
          MyPage
        </Link>
      </nav>
    </header>
  )
}
