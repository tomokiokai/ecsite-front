import React from 'react';
import NewsArticle from './NewsArticle';

type Article = {
  title: string;
  description: string;
  urlToImage: string;
  url: string;
  publishedAt: string;
};

// サーバーアクションとして定義
export async function getNewsData() {
  const apiKey = process.env.NEXT_PUBLIC_GNEWS_API_KEY;
  const endpoint = `https://newsapi.org/v2/top-headlines?country=jp&category=business&pageSize=5&apiKey=${apiKey}`;

  try {
    const newsResponse = await fetch(endpoint);
    const data = await newsResponse.json();
    return data.articles;
  } catch (error) {
    console.error("Failed to fetch news", error);
    return [];
  }
}

// サーバーコンポーネント
export default async function NewsPage() {
  const articles = await getNewsData();

  return (
    <div>
      {articles.slice(0, 6).map((article: Article, index: number) => (
        <NewsArticle key={index} article={article} />
      ))}
    </div>
  );
}
