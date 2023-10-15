import { NextApiRequest, NextApiResponse } from 'next';

const getNews = async (req: NextApiRequest, res: NextApiResponse) => {
    const apiKey = process.env.GNEWS_API_KEY;
    const endpoint = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=ja&country=jp`;

    try {
        const newsResponse = await fetch(endpoint);
        const data = await newsResponse.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch news" });
    }
};

export default getNews;
