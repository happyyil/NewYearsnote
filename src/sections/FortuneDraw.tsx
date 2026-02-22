import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, RotateCcw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Fortune {
  id: number;
  level: string;
  title: string;
  content: string;
  poem: string;
}

const fortunes: Fortune[] = [
  {
    id: 1,
    level: '上上签',
    title: '鸿运当头',
    content: '时来天地皆同力，运到英雄不自由。',
    poem: '春风得意马蹄疾，一日看尽长安花。',
  },
  {
    id: 2,
    level: '上签',
    title: '吉星高照',
    content: '福星高照喜盈门，紫气东来满华堂。',
    poem: '海内存知己，天涯若比邻。',
  },
  {
    id: 3,
    level: '中上签',
    title: '平安顺遂',
    content: '平安是福，知足常乐。',
    poem: '采菊东篱下，悠然见南山。',
  },
  {
    id: 4,
    level: '中签',
    title: '守正待时',
    content: '静待花开，水到渠成。',
    poem: '行到水穷处，坐看云起时。',
  },
  {
    id: 5,
    level: '上签',
    title: '财源广进',
    content: '金玉满堂，富贵吉祥。',
    poem: '天生我材必有用，千金散尽还复来。',
  },
  {
    id: 6,
    level: '上上签',
    title: '花好月圆',
    content: '有情人终成眷属，喜事连连。',
    poem: '但愿人长久，千里共婵娟。',
  },
];

