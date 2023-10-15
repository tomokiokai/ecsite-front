import Image from 'next/image';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY; 

const cityNamesInJapanese: Record<string, string> = {
  Fukui: '福井',
  Tokyo: '東京',
  Osaka: '大阪',
  Nagoya: '名古屋'
};

async function getWeatherData(city: string) {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=ja&units=metric`);
  const data = await response.json();
  return data;
}

const WeatherCard = async ({ city }: { city: string }) => {
  const weather = await getWeatherData(city);
  const cityNameInJapanese = cityNamesInJapanese[city] || city; // マッピングにない都市名はそのまま表示

  return (
    <div className="flex flex-col w-full max-w-sm bg-white shadow-xl rounded-lg overflow-hidden">
      <div className="relative w-full h-48">
        <Image src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} width={100} height={100} alt={weather.weather[0].description} />
      </div>
      <div className="px-6 py-4 space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">{cityNameInJapanese}</h1>
        <p className="text-lg text-gray-600">{weather.weather[0].description}</p>
        <p className="text-gray-500 text-sm">気温: {weather.main.temp}°C</p>
      </div>
    </div>
  );
}

export default WeatherCard;
