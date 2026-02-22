import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from './sections/HeroSection';
import BlessingGallery from './sections/BlessingGallery';
import FortuneDraw from './sections/FortuneDraw';
import ShareSection from './sections/ShareSection';
import { SpeedInsights } from "@vercel/speed-insights/next"
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 初始化平滑滚动效果
    const ctx = gsap.context(() => {
      // 为所有 section 添加淡入效果
      gsap.utils.toArray<HTMLElement>('.section-fade').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              end: 'top 20%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen rice-paper-bg cloud-pattern cloud-drift">
      {/* 全局装饰元素 - 淡金星屑 */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#daa520] rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `gold-sparkle ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* 主内容 */}
      <main className="relative z-10">
        <HeroSection />
        <BlessingGallery />
        <FortuneDraw />
        <ShareSection />
      </main>

      {/* 页脚 */}
      <footer className="py-8 text-center text-[#8b7355] text-sm font-body">
        <p className="opacity-60">新岁笺 · 愿君岁岁常欢愉</p>
      </footer>
    </div>
  );
}

export default App;
