import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Copy, Download, Share2, Check, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const shareTexts = [
  {
    title: '新春贺词',
    content: '岁序更新，春回大地。愿君新岁平安喜乐，万事顺遂，所求皆如愿，所行皆坦途。',
  },
  {
    title: '拜年寄语',
    content: '爆竹声中一岁除，春风送暖入屠苏。愿新的一年，所有的美好都如约而至。',
  },
  {
    title: '温馨祝福',
    content: '愿生活明朗，万物可爱。愿岁岁常欢愉，年年皆胜意。新年快乐！',
  },
];

const ShareSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [selectedText, setSelectedText] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 清除 toast timer
  const clearToastTimer = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
  }, []);

  // 显示提示
  const showToastMessage = useCallback((message: string) => {
    clearToastTimer();
    setToastMessage(message);
    setShowToast(true);
    toastTimerRef.current = setTimeout(() => {
      setShowToast(false);
      toastTimerRef.current = null;
    }, 2500);
  }, [clearToastTimer]);

  // 复制文案
  const copyText = async () => {
    const text = shareTexts[selectedText].content;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToastMessage('文案已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
      showToastMessage('复制失败，请重试');
    }
  };

  // 下载海报（模拟）
  const downloadPoster = () => {
    // 创建临时画布
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // 背景
      ctx.fillStyle = '#f5f5f0';
      ctx.fillRect(0, 0, 600, 800);
      
      // 纹理
      ctx.fillStyle = 'rgba(0,0,0,0.02)';
      for (let i = 0; i < 600; i += 4) {
        for (let j = 0; j < 800; j += 4) {
          if (Math.random() > 0.5) {
            ctx.fillRect(i, j, 2, 2);
          }
        }
      }
      
      // 边框
      ctx.strokeStyle = '#daa520';
      ctx.lineWidth = 3;
      ctx.strokeRect(30, 30, 540, 740);
      
      // 内边框
      ctx.strokeStyle = '#c1121f';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, 520, 720);
      
      // 标题
      ctx.fillStyle = '#c1121f';
      ctx.font = 'bold 48px "Noto Serif SC", serif';
      ctx.textAlign = 'center';
      ctx.fillText('新岁笺', 300, 150);
      
      // 分隔线
      ctx.strokeStyle = '#daa520';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(200, 180);
      ctx.lineTo(400, 180);
      ctx.stroke();
      
      // 正文
      ctx.fillStyle = '#1a1a1a';
      ctx.font = '28px "Noto Serif SC", serif';
      const text = shareTexts[selectedText].content;
      const words = text.split('');
      let line = '';
      let y = 280;
      const lineHeight = 45;
      const maxWidth = 480;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, 300, y);
          line = words[i];
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 300, y);
      
      // 底部装饰
      ctx.fillStyle = '#daa520';
      ctx.font = '20px "Noto Serif SC", serif';
      ctx.fillText('—— 愿岁岁常欢愉 ——', 300, 700);
      
      // 下载
      const link = document.createElement('a');
      link.download = `新岁笺-${shareTexts[selectedText].title}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      showToastMessage('海报已下载');
    }
  };

  // 分享（使用 Web Share API）
  const shareContent = async () => {
    const text = shareTexts[selectedText].content;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: '新岁笺 - 中式美学拜年寄语',
          text: text,
          url: window.location.href,
        });
        showToastMessage('分享成功');
      } catch (err) {
        console.error('分享失败:', err);
        // 如果不支持或用户取消，复制到剪贴板
        copyText();
      }
    } else {
      copyText();
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 卷轴展开动画
      gsap.fromTo(
        scrollRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // 内容淡入
      gsap.fromTo(
        contentRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => {
      ctx.revert();
      clearToastTimer();
    };
  }, [clearToastTimer]);

  return (
    <section
      id="share-section"
      ref={sectionRef}
      className="relative py-24 md:py-32 px-4 md:px-8"
    >
      {/* 区域标题 */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#daa520]" />
          <span className="text-[#daa520] text-sm tracking-widest">SHARE</span>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#daa520]" />
        </div>
        <h2 className="text-3xl md:text-4xl font-calligraphy text-[#1a1a1a] mb-4">
          分享这份祝福
        </h2>
        <p className="text-[#666] font-body text-sm tracking-wider">
          将美好传递给亲朋好友
        </p>
      </div>

      {/* 卷轴容器 */}
      <div className="max-w-2xl mx-auto">
        <div
          ref={scrollRef}
          className="relative"
          style={{ transformOrigin: 'center' }}
        >
          {/* 卷轴轴头 - 左 */}
          <div className="absolute -left-4 top-0 bottom-0 w-8 bg-gradient-to-r from-[#8b6914] to-[#d4a574]
                        rounded-l-full shadow-lg z-10" />
          
          {/* 卷轴轴头 - 右 */}
          <div className="absolute -right-4 top-0 bottom-0 w-8 bg-gradient-to-l from-[#8b6914] to-[#d4a574]
                        rounded-r-full shadow-lg z-10" />

          {/* 卷轴主体 */}
          <div className="bg-[#faf8f3] rounded-sm shadow-xl overflow-hidden
                        border-y-2 border-[#daa520]/30">
            {/* 顶部装饰 */}
            <div className="h-2 bg-gradient-to-r from-[#c1121f] via-[#e63946] to-[#c1121f]" />

            {/* 内容区域 */}
            <div ref={contentRef} className="p-8 md:p-12">
              {/* 文案选择 */}
              <div className="flex justify-center gap-4 mb-8">
                {shareTexts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedText(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300
                      ${selectedText === index 
                        ? 'bg-[#c1121f] scale-125' 
                        : 'bg-[#daa520]/40 hover:bg-[#daa520]/60'}`}
                  />
                ))}
              </div>

              {/* 文案内容 */}
              <div className="text-center mb-10">
                <h3 className="text-xl font-calligraphy text-[#c1121f] mb-4">
                  {shareTexts[selectedText].title}
                </h3>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#daa520]" />
                  <Sparkles className="w-4 h-4 text-[#daa520]" />
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#daa520]" />
                </div>
                <p className="text-[#4a4a4a] font-body text-base leading-relaxed max-w-lg mx-auto">
                  {shareTexts[selectedText].content}
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={copyText}
                  className="group flex items-center gap-2 px-6 py-3 
                           border border-[#daa520] text-[#8b7355]
                           font-body text-sm tracking-wider
                           transition-all duration-300
                           hover:bg-[#daa520] hover:text-[#1a1a1a]"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  复制文案
                </button>

                <button
                  onClick={downloadPoster}
                  className="group flex items-center gap-2 px-6 py-3 
                           border border-[#c1121f] text-[#c1121f]
                           font-body text-sm tracking-wider
                           transition-all duration-300
                           hover:bg-[#c1121f] hover:text-white"
                >
                  <Download className="w-4 h-4" />
                  下载海报
                </button>

                <button
                  onClick={shareContent}
                  className="group flex items-center gap-2 px-6 py-3 
                           bg-[#daa520] text-[#1a1a1a]
                           font-body text-sm tracking-wider
                           transition-all duration-300
                           hover:bg-[#c1121f] hover:text-white"
                >
                  <Share2 className="w-4 h-4" />
                  分享
                </button>
              </div>
            </div>

            {/* 底部装饰 */}
            <div className="h-2 bg-gradient-to-r from-[#c1121f] via-[#e63946] to-[#c1121f]" />
          </div>
        </div>

        { /* 装饰印章 */ }
        <div className="flex justify-center mt-8">
          <div className="relative w-16 h-16 border-2 border-[#c1121f] rounded-sm flex items-center justify-center bg-[#f5f5f0] rotate-12 opacity-80">

          <span className="absolute top-1 right-1 text-[#c1121f] text-xl font-calligraphy">吉</span>
          <span className="absolute top-1 left-1 text-[#c1121f] text-xl font-calligraphy">如</span>
          <span className="absolute bottom-1 right-1 text-[#c1121f] text-xl font-calligraphy">祥</span>
          <span className="absolute bottom-1 left-1 text-[#c1121f] text-xl font-calligraphy">意</span>

          </div>
        </div>
      </div>

      {/* 提示 Toast - 使用 Portal 方式渲染到 body */}
      {showToast && (
        <div 
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999]"
          onClick={() => setShowToast(false)}
        >
          <div className="px-6 py-3 bg-[#1a1a1a]/90 text-white text-sm font-body
                        rounded-sm shadow-lg cursor-pointer">
            {toastMessage}
          </div>
        </div>
      )}

      {/* 背景装饰 */}
      <div className="absolute bottom-0 left-[5%] w-32 h-32 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none">
          <path
            d="M20 80 Q50 20 80 80"
            stroke="#c1121f"
            strokeWidth="1"
            fill="none"
          />
          <circle cx="20" cy="80" r="3" fill="#e63946" />
          <circle cx="50" cy="50" r="3" fill="#e63946" />
          <circle cx="80" cy="80" r="3" fill="#e63946" />
        </svg>
      </div>

      <div className="absolute top-1/4 right-[8%] w-24 h-24 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" fill="none">
          <rect x="30" y="30" width="40" height="40" stroke="#daa520" strokeWidth="1" fill="none" />
          <rect x="40" y="40" width="20" height="20" stroke="#daa520" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </section>
  );
};

export default ShareSection;
