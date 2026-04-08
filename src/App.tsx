import React, { useState, useEffect, useRef, useCallback, FormEvent, useId } from 'react';
import { motion, AnimatePresence as _AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Zap,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  BarChart3,
  Sparkles,
  Search,
  Lightbulb,
  Rocket
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/interfaces-carousel';
import AnimatedGradientBackground from '@/components/ui/animated-gradient-background';
import { Application } from '@splinetool/runtime';
import { LogoCloud } from '@/components/ui/logo-cloud';
import { InfiniteGrid } from '@/components/ui/infinite-grid';
import { InfiniteSlider } from '@/components/ui/infinite-slider';

const SPLINE_SCENE = 'https://prod.spline.design/rQbuhcAQugoIO41z/scene.splinecode';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, [breakpoint]);
  return isMobile;
}

function shouldLoadSpline(): boolean {
  if (typeof window === 'undefined') return false;
  const isMobile = window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency <= 2;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  return !isMobile && !isLowEnd && !!gl;
}

const SPLINE_CACHE_KEY = 'conoti-spline-snapshot';

function SplineStaticMobile() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(() => {
    // Check localStorage for a cached snapshot
    try { return localStorage.getItem(SPLINE_CACHE_KEY); } catch { return null; }
  });

  useEffect(() => {
    // Already have a cached image — skip loading Spline
    if (imgSrc) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const app = new Application(canvas);
    const timeout = setTimeout(() => app.dispose(), 12000);

    app.load(SPLINE_SCENE).then(() => {
      clearTimeout(timeout);
      // Wait a frame for the scene to render, then capture
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            const dataUrl = canvas.toDataURL('image/webp', 0.85);
            setImgSrc(dataUrl);
            localStorage.setItem(SPLINE_CACHE_KEY, dataUrl);
          } catch {
            // toDataURL may fail (tainted canvas) — use PNG fallback
            try {
              const dataUrl = canvas.toDataURL('image/png');
              setImgSrc(dataUrl);
              localStorage.setItem(SPLINE_CACHE_KEY, dataUrl);
            } catch { /* give up, show canvas as-is */ }
          }
          app.dispose();
        });
      });
    }).catch(() => {
      clearTimeout(timeout);
      app.dispose();
    });

    return () => { clearTimeout(timeout); };
  }, [imgSrc]);

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative h-[300px] w-full overflow-hidden">
        {imgSrc ? (
          // Static captured image — zero GPU cost
          <img
            src={imgSrc}
            alt="3D visualization"
            className="w-full h-full object-contain"
          />
        ) : (
          // Temporary: render Spline to capture a frame
          <>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="h-10 w-10 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
            </div>
            <canvas
              ref={canvasRef}
              style={{ width: '100%', height: '100%', opacity: 0 }}
            />
          </>
        )}
      </div>
    </div>
  );
}

function SplineHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  // Only attempt Spline on desktop capable devices
  const canLoad = !IS_MOBILE && shouldLoadSpline();

  useEffect(() => {
    if (!canLoad || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const app = new Application(canvas);

    const timeout = setTimeout(() => {
      setFailed(true);
    }, 10000);

    app.load(SPLINE_SCENE).then(() => {
      clearTimeout(timeout);
      setLoaded(true);
    }).catch(() => {
      setFailed(true);
    });

    return () => {
      clearTimeout(timeout);
      app.dispose();
    };
  }, [canLoad]);

  // MOBILE: load Spline once, capture a static frame, dispose runtime
  if (IS_MOBILE) {
    return <SplineStaticMobile />;
  }

  // DESKTOP: Spline 3D with fallback
  return (
    <M
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      className="relative flex items-center justify-center lg:py-0"
    >
      <div className="relative h-[520px] lg:h-[580px] w-full overflow-hidden">
        {/* Spline failed or loading fallback */}
        {failed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass rounded-[2rem] p-10 text-center shadow-[0_0_50px_rgba(147,51,234,0.2)] ring-1 ring-white/20 backdrop-blur-3xl">
              <p className="font-heading text-6xl font-bold text-white mb-1 tracking-tighter">20k+</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Especialistas</p>
            </div>
          </div>
        )}

        {/* Desktop - Spline 3D */}
        {canLoad && !failed && (
          <>
            {!loaded && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="h-12 w-12 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin" />
              </div>
            )}
            <canvas
              ref={canvasRef}
              id="canvas3d"
              style={{
                width: '100%',
                height: '100%',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.8s ease',
              }}
            />
          </>
        )}

        {/* Floating badges around the sphere */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Top-left */}
          <div className="absolute top-8 left-4">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
              <BarChart3 size={12} className="text-purple-600" />
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">326k+ Anúncios</span>
            </div>
          </div>

          {/* Top-right */}
          <div className="absolute top-16 right-2">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
              <TrendingUp size={12} className="text-purple-600" />
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">ROAS 4.2x</span>
            </div>
          </div>

          {/* Bottom-left */}
          <div className="absolute bottom-16 left-2">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
              <Zap size={12} className="text-purple-600" />
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">IA Nativa</span>
            </div>
          </div>

          {/* Bottom-right */}
          <div className="absolute bottom-6 right-2">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" fill="#9333EA"/></svg>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">Parceiro TikTok</span>
            </div>
          </div>
        </div>
      </div>
    </M>
  );
}

function FaqItem({ question, answer, index }: { key?: number; question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <M
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] px-7 py-5 text-left cursor-pointer transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04]"
      >
        <span className="font-heading text-base font-bold text-white">{question}</span>
        <MSpan
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-purple-400 text-xl font-light shrink-0"
        >
          +
        </MSpan>
      </button>
      <AnimatePresence>
        {isOpen && (
          <M
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-7 py-4 text-sm text-slate-400 leading-relaxed">{answer}</p>
          </M>
        )}
      </AnimatePresence>
    </M>
  );
}

const autopilotSteps = [
  { text: "Conta do TikTok Ads conectada e dados importados" },
  { text: "IA analisa seu nicho e 326k+ criativos de referência" },
  { text: "Scripts e hooks gerados para os primeiros 3 segundos" },
  { text: "Criativos produzidos e publicados em teste A/B" },
  { text: "CPA, CTR e ROAS monitorados em tempo real" },
  { text: "Budget redistribuído automaticamente para os winners" },
];

