import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Copy, Check, RefreshCw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Blessing {
  id: number;
  title: string;
  content: string;
  subtitle: string;
}

const blessings: Blessing[] = [
  {
    id: 1,
    title: '岁岁平安',
    content: '愿君岁岁平安，年年如意。春风得意马蹄疾，一日看尽长安花。',
    subtitle: '平安喜乐',
  },
  {
    id: 2,
    title: '万事如意',
    content: '新的一年，愿您心想事成，万事顺遂。海阔凭鱼跃，天高任鸟飞。',
    subtitle: '顺心顺意',
  },
  {
    id: 3,
    title: '福满门庭',
    content: '愿福气如东海，寿比南山。春风送暖入屠苏，爆竹声中一岁除。',
    subtitle: '福寿双全',
  },
  {
    id: 4,
    title: '步步高升',
    content: '愿您事业腾飞，前程似锦。会当凌绝顶，一览众山小。',
    subtitle: '平步青云',
  },
  {
    id: 5,
    title: '阖家欢乐',
    content: '愿家庭和睦，幸福美满。但愿人长久，千里共婵娟。',
    subtitle: '天伦之乐',
  },
  {
    id: 6,
    title: '财源广进',
    content: '愿财运亨通，富贵吉祥。金玉满堂莫之能守，富贵而骄自遗其咎。',
    subtitle: '招财进宝',
  },
];

const BlessingGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // 卡片3D倾斜效果
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.3,
      ease: 'power2.out',
    });
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;

    gsap.to(card, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  }, []);

  // 复制祝福文案
  const copyBlessing = async (blessing: Blessing) => {
    const text = `${blessing.title}\n${blessing.content}\n—— ${blessing.subtitle}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(blessing.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 切换祝福
  const rotateBlessing = () => {
    setCurrentIndex((prev) => (prev + 3) % blessings.length);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 卡片入场动画
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        gsap.fromTo(
          card,
          { 
            rotateX: 90, 
            opacity: 0,
            y: 50,
          },
          {
            rotateX: 0,
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const displayedBlessings = blessings.slice(currentIndex, currentIndex + 3);
  const remainingCount = 3 - displayedBlessings.length;
  const wrappedBlessings = remainingCount > 0 
    ? [...displayedBlessings, ...blessings.slice(0, remainingCount)]
    : displayedBlessings;

  return (
    <section
      id="blessing-gallery"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4 md:px-8"
    >
      {/* 区域标题 */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#daa520]" />
          <span className="text-[#daa520] text-sm tracking-widest">BLESSINGS</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#daa520]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-calligraphy text-[#1a1a1a] mb-4">
          新春寄语
        </h2>
        <p className="text-[#666] font-body text-sm tracking-wider">
          取一纸墨香，寄一份祝福
        </p>
      </div>

      {/* 卡片容器 */}
      <div 
        className="max-w-6xl mx-auto tilt-card-container"
        style={{ perspective: '1000px' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {wrappedBlessings.map((blessing, index) => (
            <div
              key={blessing.id}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className="tilt-card relative group"
              style={{ transformStyle: 'preserve-3d' }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              {/* 卡片主体 */}
              <div className="relative bg-[#faf8f3] rounded-sm overflow-hidden shadow-md
                            border border-[#e8e4dc] transition-shadow duration-500
                            group-hover:shadow-xl group-hover:border-[#daa520]/30
                            card-gloss">
                
                {/* 宣纸纹理叠加 */}
                <div 
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'multiply',
                  }}
                />

                {/* 顶部装饰条 */}
                <div className="h-1 bg-gradient-to-r from-[#c1121f] via-[#e63946] to-[#c1121f]" />

                {/* 卡片内容 */}
                <div className="p-6 md:p-8 relative">
                  {/* 角落装饰 */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-[#daa520]/40" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-[#daa520]/40" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-[#daa520]/40" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-[#daa520]/40" />

                  {/* 标题 */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-calligraphy text-[#c1121f] mb-2">
                      {blessing.title}
                    </h3>
                    <span className="text-xs text-[#8b7355] tracking-widest">
                      {blessing.subtitle}
                    </span>
                  </div>

                  {/* 分隔线 */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-8 h-px bg-[#daa520]/30" />
                    <div className="w-1 h-1 bg-[#daa520]/50 rotate-45" />
                    <div className="w-8 h-px bg-[#daa520]/30" />
                  </div>

                  {/* 正文 */}
                  <p className="text-[#4a4a4a] font-body text-sm leading-relaxed text-center mb-6
                              min-h-[80px] flex items-center justify-center">
                    {blessing.content}
                  </p>

                  {/* 复制按钮 */}
                  <button
                    onClick={() => copyBlessing(blessing)}
                    className="w-full py-2 border border-[#daa520]/50 text-[#8b7355] text-sm
                             font-body tracking-wider transition-all duration-300
                             hover:bg-[#daa520]/10 hover:border-[#daa520]"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {copiedId === blessing.id ? (
                        <>
                          <Check className="w-4 h-4" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          复制寄语
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* 底部印章 */}
                <div className="absolute bottom-4 right-4 opacity-20">
                  <div className="w-8 h-8 border border-[#c1121f] rounded-sm flex items-center justify-center">
                    <span className="text-[#c1121f] text-xs font-calligraphy">吉</span>
                  </div>
                </div>
              </div>

              {/* 悬停时的金粉效果 */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-[#daa520] rounded-full"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 40}%`,
                      animation: `gold-sparkle ${2 + i * 0.3}s ease-in-out infinite`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 切换按钮 */}
        <div className="flex justify-center mt-12">
          <button
            onClick={rotateBlessing}
            className="group flex items-center gap-2 px-6 py-3 border border-[#c1121f]/50
                     text-[#c1121f] font-body text-sm tracking-wider
                     transition-all duration-300 hover:bg-[#c1121f] hover:text-white"
          >
            <RefreshCw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" />
            换一组寄语
          </button>
        </div>

        {/* 向下引导 - 求签 */}
        <div className="mt-16 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#daa520]" />
            <span className="text-sm text-[#8b7355] font-body tracking-widest">求一支新年签</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#daa520]" />
          </div>
          <button 
            onClick={() => {
              const element = document.getElementById('fortune-draw');
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
      </div>

      {/* 背景装饰 */}
      <div className="absolute top-1/4 left-0 w-32 h-32 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="40" stroke="#daa520" strokeWidth="0.5" fill="none" />
          <circle cx="50" cy="50" r="30" stroke="#daa520" strokeWidth="0.5" fill="none" />
          <circle cx="50" cy="50" r="20" stroke="#daa520" strokeWidth="0.5" fill="none" />
        </svg>
      </div>

      <div className="absolute bottom-1/4 right-0 w-40 h-40 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none">
          <path
            d="M50 10 Q90 50 50 90 Q10 50 50 10"
            stroke="#c1121f"
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      </div>
    </section>
  );
};

export default BlessingGallery;
