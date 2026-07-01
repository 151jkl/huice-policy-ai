import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ============================================================
 * SVG 图标
 * ========================================================== */

function IconArrow() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M5 12h14m0 0l-6-6m6 6l-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPlay() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconSparkle() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDown() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ============================================================
 * 数据
 * ========================================================== */

const reasons = [
  { num: '01', title: '智能政策翻译', desc: 'AI 大模型深度解读政策原文，将晦涩术语转化为通俗易懂的大白话' },
  { num: '02', title: '精准资格判断', desc: '基于个人画像自动评估政策申请资格，避免反复跑腿' },
  { num: '03', title: '可视补贴测算', desc: '一键测算可享受的补贴金额，量化每一项惠民福利' },
];

const scenarios = [
  {
    num: '01', title: '医保报销', desc: '解读医保报销政策', tag: '医疗健康',
    accent: '#1677FF',
  },
  {
    num: '02', title: '生育津贴', desc: '生育津贴申领办法', tag: '生育保障',
    accent: '#FF6B9D',
  },
  {
    num: '03', title: '灵活就业补贴', desc: '灵活就业社保补贴', tag: '就业创业',
    accent: '#52C41A',
  },
  {
    num: '04', title: '高龄补贴', desc: '高龄老人津贴发放', tag: '养老助老',
    accent: '#FA8C16',
  },
  {
    num: '05', title: '人才补贴', desc: '人才引进租房补贴', tag: '人才引进',
    accent: '#722ED1',
  },
];

const timeline = [
  { year: '2020', title: '政策数据积累', desc: '建立 5 大类惠民政策数据库' },
  { year: '2021', title: 'AI 模型训练', desc: '基于 DeepSeek 训练专业政策解读模型' },
  { year: '2022', title: '智能资格判断', desc: '推出 AI 自动评估政策申请资格功能' },
  { year: '2023', title: '补贴金额测算', desc: '上线补贴金额智能测算服务' },
  { year: '2024', title: '可视化办理指南', desc: '推出 Mermaid 流程图与材料清单' },
  { year: '2025', title: '慧策平台发布', desc: '一站式惠民政策智能服务平台正式上线' },
];

/* ============================================================
 * 滚动渐入 Hook
 * ========================================================== */

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ============================================================
 * 数字递增组件
 * ========================================================== */

function CountUp({ end, duration = 1500, prefix = '', suffix = '' }: { end: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(end * eased));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}

/* ============================================================
 * 主组件
 * ========================================================== */