function AutopilotSection() {
  const [isOn, setIsOn] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleToggle = useCallback(() => {
    if (isOn) {
      setIsOn(false);
      setCompletedSteps([]);
      return;
    }
    setIsOn(true);
    setCompletedSteps([]);
    autopilotSteps.forEach((_, i) => {
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, i]);
      }, (i + 1) * 500);
    });
  }, [isOn]);

  return (
    <section className="py-32 lg:py-52 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-purple-900/10 blur-[180px] pointer-events-none" aria-hidden="true" />
      <div className="mx-auto max-w-3xl px-6 relative z-10">
        <div className="text-center mb-20">
          <MH2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-5xl font-bold text-white sm:text-7xl tracking-tighter leading-[1.05] mb-8 whitespace-nowrap"
          >
            Ative{' '}
            <button
              onClick={handleToggle}
              className="inline-flex items-center align-middle mx-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
              aria-label={isOn ? 'Desativar autopilot' : 'Ativar autopilot'}
            >
              <div className={`relative w-20 h-11 rounded-full transition-colors duration-300 ${isOn ? 'bg-purple-600 shadow-[0_0_30px_rgba(147,51,234,0.5)]' : 'bg-white/10 border border-white/20'}`}>
                <motion.div
                  className="absolute top-1.5 w-8 h-8 rounded-full bg-white shadow-lg"
                  animate={{ x: isOn ? 36 : 4 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </button>
            {' '}<span className="text-gradient-purple">a Escala</span>
          </MH2>
          <MP
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-400 font-medium text-xl max-w-xl mx-auto leading-relaxed"
          >
            {isOn
              ? 'A Conoti está no controle — analisando criativos, otimizando bids e escalando seus resultados no TikTok enquanto você foca na estratégia.'
              : 'Um clique. É tudo que precisa para a Conoti assumir suas campanhas do TikTok Ads com IA e escalar seus resultados.'
            }
          </MP>
        </div>

        <div className="space-y-4">
          {autopilotSteps.map((step, i) => {
            const isComplete = completedSteps.includes(i);
            return (
              <motion.div
                key={i}
                initial={IS_MOBILE ? { opacity: 0.3 } : { opacity: 0.3, y: 10 }}
                animate={isComplete ? { opacity: 1, y: 0 } : isOn ? { opacity: 1, y: 0 } : { opacity: 0.3, y: IS_MOBILE ? 0 : 10 }}
                transition={{ duration: 0.3, delay: isOn ? i * 0.08 : 0 }}
                className={`flex items-center justify-between rounded-2xl border px-8 py-5 transition-all duration-300 ${
                  isComplete
                    ? 'border-purple-500/30 bg-purple-500/[0.08]'
                    : 'border-white/5 bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isComplete
                      ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]'
                      : 'bg-white/10'
                  }`}>
                    {isComplete ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <div className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    )}
                  </div>
                  <span className={`text-base font-medium transition-colors duration-300 ${isComplete ? 'text-white' : 'text-slate-500'}`}>
                    {step.text}
                  </span>
                </div>
                {isComplete && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-xs font-bold text-purple-400 uppercase tracking-widest shrink-0 ml-4"
                  >
                    Completo
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const partnerLogos = [
  { src: "https://svgl.app/library/nvidia-wordmark-light.svg", alt: "Nvidia" },
  { src: "https://svgl.app/library/supabase_wordmark_light.svg", alt: "Supabase" },
  { src: "https://svgl.app/library/openai_wordmark_light.svg", alt: "OpenAI" },
  { src: "https://svgl.app/library/vercel_wordmark.svg", alt: "Vercel" },
  { src: "https://svgl.app/library/github_wordmark_light.svg", alt: "GitHub" },
  { src: "https://svgl.app/library/claude-ai-wordmark-icon_light.svg", alt: "Claude AI" },
  { src: "https://svgl.app/library/stripe_wordmark.svg", alt: "Stripe" },
  { src: "https://svgl.app/library/shopify_wordmark_light.svg", alt: "Shopify" },
];

const navItems = [
  { label: 'Serviços', href: '#serviços' },
  { label: 'Processo', href: '#processo' },
  { label: 'Resultados', href: '#results' },
];

// Resolved once at module load — never re-evaluated, zero re-render cost
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;

const AnimatePresence = IS_MOBILE
  ? (({ children }: { children?: React.ReactNode }) => <>{children}</>) as unknown as typeof _AnimatePresence
  : _AnimatePresence;

function stripMotion({ initial, animate, whileInView, whileHover, whileTap, whileFocus, whileDrag, viewport, transition, exit, variants, onAnimationStart, onAnimationComplete, layout, layoutId, ...rest }: Record<string, unknown>) {
  return rest;
}

const M = (IS_MOBILE
  ? ((props: Record<string, unknown>) => <div {...stripMotion(props)} />)
  : motion.div) as typeof motion.div;

const MFigure = (IS_MOBILE
  ? ((props: Record<string, unknown>) => <figure {...stripMotion(props)} />)
  : motion.figure) as typeof motion.figure;

const MSpan = (IS_MOBILE
  ? ((props: Record<string, unknown>) => <span {...stripMotion(props)} />)
  : motion.span) as typeof motion.span;

const MH2 = (IS_MOBILE
  ? ((props: Record<string, unknown>) => <h2 {...stripMotion(props)} />)
  : motion.h2) as typeof motion.h2;

const MP = (IS_MOBILE
  ? ((props: Record<string, unknown>) => <p {...stripMotion(props)} />)
  : motion.p) as typeof motion.p;

export default function App() {
  const mobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formStep, setFormStep] = useState(0);
  const [isHighBudget, setIsHighBudget] = useState(false);
  const nameId = useId();
  const emailId = useId();
  const budgetId = useId();
  const messageId = useId();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    setTimeout(() => setFormStatus('success'), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0C0E1D] font-sans text-slate-300 selection:bg-purple-500/30 selection:text-white overflow-x-hidden">
      {/* Skip Link - Accessibility */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>

      {/* Subtle ambient glow for sections below hero */}
      <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute bottom-[10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-blue-900/15 blur-[100px]" />
        <div className="absolute top-[60%] left-[20%] h-[300px] w-[300px] rounded-full bg-emerald-900/10 blur-[80px]" />
      </div>

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative pb-20 lg:pb-40 overflow-hidden">
          {/* Animated Gradient Background - covers navbar + hero */}
          <div className="absolute inset-0 -z-0" aria-hidden="true">
            <AnimatedGradientBackground
              Breathing={true}
              animationSpeed={0.015}
              breathingRange={4}
              startingGap={100}
              topOffset={40}
              gradientColors={[
                "#0C0E1D",
                "#1a0533",
                "#2d1b69",
                "#1e3a8a",
                "#312e81",
                "#0C0E1D",
              ]}
              gradientStops={[0, 30, 50, 65, 80, 100]}
              containerClassName="opacity-10"
            />
          </div>

          {/* Infinite Grid Background */}
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <InfiniteGrid />
          </div>

          {/* Navbar */}
          <header className="relative z-50 w-full pt-6 px-6">
            <nav className="mx-auto max-w-5xl rounded-full border border-white/10 flex items-center justify-between px-8 py-3" aria-label="Navegação principal">
              <a href="#" className="flex items-center group">
                <img src="/logo-conoti.png" alt="Conoti" className="h-4 w-auto opacity-90 group-hover:opacity-100 transition-opacity duration-200" />
              </a>

              {/* Desktop Nav */}
              <div className="hidden md:flex md:items-center md:gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white rounded-full hover:bg-white/5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500"
                  >
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="hidden md:flex md:items-center md:gap-4">
                <a
                  href="#contact"
                  className="badge-glass text-purple-300 hover:text-white hover:bg-white/10 hover:border-purple-400/30 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_24px_rgba(147,51,234,0.3)] transition-all duration-200 cursor-pointer normal-case tracking-normal text-sm"
                >
                  Agendar Consultoria
                </a>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden flex h-11 w-11 items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-purple-500"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </nav>

            {/* Mobile Nav */}
            <AnimatePresence>
              {isMenuOpen && (
                <M
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-2xl mt-3 px-8 py-6 space-y-4"
                >
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block text-lg font-bold text-slate-400 hover:text-white transition-colors duration-200 py-1"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="flex flex-col gap-4 pt-4">
                    <a
                      href="#contact"
                      className="block w-full rounded-2xl bg-purple-600/40 backdrop-blur-xl border border-purple-400/20 py-4 text-center font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_20px_rgba(147,51,234,0.3)] cursor-pointer hover:bg-purple-500/50 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Agendar Consultoria
                    </a>
                  </div>
                </M>
              )}
            </AnimatePresence>
          </header>

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-12 lg:pt-20">
            <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center justify-items-center">
              <M
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="badge-glass text-purple-400 mb-8 backdrop-blur-md">
                  <Sparkles size={14} className="text-purple-400" />
                  <span>Hub de Soluções TikTok</span>
                </div>
                <h1 className="font-heading text-5xl font-bold tracking-tight text-white sm:text-7xl leading-[1.05]">
                  Escale no TikTok.<br /><span className="text-gradient-purple">Do criativo à venda.</span>
                </h1>
                <p className="mt-8 text-lg text-slate-400 leading-relaxed max-w-lg">
                  A Conoti é o hub completo de TikTok para sua marca. De criativos a loja, de ads a estratégia — escalamos cada frente com IA, dados e 20k+ especialistas.
                </p>
                <div className="mt-12 flex flex-col sm:flex-row gap-5">
                  <a
                    href="#contact"
                    className="group relative inline-flex items-center justify-center rounded-full bg-white px-12 py-5 text-lg font-bold text-[#0C0E1D] shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-200 hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400"
                  >
                    Iniciar Projeto
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={22} />
                  </a>
                  <a
                    href="#results"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-10 py-5 text-lg font-bold text-white backdrop-blur-md hover:bg-white/10 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                  >
                    Casos de Estudo
                  </a>
                </div>

                <div className="mt-12 flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-[#0C0E1D] bg-slate-800 overflow-hidden ring-1 ring-white/10">
                        <img
                          src={`https://picsum.photos/seed/conoti${i}/100/100`}
                          alt={`Creator ${i}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="h-10 w-px bg-white/10" aria-hidden="true" />
                  <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                    <span className="text-white font-bold">20k+</span> Especialistas
                  </p>
                </div>
              </M>

              {/* Spline 3D Scene */}
              <SplineHero />
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="border-y border-white/5 relative" aria-label="Marcas parceiras">
          <div className="grid grid-cols-4 md:grid-cols-8">
            {partnerLogos.map((logo) => (
              <div
                key={logo.alt}
                className="flex items-center justify-center py-8 md:py-10 border-r border-white/5 last:border-r-0 hover:bg-white/[0.02] transition-colors duration-300"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-4 md:h-5 select-none brightness-0 invert opacity-25 hover:opacity-60 transition-opacity duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section id="serviços" className="py-28 lg:py-44 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <M
              {...(mobile ? {} : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } })}
              className="text-center mb-20"
            >
              <div className="badge-glass text-purple-400 mb-6 backdrop-blur-md mx-auto">
                <Sparkles size={14} />
                <span>Nossa Metodologia</span>
              </div>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl tracking-tighter mb-4">
                Muitas pessoas nos perguntam <br />
                <span className="text-gradient-purple">Como isso é Possível.</span>
              </h2>
              <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto leading-relaxed">
                Vamos mergulhar nos pilares que sustentam nossos resultados no TikTok.
              </p>
            </M>

            {/* Cards - full bleed lines */}
            <div className="relative left-1/2 -translate-x-1/2 w-screen">
              {/* Vertical lines with fade - aligned with card content edges */}
              <div className="absolute -top-20 -bottom-20 left-1/2 -translate-x-[min(40rem,48vw)] w-px pointer-events-none" aria-hidden="true">
                <div className="absolute top-0 h-16 w-full bg-gradient-to-b from-transparent to-white/[0.06]" />
                <div className="absolute top-16 bottom-16 w-full bg-white/[0.06]" />
                <div className="absolute bottom-0 h-16 w-full bg-gradient-to-t from-transparent to-white/[0.06]" />
              </div>
              <div className="absolute -top-20 -bottom-20 left-1/2 translate-x-[min(40rem,48vw)] w-px pointer-events-none" aria-hidden="true">
                <div className="absolute top-0 h-16 w-full bg-gradient-to-b from-transparent to-white/[0.06]" />
                <div className="absolute top-16 bottom-16 w-full bg-white/[0.06]" />
                <div className="absolute bottom-0 h-16 w-full bg-gradient-to-t from-transparent to-white/[0.06]" />
              </div>

              <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06) 8%, rgba(255,255,255,0.06) 92%, transparent)' }} />
              {[
                {
                  title: "Setup Completo",
                  desc: "Fazemos todas as integrações necessárias para seu e-commerce rodar do zero — pixel, catálogo, eventos e automações — garantindo ao menos 20% a mais de faturamento já nos primeiros ciclos.",
                  icon: <BarChart3 className="text-purple-400" size={24} />,
                  stat: "+20%",
                  statLabel: "mais faturamento",
                  color: "text-purple-400",
                },
                {
                  title: "Eficiência de Verba",
                  desc: "Crescimento sem desperdício. Implementamos o setup ideal para escalar seu resultado com menos de 15% a mais de investimento, usando o máximo de cada real na plataforma.",
                  icon: <Zap className="text-blue-400" size={24} />,
                  stat: "<15%",
                  statLabel: "a mais de verba",
                  color: "text-blue-400",
                },
                {
                  title: "TikTok Business Total",
                  desc: "Exploramos 100% do TikTok Business — do tráfego pago ao orgânico — para trazer ao menos 50% mais usuários qualificados ao site, otimizando para o TikTok virar fixo na sua operação.",
                  icon: <Sparkles className="text-emerald-400" size={24} />,
                  stat: "+50%",
                  statLabel: "usuários no site",
                  color: "text-emerald-400",
                }
              ].map((service, index) => (
                <div key={index}>
                  <M
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative flex items-center justify-between gap-8 mx-auto max-w-7xl px-10 lg:px-12 py-10 transition-all duration-300 hover:bg-white/[0.03]"
                  >
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 before:absolute before:-inset-1.5 before:rounded-[1.1rem] before:border before:border-white/5 group-hover:border-white/20 transition-all duration-300">
                        <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${service.color === 'text-purple-400' ? 'bg-purple-500/10' : service.color === 'text-blue-400' ? 'bg-blue-500/10' : 'bg-emerald-500/10'}`} />
                        <div className="relative z-10">{service.icon}</div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-heading text-lg font-bold text-white mb-1">{service.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{service.desc}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-heading text-3xl font-bold ${service.color}`}>{service.stat}</p>
                      <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{service.statLabel}</p>
                    </div>
                  </M>
                  <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06) 8%, rgba(255,255,255,0.06) 92%, transparent)' }} />
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Process Section - Bento Grid */}
        <section id="processo" className="py-28 lg:py-44 relative">
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="mx-auto max-w-5xl px-6 lg:px-8 relative z-10">
            <M
              {...(mobile ? {} : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } })}
              className="text-center mb-20"
            >
              <div className="badge-glass text-emerald-400 mb-6 backdrop-blur-md mx-auto">
                <Rocket size={14} />
                <span>Por Dentro da Máquina</span>
              </div>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                O Motor por Trás da <span className="text-gradient-neon">Sua Escala</span>
              </h2>
              <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto leading-relaxed">
                Cada peça do nosso sistema trabalha junto para transformar investimento em receita previsível.
              </p>
            </M>

            <div className="grid grid-cols-6 gap-3">
              {/* Card 1 — Big stat */}
              <M
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="col-span-full lg:col-span-2 rounded-3xl border border-white/5 bg-white/[0.02] p-8 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(147,51,234,0.08)]"
              >
                <div className="relative flex h-24 w-56 items-center">
                  <svg className="text-white/5 absolute inset-0 size-full" viewBox="0 0 254 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M112.891 97.7022C140.366 97.0802 171.004 94.6715 201.087 87.5116C210.43 85.2881 219.615 82.6412 228.284 78.2473C232.198 76.3179 235.905 73.9942 239.348 71.3124C241.85 69.2557 243.954 66.7571 245.555 63.9408C249.34 57.3235 248.281 50.5341 242.498 45.6109C239.033 42.7237 235.228 40.2703 231.169 38.3054C219.443 32.7209 207.141 28.4382 194.482 25.534C184.013 23.1927 173.358 21.7755 162.64 21.2989C161.376 21.3512 160.113 21.181 158.908 20.796C158.034 20.399 156.857 19.1682 156.962 18.4535C157.115 17.8927 157.381 17.3689 157.743 16.9139C158.104 16.4588 158.555 16.0821 159.067 15.8066C160.14 15.4683 161.274 15.3733 162.389 15.5286C179.805 15.3566 196.626 18.8373 212.998 24.462C220.978 27.2494 228.798 30.4747 236.423 34.1232C240.476 36.1159 244.202 38.7131 247.474 41.8258C254.342 48.2578 255.745 56.9397 251.841 65.4892C249.793 69.8582 246.736 73.6777 242.921 76.6327C236.224 82.0192 228.522 85.4602 220.502 88.2924C205.017 93.7847 188.964 96.9081 172.738 99.2109C153.442 101.949 133.993 103.478 114.506 103.79C91.1468 104.161 67.9334 102.97 45.1169 97.5831C36.0094 95.5616 27.2626 92.1655 19.1771 87.5116C13.839 84.5746 9.1557 80.5802 5.41318 75.7725C-0.54238 67.7259 -1.13794 59.1763 3.25594 50.2827C5.82447 45.3918 9.29572 41.0315 13.4863 37.4319C24.2989 27.5721 37.0438 20.9681 50.5431 15.7272C68.1451 8.8849 86.4883 5.1395 105.175 2.83669C129.045 0.0992292 153.151 0.134761 177.013 2.94256C197.672 5.23215 218.04 9.01724 237.588 16.3889C240.089 17.3418 242.498 18.5197 244.933 19.6446C246.627 20.4387 247.725 21.6695 246.997 23.615C246.455 25.1105 244.814 25.5605 242.63 24.5811C230.322 18.9961 217.233 16.1904 204.117 13.4376C188.761 10.3438 173.2 8.36665 157.558 7.52174C129.914 5.70776 102.154 8.06792 75.2124 14.5228C60.6177 17.8788 46.5758 23.2977 33.5102 30.6161C26.6595 34.3329 20.4123 39.0673 14.9818 44.658C12.9433 46.8071 11.1336 49.1622 9.58207 51.6855C4.87056 59.5336 5.61172 67.2494 11.9246 73.7608C15.2064 77.0494 18.8775 79.925 22.8564 82.3236C31.6176 87.7101 41.3848 90.5291 51.3902 92.5804C70.6068 96.5773 90.0219 97.7419 112.891 97.7022Z" fill="currentColor" />
                  </svg>
                  <span className="mx-auto block w-fit font-heading text-5xl font-bold text-white">100%</span>
                </div>
                <h3 className="mt-6 font-heading text-2xl font-bold text-white">Zero Achismo</h3>
                <p className="mt-2 text-sm text-slate-400">Cada decisão é validada por dados de 326k+ anúncios reais antes de ir ao ar.</p>
              </M>

              {/* Card 2 — Auditoria */}
              <M
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="col-span-full sm:col-span-3 lg:col-span-2 rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(147,51,234,0.08)]"
              >
                <div className="relative mx-auto flex aspect-square size-28 rounded-full border border-white/10 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5">
                  <Search className="m-auto text-purple-400" size={40} strokeWidth={1.5} />
                </div>
                <div className="mt-6 text-center space-y-2">
                  <h3 className="font-heading text-lg font-bold text-white">Diagnóstico da Conta</h3>
                  <p className="text-sm text-slate-400">Raio-X completo: conta, concorrentes, público e oportunidades que ninguém viu.</p>
                </div>
              </M>

              {/* Card 3 — Criativos */}
              <M
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="col-span-full sm:col-span-3 lg:col-span-2 rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(147,51,234,0.08)]"
              >
                <div className="pt-4 lg:px-4">
                  {/* Mini chart SVG */}
                  <div className="relative h-24 w-full overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-3">
                    <div className="flex items-end justify-between h-full gap-1">
                      {[35, 50, 42, 65, 55, 78, 60, 85, 70, 92, 80, 95].map((h, i) => (
                        IS_MOBILE ? (
                          <div
                            key={i}
                            style={{ height: `${h}%` }}
                            className="flex-1 rounded-sm bg-gradient-to-t from-purple-600 to-purple-400"
                          />
                        ) : (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
                            className="flex-1 rounded-sm bg-gradient-to-t from-purple-600 to-purple-400"
                          />
                        )
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center space-y-2">
                  <h3 className="font-heading text-lg font-bold text-white">Produção & Teste A/B</h3>
                  <p className="text-sm text-slate-400">IA gera scripts com hooks de 3s, produzimos os criativos e testamos variações até achar os winners.</p>
                </div>
              </M>

              {/* Card 4 — Escala (wide) */}
              <M
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="col-span-full lg:col-span-3 rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(147,51,234,0.08)]"
              >
                <div className="grid h-full sm:grid-cols-2">
                  <div className="relative z-10 flex flex-col justify-between space-y-8 p-8">
                    <div className="relative flex aspect-square size-12 rounded-full border border-white/10 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5">
                      <TrendingUp className="m-auto text-emerald-400" size={20} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-lg font-bold text-white">Escala Inteligente</h3>
                      <p className="text-sm text-slate-400">Winners identificados? O budget migra automaticamente. CPA cai, ROAS sobe — sem intervenção manual.</p>
                    </div>
                  </div>
                  <div className="relative border-l border-white/5 p-6 sm:-my-0">
                    <div className="absolute left-3 top-2 flex gap-1">
                      <span className="block size-2 rounded-full bg-white/10"></span>
                      <span className="block size-2 rounded-full bg-white/10"></span>
                      <span className="block size-2 rounded-full bg-white/10"></span>
                    </div>
                    <div className="flex flex-col justify-center h-full space-y-4 pt-4">
                      {[
                        { label: "CPA", value: "-66%", color: "text-emerald-400" },
                        { label: "CTR", value: "9x", color: "text-purple-400" },
                        { label: "ROAS", value: "4.2x", color: "text-blue-400" },
                      ].map((metric, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{metric.label}</span>
                          <span className={`font-heading text-lg font-bold ${metric.color}`}>{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </M>

              {/* Card 5 — Monitoramento (wide) */}
              <M
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="col-span-full lg:col-span-3 rounded-3xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(147,51,234,0.08)]"
              >
                <div className="grid h-full sm:grid-cols-2">
                  <div className="relative z-10 flex flex-col justify-between space-y-8 p-8">
                    <div className="relative flex aspect-square size-12 rounded-full border border-white/10 before:absolute before:-inset-2 before:rounded-full before:border before:border-white/5">
                      <BarChart3 className="m-auto text-blue-400" size={20} strokeWidth={1.5} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-heading text-lg font-bold text-white">Controle em Tempo Real</h3>
                      <p className="text-sm text-slate-400">Conectado direto ao TikTok Ads Manager via API. Cada métrica monitorada, cada ajuste em segundos.</p>
                    </div>
                  </div>
                  <div className="relative border-l border-white/5 p-6">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">Status ao vivo</p>
                    <div className="flex flex-col justify-center h-full space-y-2">
                      {[
                        { name: "Campanha A", status: "Escalando", dot: "bg-emerald-500" },
                        { name: "Campanha B", status: "Testando", dot: "bg-blue-500" },
                        { name: "Criativo #47", status: "Winner", dot: "bg-purple-500" },
                        { name: "Campanha C", status: "Pausada", dot: "bg-slate-500" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-4 py-3">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${item.dot}`} />
                          <span className="text-sm font-medium text-slate-300 flex-1 truncate">{item.name}</span>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </M>
            </div>
          </div>
        </section>

        {/* Spinning Sticker Divider */}
        <div className="relative z-20 flex justify-center -mb-[45px]">
          <M
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <svg width="90" height="90" viewBox="0 0 90 90" className="text-white">
              <circle cx="45" cy="45" r="43" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.15" />
              <circle cx="45" cy="45" r="35" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1" />
              <g transform="translate(35, 35)" stroke="#A855F7" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="10" cy="10" r="10" />
                <line x1="0" y1="10" x2="20" y2="10" />
                <path d="M10 0a15 15 0 0 1 0 20a15 15 0 0 1 0-20" />
              </g>
              <defs>
                <path id="textCircle" d="M 45,45 m -32,0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0" />
              </defs>
              <text className="fill-white/40" style={{ fontSize: '7.5px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>
                <textPath href="#textCircle">
                  CONOTI • GROWTH • SCALE • TIKTOK ADS •{' '}
                </textPath>
              </text>
            </svg>
          </M>
        </div>

        {/* CTA Banner */}
        <section className="pt-20 pb-28 lg:pt-28 lg:pb-44 relative overflow-hidden border-y border-white/5">
          {/* Layered background */}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-[#0C0E1D] to-purple-950/20 pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <InfiniteGrid />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" aria-hidden="true" />
          <div className="absolute top-0 left-[20%] w-[300px] h-[300px] rounded-full bg-fuchsia-600/8 blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 right-[20%] w-[300px] h-[300px] rounded-full bg-blue-600/8 blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="mx-auto max-w-4xl px-6 relative z-10 text-center">
            <M
              {...(mobile ? {} : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } })}
            >
              <h2 className="font-heading text-4xl font-bold text-white sm:text-6xl tracking-tighter leading-tight mb-6">
                Seu Hub Completo de{' '}
                <span className="inline-flex align-middle mx-1 rounded-2xl overflow-hidden h-9 sm:h-12 w-20 sm:w-28 relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-600 animate-[spin_6s_linear_infinite] scale-150 blur-sm" />
                  <span className="absolute inset-0 bg-gradient-to-br from-purple-500/80 via-pink-500/60 to-indigo-600/80 backdrop-blur-sm" />
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.2),transparent_60%)]" />
                </span>
                {' '}<span className="text-gradient-purple">TikTok Ads, Shop e Business</span>
              </h2>
              <p className="text-slate-400 font-medium text-lg max-w-2xl mx-auto leading-relaxed mb-10">
                De criativos a loja, de ads a estratégia. A Conoti conecta todas as frentes do TikTok para sua marca escalar.
              </p>
              <div className="flex items-center justify-center">
                <a
                  href="#contact"
                  className="rounded-full bg-purple-600/40 backdrop-blur-xl border border-purple-400/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_24px_rgba(147,51,234,0.3)] px-12 py-5 text-lg font-bold text-white hover:bg-purple-500/50 hover:border-purple-400/30 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_40px_rgba(147,51,234,0.4)] transition-all duration-200 cursor-pointer"
                >
                  Começar Agora
                </a>
              </div>
            </M>
          </div>
        </section>

        {/* Autopilot Toggle Section */}
        <AutopilotSection />

        {/* Transition Zone: Marquee + Gradient bridge into Results */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-purple-950/30 pointer-events-none" aria-hidden="true" />
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" aria-hidden="true" />

          <div className="relative z-10 py-10">
            <div className="py-5">
              <InfiniteSlider gap={0} duration={120} direction="horizontal">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="flex items-center gap-6 whitespace-nowrap text-sm tracking-widest uppercase mx-6">
                    <span className="text-slate-500">Sua Escala é Nossa Missão</span>
                    <span className="text-purple-500/40">✦</span>
                    <span className="font-bold text-white">Hub Completo TikTok</span>
                    <span className="text-purple-500/40">✦</span>
                    <span className="text-slate-500">Ads, Shop & Business</span>
                    <span className="text-purple-500/40">✦</span>
                    <span className="font-bold text-white">+200 Marcas Escaladas</span>
                    <span className="text-purple-500/40">✦</span>
                    <span className="text-slate-500">Do Criativo à Venda</span>
                    <span className="text-purple-500/40">✦</span>
                    <span className="font-bold text-white">20k+ Especialistas</span>
                    <span className="text-purple-500/40">✦</span>
                  </span>
                ))}
              </InfiniteSlider>
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" aria-hidden="true" />
        </div>

        {/* Results Section */}
        <section id="results" className="py-32 lg:py-52 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-[#0C0E1D] to-purple-950/20 pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <InfiniteGrid />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" aria-hidden="true" />
          <div className="absolute top-0 left-[20%] w-[300px] h-[300px] rounded-full bg-fuchsia-600/8 blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 right-[20%] w-[300px] h-[300px] rounded-full bg-blue-600/8 blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <M
              {...(mobile ? {} : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } })}
              className="text-center mb-20"
            >
              <div className="badge-glass text-emerald-400 mb-6 backdrop-blur-md mx-auto">
                <TrendingUp size={14} />
                <span>Números Reais</span>
              </div>
              <h2 className="font-heading text-4xl font-bold text-white sm:text-6xl tracking-tighter mb-4">
                O que Acontece Quando a <span className="text-gradient-purple">Conoti Assume.</span>
              </h2>
              <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto leading-relaxed">
                Resultados reais de marcas que confiaram no nosso hub de soluções TikTok.
              </p>
            </M>

            <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
              {/* Left bento - Stats (bigger) */}
              <M
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-white/5 bg-white/[0.02] p-10 lg:p-14 relative overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(147,51,234,0.08)]"
              >
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-600/5 to-transparent pointer-events-none" aria-hidden="true" />
                <div className="relative z-10">
                  <p className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-14">Métricas do último ano</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-12">
                    {[
                      { label: "Investido em Ads", value: "R$1.6M+", color: "text-purple-400" },
                      { label: "Faturado p/ Clientes", value: "R$6.6M+", color: "text-emerald-400" },
                      { label: "ROAS Geral", value: "4.13x", color: "text-blue-400" },
                      { label: "Conversões Totais", value: "69.262", color: "text-orange-400" },
                      { label: "Marcas Vinculadas", value: "40+", color: "text-fuchsia-400" },
                      { label: "Criativos em Média", value: "7mil+", color: "text-cyan-400" },
                    ].map((stat, i) => (
                      <M
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="space-y-2"
                      >
                        <p className={`font-heading text-3xl lg:text-4xl font-bold ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                      </M>
                    ))}
                  </div>
                </div>
              </M>

              {/* Right bento - Testimonials (2 cards) */}
              <div className="grid gap-4 grid-rows-2 h-full">
                {[
                  {
                    name: "Ricardo Santos",
                    role: "CEO @ TechBrand",
                    text: "O TikTok passou de experimental para nossa maior fonte de receita em tempo recorde.",
                    seed: "ceo-dark"
                  },
                  {
                    name: "Ana Oliveira",
                    role: "CMO @ FashionHub",
                    text: "Nossas campanhas de UGC nunca performaram tão bem. Criatividade inigualável.",
                    seed: "ana"
                  },
                ].map((testimonial, i) => (
                  <MFigure
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 flex flex-col justify-between transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(147,51,234,0.08)] h-full"
                  >
                    <blockquote>
                      <p className="text-sm font-medium leading-relaxed text-slate-300 mb-6">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>
                    </blockquote>
                    <figcaption className="flex items-center gap-3">
                      <img
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-purple-500/30"
                        src={`https://picsum.photos/seed/${testimonial.seed}/100/100`}
                        alt={`Foto de ${testimonial.name}`}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <p className="font-bold text-white text-xs">{testimonial.name}</p>
                        <p className="text-purple-400 text-[9px] font-bold uppercase tracking-wider">{testimonial.role}</p>
                      </div>
                    </figcaption>
                  </MFigure>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-28 lg:py-44 relative">
          <div className="mx-auto max-w-3xl px-6 lg:px-8 relative z-10">
            <M
              {...(mobile ? {} : { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } })}
              className="text-center mb-16"
            >
              <div className="badge-glass text-purple-400 mb-6 backdrop-blur-md mx-auto">
                <Sparkles size={14} />
                <span>Tire Suas Dúvidas</span>
              </div>
              <h2 className="font-heading text-4xl font-bold text-white sm:text-6xl tracking-tighter mb-4">
                Perguntas <span className="text-gradient-purple">Frequentes</span>
              </h2>
            </M>

            <div className="space-y-3">
              {[
                {
                  q: "O que a Conoti faz exatamente?",
                  a: "Somos um hub completo de soluções para TikTok. Cuidamos de Ads (criativos + mídia), Shop (sua loja dentro do TikTok) e Business (estratégia de presença e conteúdo). Tudo integrado, com IA e dados."
                },
                {
                  q: "Preciso já ter uma conta no TikTok Ads?",
                  a: "Não. Criamos e configuramos tudo do zero se necessário — conta, pixel, catálogo de produtos e estrutura de campanhas. Se já tiver, fazemos uma auditoria completa antes de começar."
                },
                {
                  q: "Qual o investimento mínimo em mídia?",
                  a: "Recomendamos a partir de R$5.000/mês em mídia para ter volume suficiente de dados e testes. Para operações de TikTok Shop, o investimento pode variar conforme o catálogo."
                },
                {
                  q: "Em quanto tempo vejo resultados?",
                  a: "Os primeiros criativos entram em teste na primeira semana. Resultados consistentes de escala geralmente aparecem entre 30 e 45 dias, quando já temos dados suficientes para otimizar com IA."
                },
                {
                  q: "Vocês produzem os criativos ou eu preciso fornecer?",
                  a: "Nós produzimos tudo. Temos uma rede de 20k+ criadores e uma IA que gera scripts otimizados para os primeiros 3 segundos. Você só aprova."
                },
                {
                  q: "Como funciona o TikTok Shop?",
                  a: "É a loja nativa dentro do TikTok. O usuário vê o produto no vídeo e compra sem sair do app. Configuramos sua loja, catálogo, logística e estratégia de conteúdo para vender direto no feed."
                },
              ].map((item, i) => (
                <FaqItem key={i} question={item.q} answer={item.a} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Form Section - Multi-step */}
        <section id="contact" className="py-28 lg:py-44 relative overflow-hidden border-y border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-[#0C0E1D] to-purple-950/20 pointer-events-none" aria-hidden="true" />
          <div className="absolute inset-0 z-0" aria-hidden="true">
            <InfiniteGrid />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" aria-hidden="true" />
          <div className="absolute top-0 left-[20%] w-[300px] h-[300px] rounded-full bg-fuchsia-600/8 blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="absolute bottom-0 right-[20%] w-[300px] h-[300px] rounded-full bg-blue-600/8 blur-[120px] pointer-events-none" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-2xl">
              <M
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <div className="badge-glass text-blue-400 mb-6 backdrop-blur-md mx-auto">
                  <ArrowRight size={14} />
                  <span>Comece Agora</span>
                </div>
                <h2 className="font-heading text-4xl font-bold text-white sm:text-6xl tracking-tighter mb-4">Cadastre-se e receba o contato do nosso time em até 24 horas</h2>
                <p className="text-slate-400 font-medium text-lg">Preencha os dados abaixo para receber sua análise gratuita.</p>
              </M>

              <div className="glass-dark rounded-[2.5rem] p-8 lg:p-12 ring-1 ring-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-600/5 to-transparent pointer-events-none" aria-hidden="true" />

                {formStatus === 'success' ? (
                  <M
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-10 relative z-10"
                    role="status"
                  >
                    <div className="mb-8 rounded-full bg-emerald-500/20 p-6 text-emerald-400 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 size={64} />
                    </div>
                    <h3 className="font-heading text-3xl font-bold text-white mb-4 tracking-tight">Recebemos seus dados!</h3>
                    <p className="text-slate-400 text-lg">Nosso time entra em contato em até 24 horas.</p>
                    <button
                      onClick={() => { setFormStatus('idle'); setFormStep(0); }}
                      className="mt-10 text-purple-400 font-bold hover:text-purple-300 transition-colors duration-200 uppercase tracking-widest text-sm cursor-pointer"
                    >
                      Enviar novamente
                    </button>
                  </M>
                ) : (
                  <div className="relative z-10">
                    {/* Progress bar */}
                    <div className="flex items-center gap-3 mb-10">
                      {['Seus dados', 'Sua empresa', 'Investimento'].map((label, i) => (
                        <div key={i} className="flex-1">
                          <div className={`h-1.5 rounded-full transition-all duration-500 ${formStep >= i ? 'bg-purple-600' : 'bg-white/10'}`} />
                          <p className={`mt-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${formStep >= i ? 'text-purple-400' : 'text-slate-600'}`}>{label}</p>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                      <AnimatePresence mode="wait">
                        {formStep === 0 && (
                          <M
                            key="step-0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <div className="space-y-3">
                              <label htmlFor={nameId} className="text-xs font-bold text-slate-500 uppercase tracking-widest">Seu nome</label>
                              <input id={nameId} required type="text" autoComplete="name" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200" placeholder="Nome completo" />
                            </div>
                            <div className="space-y-3">
                              <label htmlFor={emailId} className="text-xs font-bold text-slate-500 uppercase tracking-widest">E-mail</label>
                              <input id={emailId} required type="email" autoComplete="email" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200" placeholder="email@empresa.com" />
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">WhatsApp</label>
                              <input type="tel" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200" placeholder="(11) 99999-9999" />
                            </div>
                            <button type="button" onClick={() => setFormStep(1)} className="w-full rounded-2xl bg-purple-600/40 backdrop-blur-xl border border-purple-400/20 py-4 text-base font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_20px_rgba(147,51,234,0.3)] cursor-pointer hover:bg-purple-500/50 transition-all duration-200 flex items-center justify-center gap-2">
                              Próximo <ArrowRight size={18} />
                            </button>
                          </M>
                        )}

                        {formStep === 1 && (
                          <M
                            key="step-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nome da empresa</label>
                              <input type="text" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200" placeholder="Sua empresa" />
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Segmento</label>
                              <select className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 appearance-none cursor-pointer">
                                <option className="bg-[#0C0E1D]">E-commerce</option>
                                <option className="bg-[#0C0E1D]">Infoproduto</option>
                                <option className="bg-[#0C0E1D]">SaaS / App</option>
                                <option className="bg-[#0C0E1D]">Serviços</option>
                                <option className="bg-[#0C0E1D]">Varejo Físico</option>
                                <option className="bg-[#0C0E1D]">Outro</option>
                              </select>
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Já anuncia no TikTok?</label>
                              <div className="grid grid-cols-2 gap-3">
                                {['Sim, ativamente', 'Já testei', 'Nunca anunciei', 'Só no Meta/Google'].map((opt) => (
                                  <label key={opt} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-5 py-3.5 cursor-pointer hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-200">
                                    <input type="radio" name="tiktok_experience" value={opt} className="accent-purple-600" />
                                    <span className="text-sm text-slate-300">{opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <button type="button" onClick={() => setFormStep(0)} className="flex-1 rounded-2xl border border-white/10 py-4 text-base font-bold text-slate-400 hover:text-white hover:border-white/20 transition-all duration-200 cursor-pointer">
                                Voltar
                              </button>
                              <button type="button" onClick={() => setFormStep(2)} className="flex-[2] rounded-2xl bg-purple-600/40 backdrop-blur-xl border border-purple-400/20 py-4 text-base font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_20px_rgba(147,51,234,0.3)] cursor-pointer hover:bg-purple-500/50 transition-all duration-200 flex items-center justify-center gap-2">
                                Próximo <ArrowRight size={18} />
                              </button>
                            </div>
                          </M>
                        )}

                        {formStep === 2 && (
                          <M
                            key="step-2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <div className="space-y-3">
                              <label htmlFor={budgetId} className="text-xs font-bold text-slate-500 uppercase tracking-widest">Investimento mensal em ads</label>
                              <select id={budgetId} onChange={(e) => setIsHighBudget(e.target.value === 'above100k')} className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 appearance-none cursor-pointer">
                                <option value="below5k" className="bg-[#0C0E1D]">Menos de R$ 5.000</option>
                                <option value="5k-10k" className="bg-[#0C0E1D]">R$ 5.000 - R$ 10.000</option>
                                <option value="10k-50k" className="bg-[#0C0E1D]">R$ 10.000 - R$ 50.000</option>
                                <option value="50k-100k" className="bg-[#0C0E1D]">R$ 50.000 - R$ 100.000</option>
                                <option value="above100k" className="bg-[#0C0E1D]">Acima de R$ 100.000</option>
                              </select>
                            </div>

                            <AnimatePresence mode="wait">
                              {isHighBudget ? (
                                <M
                                  key="vip"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.3 }}
                                  className="space-y-6"
                                >
                                  <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.06] p-5 text-center">
                                    <p className="text-sm font-bold text-purple-400 mb-1">Atendimento Prioritário</p>
                                    <p className="text-xs text-slate-400">Deixe seus dados abaixo. A Conoti entrará em contato diretamente com você.</p>
                                  </div>
                                  <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Seu nome completo</label>
                                    <input type="text" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200" placeholder="Nome completo" />
                                  </div>
                                  <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">WhatsApp</label>
                                    <input type="tel" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200" placeholder="(11) 99999-9999" />
                                  </div>
                                  <div className="space-y-3">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">E-mail corporativo</label>
                                    <input type="email" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200" placeholder="email@empresa.com" />
                                  </div>
                                </M>
                              ) : (
                                <M
                                  key="standard"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.3 }}
                                  className="space-y-3"
                                >
                                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Qual seu maior desafio?</label>
                                  <textarea rows={4} className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 resize-none" placeholder="Ex: CPA alto, falta de criativos, dificuldade em escalar..." />
                                </M>
                              )}
                            </AnimatePresence>

                            <div className="flex gap-3">
                              <button type="button" onClick={() => setFormStep(1)} className="flex-1 rounded-2xl border border-white/10 py-4 text-base font-bold text-slate-400 hover:text-white hover:border-white/20 transition-all duration-200 cursor-pointer">
                                Voltar
                              </button>
                              <button type="submit" disabled={formStatus === 'submitting'} className="flex-[2] rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(147,51,234,0.2)] hover:shadow-[0_0_40px_rgba(147,51,234,0.3)] hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200">
                                {formStatus === 'submitting' ? 'Enviando...' : isHighBudget ? 'Solicitar Contato Direto' : 'Solicitar Análise Gratuita'}
                              </button>
                            </div>
                          </M>
                        )}
                      </AnimatePresence>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/5 overflow-hidden">
        {/* Radial gradient background */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/20 via-[#0C0E1D] to-transparent pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" aria-hidden="true" />

        {/* Top section - links */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="grid gap-12 md:grid-cols-3 items-center">
            <div>
              <img src="/logo-conoti.png" alt="Conoti" className="h-4 w-auto opacity-70" />
            </div>

            <nav className="flex justify-center gap-10 text-xs font-bold uppercase tracking-widest text-slate-500" aria-label="Links legais">
              <a href="#" className="hover:text-white transition-colors duration-200 cursor-pointer">Termos</a>
              <a href="#" className="hover:text-white transition-colors duration-200 cursor-pointer">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors duration-200 cursor-pointer">Cookies</a>
            </nav>

            <p className="text-xs font-medium text-slate-600 tracking-wide md:text-right">
              &copy; 2026 Conoti Growth Agency.
            </p>
          </div>
        </div>

        {/* Giant logo - bleeds out bottom */}
        <div className="relative z-10 overflow-hidden">
          <img
            src="/logo-conoti.png"
            alt=""
            aria-hidden="true"
            className="w-full max-w-7xl mx-auto px-6 opacity-[0.04] translate-y-[25%]"
          />
        </div>
      </footer>
    </div>
  );
}
