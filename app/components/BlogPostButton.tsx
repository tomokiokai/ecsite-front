import Link from 'next/link';

export default function BlogPostButton() {
  return (
    <div className="mt-4">
      <Link href="/blogs/new">
        <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          New Blog Post
        </a>
      </Link>
    </div>
  );
}
