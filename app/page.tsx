import HeroSection from './components/HeroSection'; 
import HomeCard from './components/HomeCard'; 
import NewsPage from './components/news';
import WeatherCard from './components/WeatherCard';

export default function Home() {
  const cities = ['Fukui','Tokyo', 'Osaka', 'Nagoya']; 
  return (
    <main>
      <HeroSection />
      <div className="flex justify-center space-x-6 mt-20">
      {Array(3).fill(null).map((_, index) => (
        <HomeCard key={index} id={index + 1} />
      ))}
      </div>
      <NewsPage />
      <div className="flex justify-center space-x-6 mt-20">
        {cities.map(city => (
          <WeatherCard key={city} city={city} />
        ))}
      </div>
    </main>
  );
}
