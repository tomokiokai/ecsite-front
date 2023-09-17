import NewBlog from '../../components/new-blog'

export default function BlogPage() {
  return (
    <div className="m-10 text-center w-full mx-auto">
      <span className="text-lg">
        Create a New Blog 🚀
      </span>
      <div className="my-5 flex justify-center">
        <NewBlog />
      </div>
    </div>
  )
}
