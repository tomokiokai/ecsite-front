import '../globals.css';
import BlogListStatic from '../components/blog-list-static'
import CreateBtn from '../components/create-btn'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
  }) {
  return (
    <section className="flex">
      <aside className={`h-[calc(100vh-56px)] w-1/4 bg-gray-200 p-2`}>
        {/*@ts-ignore*/}
        <BlogListStatic />
        <div className="flex justify-center">
          <CreateBtn />
        </div>
      </aside>
      <main className="flex flex-1 justify-center">{children}</main>
    </section>
  )
}
