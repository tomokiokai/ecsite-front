import HeroSection from './components/HeroSection'; 
import HomeCard from './components/HomeCard'; 
import NewsPage from './components/news';
import WeatherCard from './components/WeatherCard';
import SideLinks from './components/SideLinks';
import Footer from './components/Footer';

export default function Home() {
  const cities = ['Fukui','Tokyo', 'Osaka', 'Nagoya']; 
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
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
        <SideLinks />
      </main>
      <Footer />
    </div>
  );
}
