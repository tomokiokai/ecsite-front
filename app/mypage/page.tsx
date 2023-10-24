import MyPage from '../components/MyPage'

export default function My() {
  return (
    <div className="m-10 text-center">
      <span className="text-lg">
        Click a title on the left to view detail 🚀
      </span>
      <div className="my-5 flex justify-center">
        <MyPage />
      </div>
    </div>
  )
}