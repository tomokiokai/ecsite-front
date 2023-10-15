import Image from 'next/image';

function getRandomImageUrl() {
  const randomNum = Math.floor(Math.random() * 20);
  return `http://unsplash.it/500/300?random=${randomNum}`;
}

// この関数はサーバーコンポーネントとして動作します
async function getPostData(id: number) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
  const data = await response.json();
  return data;
}

const HomeCard = async ({ id }: { id: number }) => {
  const post = await getPostData(id);

  return (
    <div className="flex flex-col w-full max-w-sm bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="relative w-full h-48">
        <Image src={getRandomImageUrl()} layout="fill" objectFit="cover" alt="Travel" />
      </div>
      <div className="px-6 py-4 space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
        <p className="text-gray-500 text-sm">{post.body}</p>
        <button className="mt-3 px-4 py-2 w-full bg-black text-white hover:bg-gray-800 transition duration-300">もっと詳しく</button>
      </div>
    </div>
  );
}

export default HomeCard;

