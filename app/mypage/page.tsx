import MyPage from '../components/MyPage'

export default function My() {
  return (
    <div className="m-10 text-center">
      <span className="text-lg">
        Click a title to view detail  🚀
      </span>
      <p className="mb-4 mt-6 pb-3 text-xl font-medium underline underline-offset-4">
        MyPage
      </p>
      <div className="my-5 flex justify-center">
        <MyPage />
      </div>
    </div>
  )
}