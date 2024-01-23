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