export function Home() {
  const navigate = useNavigate();
  const goAnalysis = () => navigate('/analysis');
  const reasonReveal = useReveal<HTMLDivElement>();
  const scenarioReveal = useReveal<HTMLDivElement>();
  const timelineReveal = useReveal<HTMLDivElement>();
  const ctaReveal = useReveal<HTMLDivElement>();

  return (
    <div className="w-full overflow-hidden bg-[#0A0E1A] text-white">
      {/* ============ 1. Hero 区域 ============ */}
      <section className="relative min-h-[760px] bg-[#0A0E1A] overflow-hidden">
        {/* 背景辉光 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[radial-gradient(circle,rgba(22,119,255,0.18)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(186,224,255,0.12)_0%,transparent_60%)] blur-3xl" />

        {/* 装饰线 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        <div className="relative min-h-[760px] flex flex-col items-center justify-center px-6 py-20 max-w-[1400px] mx-auto">
          {/* 徽章 */}
          <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 text-xs text-white/80 mb-10">
            <IconSparkle className="w-3 h-3 text-[#BAE0FF]" />
            <span>AI 驱动的政策智能服务</span>
          </div>

          {/* 主标题 - 巨号字体 */}
          <h1 className="text-center text-[56px] md:text-[96px] lg:text-[140px] font-bold leading-[0.95] tracking-tight">
            <span className="block text-white">看懂政策</span>
            <span className="block bg-gradient-to-r from-[#BAE0FF] via-[#69B1FF] to-[#1677FF] bg-clip-text text-transparent">
              触手可及
            </span>
          </h1>

          {/* 副标题 */}
          <p className="mt-10 text-center text-lg md:text-xl text-white/60 max-w-[640px] leading-relaxed">
            慧策让复杂的惠民政策变得简单 · 智能翻译 · 资格判断 · 补贴测算 · 办理指南
          </p>

          {/* 数字数据条 */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-12 md:gap-20">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white">
                <CountUp end={5} />
              </div>
              <div className="mt-2 text-sm text-white/40 tracking-wider">政策领域</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white">
                <CountUp end={95} suffix="%" />
              </div>
              <div className="mt-2 text-sm text-white/40 tracking-wider">解读准确率</div>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white">
                <CountUp end={80} suffix="%" />
              </div>
              <div className="mt-2 text-sm text-white/40 tracking-wider">时间节省</div>
            </div>
          </div>

          {/* CTA 按钮 */}
          <div className="mt-16 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={goAnalysis}
              className="inline-flex items-center gap-2 bg-white text-[#0A0E1A] font-semibold rounded-full px-8 py-4 text-base transition-all duration-300 hover:scale-105 active:scale-95"
            >
              开始体验
              <IconArrow />
            </button>
            <button
              onClick={goAnalysis}
              className="inline-flex items-center gap-2 border border-white/30 text-white font-medium rounded-full px-8 py-4 text-base transition-all duration-300 hover:bg-white/10 hover:border-white/60"
            >
              <IconPlay />
              查看示例
            </button>
          </div>

          {/* 滚动提示 */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-pulse-slow">
            <span className="text-xs tracking-widest">SCROLL</span>
            <IconDown />
          </div>
        </div>
      </section>

      {/* ============ 2. 三大理由区 ============ */}
      <section className="relative py-28 bg-[#0A0E1A] border-t border-white/5">
        <div ref={reasonReveal.ref} className={`relative max-w-[1400px] mx-auto px-6 ${reasonReveal.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {/* 章节标题 */}
          <div className="mb-14">
            <div className="text-[#69B1FF] text-sm font-medium tracking-[0.2em] mb-3">3 REASONS</div>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.1]">
                选择慧策的<br />
                <span className="text-white/35">三个理由</span>
              </h2>
              <p className="text-white/50 text-sm md:text-base max-w-md">
                从政策理解到办理落地，AI 全程赋能，让每一位用户都能享受到政策的温暖
              </p>
            </div>
          </div>

          {/* 三大理由 - 深色卡片 + 白色巨号 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reasons.map((r) => (
              <div
                key={r.num}
                className="group relative flex flex-col bg-[#0F1424] border border-white/10 rounded-xl p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:bg-[#141B30] h-full min-h-[280px]"
              >
                {/* 顶部蓝线 - 悬停时拉伸 */}
                <div className="absolute top-0 left-0 h-[3px] w-16 bg-[#1677FF] rounded-t-xl transition-all duration-500 group-hover:w-full" />

                {/* 巨号白色序号 */}
                <div className="text-[64px] lg:text-[80px] font-black leading-none text-white mb-6 tracking-tighter transition-transform duration-500 group-hover:scale-105 origin-left">
                  {r.num}
                </div>

                {/* 标题 */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {r.title}
                </h3>

                {/* 描述 */}
                <p className="text-sm text-white/50 leading-relaxed flex-1">
                  {r.desc}
                </p>

                {/* 底部链接 */}
                <div className="mt-6 flex items-center gap-2 text-[#69B1FF] text-sm font-medium">
                  <span>了解更多</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <IconArrow />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 3. 政策场景区 ============ */}
      <section className="relative py-28 bg-[#0A0E1A] border-t border-white/5">
        <div ref={scenarioReveal.ref} className={`relative max-w-[1400px] mx-auto px-6 ${scenarioReveal.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {/* 章节标题 */}
          <div className="mb-14">
            <div className="text-[#69B1FF] text-sm font-medium tracking-[0.2em] mb-3">SCENARIOS</div>
            <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-[1.1]">
              五大惠民<span className="text-white/35">政策场景</span>
            </h2>
          </div>

          {/* 五大场景 - NANFU 风格：深色卡片 + 巨号彩色序号 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {scenarios.map((s) => (
              <button
                key={s.num}
                onClick={goAnalysis}
                className="group relative flex flex-col border-t border-r border-b border-white/10 first:border-l bg-[#0F1424] p-7 text-left transition-all duration-500 hover:bg-[#141B30] hover:-translate-y-1 h-full min-h-[280px]"
              >
                {/* 顶部彩色短线 - 悬停时拉伸 */}
                <div
                  className="absolute top-0 left-0 h-[2px] w-12 transition-all duration-500 group-hover:w-full"
                  style={{ background: s.accent }}
                />

                {/* 巨号彩色序号 */}
                <div
                  className="text-[72px] lg:text-[88px] font-black leading-none mb-6 tracking-tighter transition-transform duration-500 group-hover:scale-105 origin-left"
                  style={{ color: s.accent }}
                >
                  {s.num}
                </div>

                {/* 标签 */}
                <div className="text-xs font-medium tracking-[0.2em] mb-3" style={{ color: s.accent }}>
                  {s.tag}
                </div>

                {/* 标题 */}
                <h3 className="text-xl font-semibold text-white mb-2">
                  {s.title}
                </h3>

                {/* 描述 */}
                <p className="text-sm text-white/50 leading-relaxed flex-1">
                  {s.desc}
                </p>

                {/* 底部箭头 - 悬停时向右滑出 */}
                <div className="mt-6 flex items-center gap-2 text-white/40 group-hover:text-white transition-colors duration-300 text-sm font-medium">
                  <span>查看示例</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                    <IconArrow />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 4. 时间线区 ============ */}
      <section className="relative py-32 bg-[#0A0E1A] border-t border-white/5">
        <div ref={timelineReveal.ref} className={`relative max-w-[1400px] mx-auto px-6 ${timelineReveal.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          {/* 章节标题 */}
          <div className="text-center mb-20">
            <div className="text-[#69B1FF] text-sm font-medium tracking-[0.2em] mb-4">HISTORY</div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              演进<span className="text-white/40">历程</span>
            </h2>
            <p className="mt-6 text-white/50 text-base max-w-2xl mx-auto">
              每一次升级，都为用户带来更优质的智能政策服务体验
            </p>
          </div>

          {/* 时间线 */}
          <div className="relative">
            {/* 中线 */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            <div className="space-y-16">
              {timeline.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex items-center gap-8 ${
                    i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  {/* 内容 */}
                  <div className={`flex-1 ${i % 2 === 0 ? 'text-right pr-12' : 'text-left pl-12'}`}>
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                      {item.year}
                    </div>
                    <h3 className="text-xl font-semibold text-white/90 mb-2">{item.title}</h3>
                    <p className="text-sm text-white/50">{item.desc}</p>
                  </div>

                  {/* 中心圆点 */}
                  <div className="relative z-10 w-4 h-4 rounded-full bg-[#69B1FF] ring-4 ring-[#0A0E1A] shadow-[0_0_20px_rgba(105,177,255,0.6)]" />

                  {/* 占位 */}
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ 5. CTA 区 ============ */}
      <section className="relative py-32 bg-[#060912] border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(22,119,255,0.15)_0%,transparent_60%)] blur-3xl" />

        <div ref={ctaReveal.ref} className={`relative text-center px-6 max-w-4xl mx-auto ${ctaReveal.visible ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="text-[#69B1FF] text-sm font-medium tracking-[0.2em] mb-6">GET STARTED</div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            立即<br />
            <span className="bg-gradient-to-r from-[#BAE0FF] to-[#1677FF] bg-clip-text text-transparent">
              体验慧策
            </span>
          </h2>
          <p className="mt-8 text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
            上传政策文件，AI 秒级翻译<br />
            让每一份政策都触手可及
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={goAnalysis}
              className="inline-flex items-center gap-2 bg-white text-[#0A0E1A] font-semibold rounded-full px-10 py-5 text-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              上传政策文件
              <IconArrow />
            </button>
          </div>
          <button
            onClick={goAnalysis}
            className="mt-6 text-sm text-white/50 hover:text-white transition-colors"
          >
            或选择示例政策快速体验 →
          </button>
        </div>
      </section>
    </div>
  );
}
