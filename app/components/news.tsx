"use client"
import React, { useState, useEffect } from 'react';
import NewsArticle from '../components/NewsArticle';
import { getNewsData } from '../components/NewsFetcher';

type Article = {
  title: string;
  description: string;
  urlToImage: string;
  url: string;
  publishedAt: string;
};


function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function fetchArticles() {
      const data = await getNewsData();
      setArticles(data.slice(0, 6));  // ここで記事を3つに制限
    }

    fetchArticles();
  }, []);

  return (
    <div>
      {articles.map((article) => (
        <NewsArticle key={article.url} article={article} />
      ))}
    </div>
  );
}

export default NewsPage;

