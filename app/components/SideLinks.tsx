"use client"
import { useState, useEffect } from 'react';

export default function SideLinks() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <aside className={`fixed top-1/2 transform -translate-y-1/2 transition-all duration-300 ${isVisible ? 'left-12' : '-left-12'} md:block`}>
      <div className="flex flex-col items-center space-y-4">
        <a href="https://twitter.com/" className="icon twitter writing-mode-vertical-rl">
          <span>Twitter</span>
        </a>
        <a href="https://www.facebook.com/" className="icon fb writing-mode-vertical-rl">
          <span>Facebook</span>
        </a>
      </div>
    </aside>
  );
}