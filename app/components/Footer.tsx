import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-black p-4 mt-10">
      <div className="container mx-auto flex flex-col justify-center">
        <div className="flex flex-col justify-between items-center mb-6">
          <div className="flex flex-col items-center mb-4">
            <Image width="60" height="30" src="https://img.icons8.com/ios-filled/50/FAB005/logo.png" alt="logo" />
            <span className="text-white font-bold text-xl mt-2">CocoNomi</span>
          </div>
          <nav className="flex justify-center items-center w-full space-x-6">
            <Link href="/">
              <span className="cursor-pointer text-gray-400 hover:text-white text-xl">Home</span>
            </Link>
            <Link href="/todo">
              <span className="cursor-pointer text-gray-400 hover:text-white text-xl">todo</span>
            </Link>
            <Link href="/blogs">
              <span className="cursor-pointer text-gray-400 hover:text-white text-xl">blog</span>
            </Link>
            <Link href="/auth">
              <span className="cursor-pointer text-gray-400 hover:text-white text-xl">Auth</span>
            </Link>
            <Link href="/shops">
              <span className="cursor-pointer text-gray-400 hover:text-white text-xl">Shop</span>
            </Link>
            <Link href="/auth">
              <span className="cursor-pointer text-gray-400 hover:text-white text-xl">MyPage</span>
            </Link>
          </nav>
        </div>
        <div className="text-center text-gray-400">
          COPYRIGHT © CocoNomi Inc. All rights Reserved.
        </div>
      </div>
    </footer>
  );
}

