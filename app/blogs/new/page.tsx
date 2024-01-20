"use client";
import NewBlog from '../../components/new-blog'
import { SessionProvider } from "next-auth/react";

export default function BlogPage() {
  return (
    <SessionProvider>
      <MainComponent />
    </SessionProvider>
  );
}

function MainComponent() {
  return (
    <div className="m-10 w-full mx-auto">
      <div className="text-center">
        <span className="text-lg">
          Create a New Blog 🚀
        </span>
      </div>
      <div className="my-5 flex justify-center">
        <NewBlog/>
      </div>
    </div>
  )
}