const FortuneDraw = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const tubeRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);
  const [showResult, setShowResult] = useState(false);

  // 抽签动画
  const drawFortune = useCallback(() => {
    if (isShaking || showResult) return;

    setIsShaking(true);

    // 签筒摇晃动画
    const tube = tubeRef.current;
    if (tube) {
      gsap.to(tube, {
        keyframes: [
          { rotation: -10, duration: 0.08 },
          { rotation: 10, duration: 0.08 },
          { rotation: -8, duration: 0.08 },
          { rotation: 8, duration: 0.08 },
          { rotation: -5, duration: 0.08 },
          { rotation: 5, duration: 0.08 },
          { rotation: 0, duration: 0.1 },
        ],
        ease: 'none',
        onComplete: () => {
          setIsShaking(false);
          // 随机选择签文并显示
          const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
          setCurrentFortune(randomFortune);
          setShowResult(true);
        },
      });
    }
  }, [isShaking, showResult]);

  // 结果卡片动画
  useEffect(() => {
    if (showResult && resultRef.current) {
      setIsRevealed(true);
      gsap.fromTo(
        resultRef.current,
        { y: -30, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'back.out(1.2)',
        }
      );
    }
  }, [showResult]);

  // 重新抽签
  const resetDraw = useCallback(() => {
    if (resultRef.current) {
      gsap.to(resultRef.current, {
        y: -20,
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setIsRevealed(false);
          setShowResult(false);
          setCurrentFortune(null);
        },
      });
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 签筒入场动画
      gsap.fromTo(
        tubeRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="fortune-draw"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4 md:px-8"
    >
      {/* 区域标题 */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#daa520]" />
          <span className="text-[#daa520] text-sm tracking-widest">FORTUNE</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#daa520]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-calligraphy text-[#1a1a1a] mb-4">
          求一支新年签
        </h2>
        <p className="text-[#666] font-body text-sm tracking-wider">
          点击签筒，抽取您的新年运势
        </p>
      </div>

      {/* 抽签区域 */}
      <div className="max-w-md mx-auto">
        <div className="relative flex flex-col items-center gap-8">
          
          {/* 结果卡片区域 */}
          <div className="min-h-[200px] w-full flex items-start justify-center">
            {showResult && currentFortune ? (
              <div
                ref={resultRef}
                className="w-72 bg-[#faf8f3] rounded-sm shadow-xl
                         border-2 border-[#daa520] overflow-hidden relative"
                style={{ opacity: 0 }}
              >
                {/* 顶部装饰 */}
                <div className="h-1 bg-gradient-to-r from-[#c1121f] via-[#e63946] to-[#c1121f]" />
                
                {/* 卡片内容 */}
                <div className="p-5">
                  {/* 顶部等级 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-3 py-1 rounded-sm font-body
                      ${currentFortune.level.includes('上') ? 'bg-[#e63946] text-white' : 'bg-[#daa520] text-[#1a1a1a]'}`}>
                      {currentFortune.level}
                    </span>
                    <Sparkles className="w-4 h-4 text-[#daa520]" />
                  </div>

                  {/* 标题 */}
                  <h3 className="text-xl font-calligraphy text-[#c1121f] mb-2 text-center">
                    {currentFortune.title}
                  </h3>

                  {/* 内容 */}
                  <p className="text-sm text-[#4a4a4a] font-body mb-3 text-center">
                    {currentFortune.content}
                  </p>

                  {/* 诗句 */}
                  <div className="pt-3 border-t border-[#daa520]/30">
                    <p className="text-xs text-[#8b7355] font-body italic text-center">
                      「{currentFortune.poem}」
                    </p>
                  </div>
                </div>

                {/* 发光边框效果 */}
                <div 
                  className="absolute inset-0 pointer-events-none border-2 border-[#daa520]/50 rounded-sm"
                  style={{
                    animation: 'pulse-glow 2s ease-in-out infinite',
                  }}
                />
              </div>
            ) : (
              <div className="text-center text-[#8b7355]/50 text-sm font-body pt-16">
                {isShaking ? (
                  <span className="animate-pulse">抽签中...</span>
                ) : (
                  <span>等待抽签</span>
                )}
              </div>
            )}
          </div>

          {/* 签筒区域 */}
          <div className="flex flex-col items-center">
            {/* 签筒 */}
            <div
              ref={tubeRef}
              className={`relative cursor-pointer transition-transform duration-200 mb-4
                ${isShaking ? 'pointer-events-none' : 'hover:scale-105'}`}
              onClick={drawFortune}
              style={{ transformOrigin: 'bottom center', opacity: 0 }}
            >
              {/* 筒口 */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 
                            bg-gradient-to-b from-[#8b6914] to-[#6b5014] 
                            rounded-full border-2 border-[#5a4010] z-10" />
              
              {/* 筒身 */}
              <div className="w-20 h-32 bg-gradient-to-b from-[#d4a574] via-[#c49464] to-[#b48454]
                            rounded-b-lg shadow-lg relative overflow-hidden
                            border-x-2 border-b-2 border-[#a47444]">
                {/* 竹节纹理 */}
                <div className="absolute top-4 left-0 right-0 h-px bg-[#a47444]/50" />
                <div className="absolute top-12 left-0 right-0 h-px bg-[#a47444]/50" />
                <div className="absolute top-20 left-0 right-0 h-px bg-[#a47444]/50" />
                
                {/* 装饰图案 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-[#8b6914]/40 rounded-full 
                                flex items-center justify-center">
                    <span className="text-[#8b6914] font-calligraphy text-lg">运</span>
                  </div>
                </div>

                {/* 流苏 */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 h-8 bg-gradient-to-b from-[#e63946] to-transparent"
                    />
                  ))}
                </div>
              </div>

              {/* 点击提示 */}
              {!showResult && !isShaking && (
                <div className="absolute -right-20 top-1/2 -translate-y-1/2">
                  <span className="text-xs text-[#8b7355] font-body animate-pulse whitespace-nowrap">
                    点击抽签
                  </span>
                </div>
              )}
            </div>

            {/* 底座 */}
            <div className="w-24 h-4 bg-gradient-to-b from-[#e8e4dc] to-[#d4d0c8]
                          rounded-full shadow-inner" />
          </div>

          {/* 重新抽签按钮 */}
          {isRevealed && (
            <div className="mt-4">
              <button
                onClick={resetDraw}
                className="flex items-center gap-2 px-6 py-3 border border-[#c1121f] 
                         text-[#c1121f] font-body text-sm tracking-wider
                         transition-all duration-300 hover:bg-[#c1121f] hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
                再次抽取
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 背景装饰 */}
      <div className="absolute top-1/3 right-[10%] w-24 h-24 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none">
          <path
            d="M50 20 Q80 50 50 80 Q20 50 50 20"
            stroke="#daa520"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      </div>

      {/* 向下引导 - 分享 */}
      <div className="mt-16 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#daa520]" />
          <span className="text-sm text-[#8b7355] font-body tracking-widest">分享这份祝福</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#daa520]" />
        </div>
        <button 
          onClick={() => {
            const element = document.getElementById('share-section');
            if (element) {
              const offset = 80;
              const elementPosition = element.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({
                top: elementPosition - offset,
                behavior: 'smooth'
              });
            }
          }}
          className="group flex flex-col items-center cursor-pointer animate-bounce-slow"
        >
          <div className="w-10 h-10 rounded-full border-2 border-[#daa520] flex items-center justify-center
                        bg-[#faf8f3] shadow-md
                        transition-all duration-300 group-hover:bg-[#daa520] group-hover:scale-110">
            <svg 
              className="w-5 h-5 text-[#daa520] transition-all duration-300 group-hover:text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </button>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(218, 165, 32, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(218, 165, 32, 0.6);
          }
        }
      `}</style>
    </section>
  );
};

export default FortuneDraw;
