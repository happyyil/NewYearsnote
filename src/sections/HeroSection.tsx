import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const lanternLeftRef = useRef<HTMLDivElement>(null);
  const lanternRightRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // 检测是否为移动设备
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 标题墨渍揭示效果
      gsap.fromTo(
        titleRef.current,
        { 
          clipPath: 'circle(0% at 50% 50%)',
          opacity: 0 
        },
        {
          clipPath: 'circle(100% at 50% 50%)',
          opacity: 1,
          duration: 1.8,
          delay: 0.2,
          ease: 'power3.out',
        }
      );

      // 副标题淡入滑动
      gsap.fromTo(
        subtitleRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.8,
          ease: 'power2.out',
        }
      );

      // 灯笼摆入
      gsap.fromTo(
        [lanternLeftRef.current, lanternRightRef.current],
        { rotation: -15, opacity: 0, scale: 0.8 },
        {
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          delay: 1,
          ease: 'elastic.out(1, 0.5)',
          stagger: 0.2,
        }
      );

      // 按钮淡入
      gsap.fromTo(
        buttonRef.current,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 1.2,
          ease: 'power2.out',
        }
      );

      // 滚动视差效果
      const triggers: ScrollTrigger[] = [];
      
      triggers.push(
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            if (titleRef.current) {
              gsap.set(titleRef.current, { y: self.progress * -200 });
            }
            if (lanternLeftRef.current && lanternRightRef.current) {
              gsap.set([lanternLeftRef.current, lanternRightRef.current], { 
                y: self.progress * -50 
              });
            }
          },
        })
      );

      return () => {
        triggers.forEach(t => t.kill());
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 鼠标移动3D倾斜效果（仅桌面端）
  useEffect(() => {
    if (isMobile) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  const scrollToGallery = () => {
    const gallery = document.getElementById('blessing-gallery');
    if (gallery) {
      const offset = -100;
      const elementPosition = gallery.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        perspective: isMobile ? 'none' : '1000px',
      }}
    >
      {/* 背景渐变层 */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f5f0] via-[#faf8f3] to-[#f5f5f0]" />

      {/* 装饰云纹 */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 100 Q60 60 100 60 Q140 60 160 100 Q180 140 140 140 Q100 140 80 120 Q60 100 40 100' fill='none' stroke='%23daa520' stroke-width='0.8' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: '300px 300px',
        }}
      />

      {/* 左侧灯笼 - 桌面端显示 */}
      {!isMobile && (
        <div
          ref={lanternLeftRef}
          className="absolute left-[8%] top-[15%] lantern-sway hidden md:block"
          style={{
            transform: `rotateY(${mousePos.x * 5}deg) rotateX(${-mousePos.y * 5}deg)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <div className="relative">
            {/* 灯笼线 */}
            <div className="absolute -top-16 left-1/2 w-px h-16 bg-[#8b7355] opacity-50" />
            {/* 灯笼主体 */}
            <div className="w-16 h-20 bg-gradient-to-b from-[#e63946] to-[#c1121f] rounded-full shadow-lg relative">
              {/* 灯笼顶部 */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-[#8b4513] rounded-sm" />
              {/* 灯笼底部 */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-[#8b4513] rounded-sm" />
              {/* 灯笼穗 */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-8 bg-gradient-to-b from-[#e63946] to-transparent"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              {/* 福字 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#ffd700] text-2xl font-calligraphy">福</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 右侧灯笼 - 桌面端显示 */}
      {!isMobile && (
        <div
          ref={lanternRightRef}
          className="absolute right-[8%] top-[20%] lantern-sway hidden md:block"
          style={{ animationDelay: '0.5s' }}
        >
          <div className="relative">
            <div className="absolute -top-16 left-1/2 w-px h-16 bg-[#8b7355] opacity-50" />
            <div className="w-14 h-[72px] bg-gradient-to-b from-[#e63946] to-[#c1121f] rounded-full shadow-lg relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-[#8b4513] rounded-sm" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-3 bg-[#8b4513] rounded-sm" />
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-8 bg-gradient-to-b from-[#e63946] to-transparent"
                    style={{ animationDelay: `${i * 0.1 + 0.5}s` }}
                  />
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#ffd700] text-xl font-calligraphy">春</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 主标题区域 */}
      <div 
        className="relative z-10 text-center px-4"
        style={{
          transform: isMobile ? 'none' : 'translateZ(50px)',
        }}
      >
        {/* 印章装饰 */}
        <div className="mb-6 flex justify-center">
          <div className="w-12 h-12 border-2 border-[#e63946] rounded-sm flex items-center justify-center bg-[#f5f5f0]">
            <span className="text-[#e63946] text-lg font-calligraphy vertical-text">丙午</span>
          </div>
        </div>

        {/* 主标题 */}
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-calligraphy text-[#1a1a1a] mb-6 tracking-wider"
          style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          新岁笺
        </h1>

        {/* 分隔线 */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-12 md:w-16 h-px bg-gradient-to-r from-transparent to-[#daa520]" />
          <div className="w-2 h-2 bg-[#daa520] rotate-45" />
          <div className="w-12 md:w-16 h-px bg-gradient-to-l from-transparent to-[#daa520]" />
        </div>

        {/* 副标题 */}
        <p
          ref={subtitleRef}
          className="text-base sm:text-lg md:text-xl font-body text-[#4a4a4a] tracking-widest mb-10 md:mb-12"
        >
          愿岁岁常欢愉，年年皆胜意
        </p>

        {/* 行动按钮 */}
        <button
          ref={buttonRef}
          onClick={scrollToGallery}
          className="group relative px-6 md:px-8 py-3 border border-[#c1121f] text-[#c1121f] font-body tracking-wider
                     transition-all duration-500 hover:text-[#1a1a1a] overflow-hidden btn-gold-fill"
        >
          <span className="relative z-10">开启福运</span>
        </button>
      </div>

      {/* 底部梅花装饰 */}
      <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 opacity-30">
        <svg width="100" height="50" viewBox="0 0 120 60" fill="none" className="md:w-[120px] md:h-[60px]">
          <path
            d="M60 60 Q60 30 30 30 Q10 30 10 10"
            stroke="#c1121f"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M60 60 Q60 30 90 30 Q110 30 110 10"
            stroke="#c1121f"
            strokeWidth="1"
            fill="none"
          />
          <circle cx="10" cy="10" r="3" fill="#e63946" />
          <circle cx="110" cy="10" r="3" fill="#e63946" />
          <circle cx="30" cy="25" r="2" fill="#e63946" />
          <circle cx="90" cy="25" r="2" fill="#e63946" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
