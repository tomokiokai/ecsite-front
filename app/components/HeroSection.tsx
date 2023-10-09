"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import Image from 'next/image';

function getRandomImageUrl() {
  const randomNum = Math.floor(Math.random() * 10);
  return `http://unsplash.it/500/300?random=${randomNum}`;
}

const HeroSection = () => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const swiperRef = useRef<SwiperRef>(null);

  useEffect(() => {
    const urls = Array(6).fill(0).map(() => getRandomImageUrl());
    setImageUrls(urls);
  }, []);

  const handleSlideChange = () => {
    if (swiperRef.current) {
      const swiper = swiperRef.current.swiper;
      const slides = swiper.slides;

      slides.forEach((slide, index) => {
        const slideText = slide.querySelector('.slide-text') as HTMLElement;
        if (slideText) {  // <-- nullチェックを追加
          if (index === swiper.activeIndex) {
            slideText.classList.add('animate-slideUp');
            slideText.style.opacity = '1';
          } else {
            slideText.classList.remove('animate-slideUp');
            slideText.style.opacity = '0';
          }
        }
      });
    }
  };

  return (
    <div id="content" className="content">
      <div className="hero relative overflow-hidden pt-24">
        <Swiper
          ref={swiperRef}
          onSlideChange={handleSlideChange}
          style={{ width: '100%', height: '500px' }}
          modules={[Navigation, Pagination, EffectCoverflow, Autoplay]}
          spaceBetween={50}
          slidesPerView={3}
          centeredSlides={true}
          loop={true}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
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
          speed={1000}
        >
          {imageUrls.map((url, index) => (
            <SwiperSlide key={index} className="h-[500px] overflow-hidden relative">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl z-10 slide-text" style={{ opacity: index === 0 ? '1' : '0' }}>
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



