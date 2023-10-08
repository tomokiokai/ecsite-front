"use client"
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import Image from 'next/image';

// ランダムな画像URLを生成する関数
function getRandomImageUrl() {
  const randomNum = Math.floor(Math.random() * 10);
  return `http://unsplash.it/500/300?random=${randomNum}`;
}

const HeroSection = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  useEffect(() => {
    const urls = Array(6).fill(0).map(() => getRandomImageUrl()); // 4つのランダムなURLを生成
    setImageUrls(urls); // ステートを更新
  }, []);

  return (
    <div id="content" className="content">
      <div className="hero relative overflow-hidden pt-24">
        <Swiper
          style={{ width: '100%', height: '500px' }}
            modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
            spaceBetween={50}
            slidesPerView={3}
            centeredSlides={true}
            loop={true}
            navigation={{
              nextEl: '.swiper-button-next', // 次のスライドへのボタンのクラス名
              prevEl: '.swiper-button-prev', // 前のスライドへのボタンのクラス名
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            effect="coverflow"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            className="swiper"
        >
          {imageUrls.map((url, index) => (
            <SwiperSlide key={index} className="h-[500px] overflow-hidden relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl z-10">
                Slide {index + 1}
              </div>
              <Image src={url} alt={`Slide ${index + 1}`} layout="fill" objectFit="cover" />
            </SwiperSlide>
          ))}
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </Swiper>
      </div>
    </div>
  );
}

export default HeroSection;


