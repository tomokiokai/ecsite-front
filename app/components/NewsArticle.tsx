"use client"
type Article = {
  title: string;
  description: string;
  urlToImage: string;
  url: string;
  publishedAt: string;
};

// Unsplashからビジネス関連の画像を取得する関数
function getBusinessImageUrl() {
  return `https://source.unsplash.com/random/500x300?business`;
}

// 年、月、日の形式で日付を返す関数
function formatDate(dateString: string) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function NewsArticle({ article }: { article: Article }) {
  // 画像のURLが存在しない場合、getBusinessImageUrl()で取得したURLを使用
  const imageUrl = article.urlToImage || getBusinessImageUrl();

  return (
    <div className="max-w-screen-lg mx-auto">
      <div className="flex mt-8 mb-4 p-4 border-b border-gray-200 items-center">
        <img src={imageUrl} alt={article.title} className="w-24 h-24 mr-4 object-cover rounded" />
        
        <div className="flex-1">
          <div className="flex justify-between">
            <h2 className="flex-grow text-xl font-bold">{article.title}</h2>
            <p className="flex-shrink-0 ml-2 text-gray-500">{formatDate(article.publishedAt)}</p>
          </div>
          
          <p className="mt-2 text-gray-600">{article.description}</p>
        </div>
        
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="ml-4 text-blue-500 border border-blue-500 rounded px-4 py-2 hover:bg-blue-500 hover:text-white transition">
          詳細
        </a>
      </div>
    </div>
  );
}

export default NewsArticle;
