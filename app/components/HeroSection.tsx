"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide, SwiperRef } from 'swiper/react';
import { Navigation, Pagination, EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import Image from 'next/image';

interface HeroSectionProps {
  imageUrls: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ imageUrls }) => {
  const swiperRef = useRef<SwiperRef>(null);
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
              <div className="absolute inset-0 flex items-center justify-center z-10 slide-text animate-slideUp" style={{ opacity: index === 0 ? '1' : '0' }}>
                <span className="text-white text-xl">Slide {index + 1}</span>
              </div>
              <Image src={url} alt={`Slide ${index + 1}`} layout="fill" objectFit="cover" />
            </SwiperSlide>
          ))}
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </Swiper>
        
      </div>
      <div className="flex justify-center items-center mt-6">
        <Image
          src="/arrow.svg"
          alt="Arrow"
          width={5}
          height={50}
          className="hero__downarrow animate-zoomInOut"
        />
        <span
          className="transform rotate-90 text-black text-opacity-70 text-xl">scroll
        </span>
      </div>
    </div>
  );
}

export default HeroSection;



