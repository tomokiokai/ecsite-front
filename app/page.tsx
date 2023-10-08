import HeroSection from './components/HeroSection'; 

export default function Home() {
  return (
    <main>
      <HeroSection /> {/* ここでHeroSectionコンポーネントを使用 */}
      <div className="m-10 text-center">Hello World</div>
    </main>
  );
}
