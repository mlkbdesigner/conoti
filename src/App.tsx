import { useState, useEffect, useRef, useCallback, FormEvent, useId } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
import { LegalPage, LEGAL_PAGES } from './components/LegalPage';

const SPLINE_SCENE = 'https://prod.spline.design/rQbuhcAQugoIO41z/scene.splinecode';

function shouldLoadSpline(): boolean {
  if (typeof window === 'undefined') return false;
  const isMobile = window.innerWidth < 768;
  const isLowEnd = navigator.hardwareConcurrency <= 2;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  return !isMobile && !isLowEnd && !!gl;
}

const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;

function SplineHero() {
  // Mobile: show static PNG image instead of Spline 3D
  if (IS_MOBILE) {
    return (
      <div className="relative flex items-center justify-center">
        <img
          src="/hero-sphere.png"
          alt="Conoti 3D"
          className="w-full max-w-[340px] mx-auto h-auto"
          loading="eager"
        />
      </div>
    );
  }

  // Desktop: Spline 3D
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application>();
  const [loaded, setLoaded] = useState(false);
  const [canLoad, setCanLoad] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCanLoad(shouldLoadSpline());
  }, []);

  useEffect(() => {
    if (!canLoad || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const app = new Application(canvas);
    appRef.current = app;

    const timeout = setTimeout(() => {
      if (!appRef.current) setFailed(true);
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

  const showFallback = !canLoad || failed;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.3 }}
      className="relative flex items-center justify-center lg:py-0"
    >
      <div className="relative h-[450px] w-full sm:h-[520px] lg:h-[580px] overflow-hidden">
        {showFallback && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="glass rounded-[2rem] p-10 text-center shadow-[0_0_50px_rgba(147,51,234,0.2)] ring-1 ring-white/20 backdrop-blur-3xl">
              <p className="font-heading text-5xl font-bold text-white mb-1 tracking-tighter">+R$10M</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Gerados na Plataforma</p>
            </div>
          </div>
        )}

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
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">+R$10M Gerados</span>
            </div>
          </div>

          {/* Top-right */}
          <div className="absolute top-16 right-2">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
              <TrendingUp size={12} className="text-purple-600" />
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">+100 Marcas</span>
            </div>
          </div>

          {/* Bottom-left */}
          <div className="absolute bottom-16 left-2">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
              <Zap size={12} className="text-purple-600" />
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">Media Buyer Certificado</span>
            </div>
          </div>

          {/* Bottom-right */}
          <div className="absolute bottom-6 right-2">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-[0_0_20px_rgba(255,255,255,0.08)]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2L14.09 8.26L21 9.27L16 14.14L17.18 21.02L12 17.77L6.82 21.02L8 14.14L3 9.27L9.91 8.26L12 2Z" fill="#9333EA"/></svg>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-widest">Agência Oficial TikTok</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FaqItem({ question, answer, index }: { key?: number; question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
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
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-purple-400 text-xl font-light shrink-0"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-7 py-4 text-sm text-slate-400 leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const autopilotSteps = [
  { text: "Diagnóstico de conta, pixel e catálogo concluído" },
  { text: "TikTok Shop implementado e integração logística rodando" },
  { text: "Criativos roteirizados, produzidos e em teste A/B" },
  { text: "Mídia paga sob gestão de mídia buyer certificado" },
  { text: "Rede de afiliados distribuindo seu produto" },
  { text: "CPA, ROAS e GMV monitorados pelo gerente exclusivo" },
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
          <motion.h2
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
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-400 font-medium text-xl max-w-xl mx-auto leading-relaxed"
          >
            {isOn
              ? 'A Conoti está no controle — executando Ads, Shop e a rede de afiliados enquanto sua marca foca em produto e estratégia.'
              : 'Enquanto a Conoti executa Ads, Shop e a rede de afiliados, sua marca foca no que importa: produto e estratégia.'
            }
          </motion.p>
        </div>

        <div className="space-y-4">
          {autopilotSteps.map((step, i) => {
            const isComplete = completedSteps.includes(i);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0.3, y: 10 }}
                whileInView={{ opacity: isOn ? 1 : 0.3, y: 0 }}
                viewport={{ once: false }}
                animate={isComplete ? { opacity: 1, y: 0 } : {}}
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
                    Ativo
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
  { src: "/logos/marini.png", alt: "Marini" },
  { src: "/logos/fozoco.png", alt: "Fozoco" },
  { src: "/logos/blox.png", alt: "Blox" },
  { src: "/logos/properjack.png", alt: "Proper Jack" },
];

const navItems = [
  { label: 'Serviços', href: '#serviços' },
  { label: 'Processo', href: '#processo' },
  { label: 'Resultados', href: '#results' },
  { label: 'FAQ', href: '#faq' },
];

function useHashRoute() {
  const [hash, setHash] = useState(typeof window !== 'undefined' ? window.location.hash : '');
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

export default function App() {
  const hash = useHashRoute();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formStep, setFormStep] = useState(0);
  const [isHighBudget, setIsHighBudget] = useState(false);
  const nameId = useId();
  const emailId = useId();
  const budgetId = useId();
  const messageId = useId();

  const legalSlug = hash.startsWith('#/') ? hash.slice(2) : '';
  if (legalSlug && legalSlug in LEGAL_PAGES) {
    return <LegalPage slug={legalSlug as keyof typeof LEGAL_PAGES} />;
  }

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
                <motion.div
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
                </motion.div>
              )}
            </AnimatePresence>
          </header>

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-12 lg:pt-20">
            <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center justify-items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="badge-glass text-purple-400 mb-8 backdrop-blur-md">
                  <Zap size={14} className="text-purple-400" />
                  <span>Agência Oficial TikTok</span>
                </div>
                <h1 className="font-heading text-5xl font-bold tracking-tight text-white sm:text-7xl leading-[1.05]">
                  Escale no TikTok.<br /><span className="text-gradient-purple">Do criativo à venda.</span>
                </h1>
                <p className="mt-8 text-lg text-slate-400 leading-relaxed max-w-lg">
                  A Conoti é a agência oficial TikTok para marcas que querem escalar com previsibilidade. Ads, Shop e Business operados por mídia buyers certificados, com gerente exclusivo e canal direto com a plataforma.
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
                    <span className="text-white font-bold">Time Dedicado</span> · Gerente de Contas Exclusivo
                  </p>
                </div>
              </motion.div>

              {/* Spline 3D Scene */}
              <SplineHero />
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="border-y border-white/5 relative" aria-label="Marcas parceiras">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {partnerLogos.map((logo) => (
              <div
                key={logo.alt}
                className="flex items-center justify-center py-8 md:py-10 border-r border-b md:border-b-0 border-white/10 last:border-r-0 hover:bg-white/[0.02] transition-colors duration-300"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-6 md:h-7 select-none brightness-0 invert opacity-30 hover:opacity-70 transition-opacity duration-300"
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <div className="badge-glass text-purple-400 mb-6 backdrop-blur-md mx-auto">
                <Sparkles size={14} />
                <span>Nossa Metodologia</span>
              </div>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl tracking-tighter mb-4">
                Muitas marcas chegam aqui perguntando <br />
                <span className="text-gradient-purple">Como a Conoti faz acontecer.</span>
              </h2>
              <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto leading-relaxed">
                A resposta está em três pilares que poucos no mercado conseguem entregar juntos.
              </p>
            </motion.div>

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
                  title: "Acesso Direto à Fonte",
                  desc: "Somos agência oficial TikTok. Isso significa atendimento prioritário, novidades em primeira mão e poder real para destravar contas, anúncios e bloqueios — coisa que agência comum não resolve.",
                  icon: <Zap className="text-purple-400" size={24} />,
                  stat: "Oficial",
                  statLabel: "agência tiktok",
                  color: "text-purple-400",
                },
                {
                  title: "Operação Completa",
                  desc: "Não somos só agência de ads. Cuidamos de mídia, TikTok Shop com GMV MAX, gestão de afiliados e estratégia de presença. Tudo dentro da casa, com um padrão único.",
                  icon: <Sparkles className="text-blue-400" size={24} />,
                  stat: "360°",
                  statLabel: "ads · shop · business",
                  color: "text-blue-400",
                },
                {
                  title: "Time Certificado, Gerente Exclusivo",
                  desc: "Mídia buyers certificados pelo TikTok e um gerente de contas exclusivo para cada cliente. Você fala com quem opera. Sem camadas, sem intermediário, sem ruído.",
                  icon: <CheckCircle2 className="text-emerald-400" size={24} />,
                  stat: "1:1",
                  statLabel: "gerente dedicado",
                  color: "text-emerald-400",
                }
              ].map((service, index) => (
                <div key={index}>
                  <motion.div
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
                  </motion.div>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <div className="badge-glass text-emerald-400 mb-6 backdrop-blur-md mx-auto">
                <Rocket size={14} />
                <span>Por Dentro da Máquina</span>
              </div>
              <h2 className="font-heading text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                O Motor por Trás da <span className="text-gradient-neon">Sua Escala no TikTok</span>
              </h2>
              <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto leading-relaxed">
                Cada peça do sistema converte investimento em receita previsível dentro da plataforma.
              </p>
            </motion.div>

            <div className="grid grid-cols-6 gap-3">
              {/* Card 1 — Big stat */}
              <motion.div
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
                  <span className="mx-auto block w-fit font-heading text-5xl font-bold text-white">360°</span>
                </div>
                <h3 className="mt-6 font-heading text-2xl font-bold text-white">Diagnóstico Completo</h3>
                <p className="mt-2 text-sm text-slate-400">Antes de gastar R$1, fazemos auditoria de conta, pixel, catálogo, concorrência e criativos atuais. Você enxerga o gargalo real antes de escalar qualquer coisa.</p>
              </motion.div>

              {/* Card 2 — Auditoria */}
              <motion.div
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
                  <h3 className="font-heading text-lg font-bold text-white">Implementação TikTok Shop</h3>
                  <p className="text-sm text-slate-400">Ativamos sua loja no TikTok do zero — catálogo, logística, integrações e GMV MAX configurado para escalar volume desde a primeira semana.</p>
                </div>
              </motion.div>

              {/* Card 3 — Criativos */}
              <motion.div
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
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.3 + i * 0.05 }}
                          className="flex-1 rounded-sm bg-gradient-to-t from-purple-600 to-purple-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center space-y-2">
                  <h3 className="font-heading text-lg font-bold text-white">Produção & Teste A/B</h3>
                  <p className="text-sm text-slate-400">Roteiros otimizados para prender nos primeiros 3 segundos. Produzimos os criativos, rodamos variações em teste A/B e identificamos os winners reais — sem achismo.</p>
                </div>
              </motion.div>

              {/* Card 4 — Escala (wide) */}
              <motion.div
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
                      <h3 className="font-heading text-lg font-bold text-white">Mídia Inteligente</h3>
                      <p className="text-sm text-slate-400">Identificou o winner? O budget migra. Mídia buyer certificado conduz a escala sem perder eficiência — e sem cair em bloqueio. Cada decisão validada por dados, não por palpite.</p>
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
                        { label: "ROAS", value: "Positivo", color: "text-emerald-400" },
                        { label: "CPA", value: "Otimizado", color: "text-purple-400" },
                        { label: "GMV", value: "Crescente", color: "text-blue-400" },
                      ].map((metric, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{metric.label}</span>
                          <span className={`font-heading text-lg font-bold ${metric.color}`}>{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 5 — Monitoramento (wide) */}
              <motion.div
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
                      <h3 className="font-heading text-lg font-bold text-white">Rede de Afiliados Ativa</h3>
                      <p className="text-sm text-slate-400">Distribuímos seu produto entre centenas de afiliados qualificados com gestão e otimização contínua. Mais GMV, menos esforço operacional do seu lado.</p>
                    </div>
                  </div>
                  <div className="relative border-l border-white/5 p-6">
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">Rede em operação</p>
                    <div className="flex flex-col justify-center h-full space-y-2">
                      {[
                        { name: "Afiliado A", status: "Ativo", dot: "bg-emerald-500" },
                        { name: "Afiliado B", status: "Convertendo", dot: "bg-blue-500" },
                        { name: "Criativo #47", status: "Winner", dot: "bg-purple-500" },
                        { name: "Afiliado C", status: "Em teste", dot: "bg-slate-500" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2.5">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${item.dot}`} />
                          <span className="text-xs font-medium text-slate-300 whitespace-nowrap">{item.name}</span>
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider ml-auto shrink-0 whitespace-nowrap">{item.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Spinning Sticker Divider */}
        <div className="relative z-20 flex justify-center -mb-[45px]">
          <motion.div
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
          </motion.div>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
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
                De criativos à loja, de mídia à estratégia. A Conoti opera todas as frentes do TikTok para sua marca crescer com método e suporte direto da plataforma.
              </p>
              <div className="flex items-center justify-center">
                <a
                  href="#contact"
                  className="rounded-full bg-purple-600/40 backdrop-blur-xl border border-purple-400/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_4px_24px_rgba(147,51,234,0.3)] px-12 py-5 text-lg font-bold text-white hover:bg-purple-500/50 hover:border-purple-400/30 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_40px_rgba(147,51,234,0.4)] transition-all duration-200 cursor-pointer"
                >
                  Começar Agora
                </a>
              </div>
            </motion.div>
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
                    <span className="font-bold text-white">Agência Oficial TikTok</span>
                    <span className="text-purple-500/40">✦</span>
                    <span className="text-slate-500">Ads, Shop & Business</span>
                    <span className="text-purple-500/40">✦</span>
                    <span className="font-bold text-white">+100 Marcas Atendidas</span>
                    <span className="text-purple-500/40">✦</span>
                    <span className="text-slate-500">Do Criativo à Venda</span>
                    <span className="text-purple-500/40">✦</span>
                    <span className="font-bold text-white">+R$10M Gerados na Plataforma</span>
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <div className="badge-glass text-emerald-400 mb-6 backdrop-blur-md mx-auto">
                <TrendingUp size={14} />
                <span>Resultados Reais</span>
              </div>
              <h2 className="font-heading text-4xl font-bold text-white sm:text-6xl tracking-tighter mb-4">
                Performance que <span className="text-gradient-purple">se Sustenta.</span>
              </h2>
              <p className="text-slate-400 font-medium text-lg max-w-xl mx-auto leading-relaxed">
                Marcas que confiaram na Conoti deixaram o achismo no passado.
              </p>
            </motion.div>

            <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
              {/* Left bento - Stats (bigger) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl border border-white/5 bg-white/[0.02] p-10 lg:p-14 relative overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(147,51,234,0.08)]"
              >
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-600/5 to-transparent pointer-events-none" aria-hidden="true" />
                <div className="relative z-10">
                  <p className="text-sm font-bold text-purple-400 uppercase tracking-[0.2em] mb-14">Números que falam por si</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 lg:gap-x-10 gap-y-10 sm:gap-y-12">
                    {[
                      { label: "Gerados na plataforma", value: "+R$10M", color: "text-emerald-400" },
                      { label: "Marcas atendidas", value: "+100", color: "text-purple-400" },
                      { label: "Agência TikTok", value: "Oficial", color: "text-blue-400" },
                      { label: "Gerente exclusivo", value: "Dedicado", color: "text-fuchsia-400" },
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        className="space-y-2 min-w-0"
                      >
                        <p className={`font-heading text-4xl sm:text-3xl lg:text-4xl font-bold tracking-tighter ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right bento - Real Cases Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 lg:p-6 flex flex-col gap-4 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-[0_0_30px_rgba(147,51,234,0.08)] h-full"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="badge-glass text-purple-300 text-[10px] normal-case tracking-normal">
                    <Sparkles size={10} />
                    Casos reais
                  </span>
                  <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">TikTok Ads Manager</span>
                </div>

                <Carousel className="flex-1 flex flex-col" opts={{ loop: true }}>
                  <CarouselContent>
                    {[
                      {
                        image: "/resultados/Resultados2.png",
                        period: "Dez 2024 — Jun 2025",
                        roas: "5,35x",
                        invested: "R$ 110K",
                        revenue: "R$ 589K",
                        purchases: "1.643",
                      },
                      {
                        image: "/resultados/Resultado1.png",
                        period: "Período completo",
                        roas: "7,01x",
                        invested: "R$ 153K",
                        revenue: "R$ 1,07M",
                        purchases: "4.257",
                      },
                      {
                        image: "/resultados/Resultado3.png",
                        period: "Conta gerenciada",
                        roas: "11,13x",
                        invested: "R$ 32K",
                        revenue: "R$ 361K",
                        purchases: "1.245",
                      },
                      {
                        image: "/resultados/Resultado4.png",
                        period: "Conta gerenciada",
                        roas: "5,32x",
                        invested: "R$ 320K",
                        revenue: "R$ 1,70M",
                        purchases: "—",
                      },
                      {
                        image: "/resultados/Resultado5.png",
                        period: "Conta gerenciada",
                        roas: "9,07x",
                        invested: "R$ 14K",
                        revenue: "R$ 127K",
                        purchases: "444",
                      },
                      {
                        image: "/resultados/Resultado6.png",
                        period: "Conta gerenciada",
                        roas: "5,18x",
                        invested: "R$ 271K",
                        revenue: "R$ 1,40M",
                        purchases: "5.263",
                      },
                    ].map((c, i) => (
                      <CarouselItem key={i}>
                        <div className="flex flex-col gap-3">
                          {/* Print */}
                          <div className="rounded-xl border border-white/10 bg-black overflow-hidden relative">
                            <img
                              src={c.image}
                              alt={`Print TikTok Ads — ${c.period}`}
                              className="w-full h-auto block"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                          </div>
                          {/* Period */}
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">{c.period}</p>
                          {/* ROAS big */}
                          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-center">
                            <p className="font-heading text-4xl font-bold text-emerald-400 leading-none">{c.roas}</p>
                            <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest mt-2">ROAS médio no período</p>
                          </div>
                          {/* 3 mini stats */}
                          <div className="grid grid-cols-3 gap-2">
                            <div className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-2.5 text-center">
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Investido</p>
                              <p className="font-heading text-sm font-bold text-purple-400">{c.invested}</p>
                            </div>
                            <div className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-2.5 text-center">
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Faturado</p>
                              <p className="font-heading text-sm font-bold text-white">{c.revenue}</p>
                            </div>
                            <div className="rounded-lg border border-white/5 bg-white/[0.02] px-2 py-2.5 text-center">
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Compras</p>
                              <p className="font-heading text-sm font-bold text-blue-400">{c.purchases}</p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex items-center justify-between gap-3 pt-2">
                    <CarouselPrevious className="static translate-y-0 border-white/10 bg-white/5 text-white hover:bg-white/10" />
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Arrastar / navegar</span>
                    <CarouselNext className="static translate-y-0 border-white/10 bg-white/5 text-white hover:bg-white/10" />
                  </div>
                </Carousel>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-28 lg:py-44 relative">
          <div className="mx-auto max-w-3xl px-6 lg:px-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="badge-glass text-purple-400 mb-6 backdrop-blur-md mx-auto">
                <Sparkles size={14} />
                <span>Tire Suas Dúvidas</span>
              </div>
              <h2 className="font-heading text-4xl font-bold text-white sm:text-6xl tracking-tighter mb-4">
                Perguntas que <span className="text-gradient-purple">recebemos toda semana.</span>
              </h2>
            </motion.div>

            <div className="space-y-3">
              {[
                {
                  q: "O que a Conoti faz exatamente?",
                  a: "Somos um hub completo de TikTok Business. Operamos TikTok Ads (mídia + criativos), TikTok Shop (loja, afiliados e GMV MAX) e damos suporte estratégico para a sua marca crescer dentro da plataforma — com o respaldo de partner oficial."
                },
                {
                  q: "Para qual perfil de marca a Conoti faz mais sentido?",
                  a: "Trabalhamos com marcas de fashion, suplementos e cosméticos que tenham estoque no Brasil ou produção própria, e que já faturem a partir de R$100k/mês. É o perfil onde o TikTok Shop e a rede de afiliados geram retorno mais rápido."
                },
                {
                  q: "Preciso ter conta no TikTok Ads ou TikTok Shop antes?",
                  a: "Não. Configuramos tudo do zero — conta, pixel, catálogo, loja, integrações. Se você já tem, fazemos auditoria completa e ajustamos antes de qualquer movimento de escala."
                },
                {
                  q: "Vocês resolvem bloqueio de conta e anúncios?",
                  a: "Sim. Como agência oficial TikTok, temos canal direto com a plataforma para destravar contas, anúncios e ajustar políticas. É um dos principais motivos de marcas migrarem para cá."
                },
                {
                  q: "Como funciona o TikTok Shop com vocês?",
                  a: "Implementamos a loja, configuramos catálogo e logística, ativamos afiliados qualificados e otimizamos vendas com GMV MAX. Você foca no produto. A gente cuida do volume."
                },
                {
                  q: "Qual o investimento mínimo?",
                  a: "Recomendamos a partir de R$5.000/mês em mídia para gerar dados suficientes de teste e otimização. Para TikTok Shop, o investimento varia conforme catálogo e operação — alinhamos isso no diagnóstico."
                },
                {
                  q: "Em quanto tempo vejo resultado?",
                  a: "Os primeiros criativos entram em teste na primeira semana. Resultados consistentes de escala e GMV aparecem geralmente entre 30 e 45 dias, depois do ciclo natural de aprendizado da plataforma."
                },
                {
                  q: "Vocês produzem os criativos ou eu preciso fornecer?",
                  a: "Nós produzimos. Roteiros, vídeos e variações otimizadas para os primeiros 3 segundos — onde a maior parte das marcas perde a venda. Você só aprova."
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
              <motion.div
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
                <h2 className="font-heading text-4xl font-bold text-white sm:text-6xl tracking-tighter mb-4">Fale com o nosso time em até <span className="text-gradient-purple">5 minutos.</span></h2>
                <p className="text-slate-400 font-medium text-lg">Preencha os dados e um especialista da Conoti faz contato com um diagnóstico inicial gratuito da sua operação no TikTok.</p>
              </motion.div>

              <div className="glass-dark rounded-[2.5rem] p-8 lg:p-12 ring-1 ring-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-600/5 to-transparent pointer-events-none" aria-hidden="true" />

                {formStatus === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-10 relative z-10"
                    role="status"
                  >
                    <div className="mb-8 rounded-full bg-emerald-500/20 p-6 text-emerald-400 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 size={64} />
                    </div>
                    <h3 className="font-heading text-3xl font-bold text-white mb-4 tracking-tight">Recebido.</h3>
                    <p className="text-slate-400 text-lg">Um especialista da Conoti entra em contato pelo WhatsApp em até 5 minutos.</p>
                    <button
                      onClick={() => { setFormStatus('idle'); setFormStep(0); }}
                      className="mt-10 text-purple-400 font-bold hover:text-purple-300 transition-colors duration-200 uppercase tracking-widest text-sm cursor-pointer"
                    >
                      Enviar novamente
                    </button>
                  </motion.div>
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
                          <motion.div
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
                              <label htmlFor={emailId} className="text-xs font-bold text-slate-500 uppercase tracking-widest">E-mail corporativo</label>
                              <input id={emailId} required type="email" autoComplete="email" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200" placeholder="email@empresa.com" />
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">WhatsApp</label>
                              <input type="tel" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200" placeholder="(11) 99999-9999" />
                            </div>
                            <button type="button" onClick={() => setFormStep(1)} className="w-full rounded-2xl bg-purple-600/40 backdrop-blur-xl border border-purple-400/20 py-4 text-base font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_20px_rgba(147,51,234,0.3)] cursor-pointer hover:bg-purple-500/50 transition-all duration-200 flex items-center justify-center gap-2">
                              Próximo <ArrowRight size={18} />
                            </button>
                          </motion.div>
                        )}

                        {formStep === 1 && (
                          <motion.div
                            key="step-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nome da marca</label>
                              <input type="text" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200" placeholder="Sua marca" />
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Site ou Instagram da marca</label>
                              <input type="text" className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200" placeholder="seusite.com.br ou @suamarca" />
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Segmento</label>
                              <select className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 appearance-none cursor-pointer">
                                <option className="bg-[#0C0E1D]">Fashion</option>
                                <option className="bg-[#0C0E1D]">Suplementos</option>
                                <option className="bg-[#0C0E1D]">Cosméticos</option>
                                <option className="bg-[#0C0E1D]">Outro</option>
                              </select>
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Faturamento mensal aproximado</label>
                              <select className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 appearance-none cursor-pointer">
                                <option className="bg-[#0C0E1D]">Até R$100k</option>
                                <option className="bg-[#0C0E1D]">R$100k – R$500k</option>
                                <option className="bg-[#0C0E1D]">R$500k – R$1M</option>
                                <option className="bg-[#0C0E1D]">R$1M+</option>
                              </select>
                            </div>
                            <div className="flex gap-3">
                              <button type="button" onClick={() => setFormStep(0)} className="flex-1 rounded-2xl border border-white/10 py-4 text-base font-bold text-slate-400 hover:text-white hover:border-white/20 transition-all duration-200 cursor-pointer">
                                Voltar
                              </button>
                              <button type="button" onClick={() => setFormStep(2)} className="flex-[2] rounded-2xl bg-purple-600/40 backdrop-blur-xl border border-purple-400/20 py-4 text-base font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_4px_20px_rgba(147,51,234,0.3)] cursor-pointer hover:bg-purple-500/50 transition-all duration-200 flex items-center justify-center gap-2">
                                Próximo <ArrowRight size={18} />
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {formStep === 2 && (
                          <motion.div
                            key="step-2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                          >
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Já investe em TikTok Ads?</label>
                              <div className="grid grid-cols-2 gap-3">
                                {['Sim', 'Não'].map((opt) => (
                                  <label key={opt} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-5 py-3.5 cursor-pointer hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-200">
                                    <input type="radio" name="tiktok_ads_active" value={opt} className="accent-purple-600" />
                                    <span className="text-sm text-slate-300">{opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div className="space-y-3">
                              <label htmlFor={budgetId} className="text-xs font-bold text-slate-500 uppercase tracking-widest">Investimento previsto em mídia/mês</label>
                              <select id={budgetId} onChange={(e) => setIsHighBudget(e.target.value === '50k+')} className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 appearance-none cursor-pointer">
                                <option value="5k-15k" className="bg-[#0C0E1D]">R$ 5.000 – R$ 15.000</option>
                                <option value="15k-50k" className="bg-[#0C0E1D]">R$ 15.000 – R$ 50.000</option>
                                <option value="50k+" className="bg-[#0C0E1D]">R$ 50.000+</option>
                              </select>
                            </div>
                            <div className="space-y-3">
                              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tem TikTok Shop ativo?</label>
                              <div className="grid grid-cols-3 gap-3">
                                {['Sim', 'Não', 'Quero implementar'].map((opt) => (
                                  <label key={opt} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3.5 cursor-pointer hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-200">
                                    <input type="radio" name="tiktok_shop_status" value={opt} className="accent-purple-600 shrink-0" />
                                    <span className="text-sm text-slate-300">{opt}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            <AnimatePresence mode="wait">
                              {isHighBudget ? (
                                <motion.div
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
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="standard"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.3 }}
                                  className="space-y-3"
                                >
                                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Qual seu maior desafio?</label>
                                  <textarea rows={4} className="w-full rounded-2xl border border-white/5 bg-white/5 px-6 py-4 text-white placeholder:text-slate-700 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-200 resize-none" placeholder="Ex: CPA alto, falta de criativos, dificuldade em escalar..." />
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <div className="flex gap-3">
                              <button type="button" onClick={() => setFormStep(1)} className="flex-1 rounded-2xl border border-white/10 py-4 text-base font-bold text-slate-400 hover:text-white hover:border-white/20 transition-all duration-200 cursor-pointer">
                                Voltar
                              </button>
                              <button type="submit" disabled={formStatus === 'submitting'} className="flex-[2] rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(147,51,234,0.2)] hover:shadow-[0_0_40px_rgba(147,51,234,0.3)] hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-200">
                                {formStatus === 'submitting' ? 'Enviando...' : 'Quero meu diagnóstico'}
                              </button>
                            </div>
                          </motion.div>
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

        {/* Top section - brand + links */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="grid gap-12 md:grid-cols-3">
            {/* Brand */}
            <div className="space-y-5">
              <img src="/logo-conoti.png" alt="Conoti" className="h-4 w-auto opacity-70" />
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                Agência oficial TikTok para marcas que escalam.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="badge-glass text-purple-300 text-[10px] normal-case tracking-normal">Agência Oficial TikTok</span>
                <span className="badge-glass text-emerald-300 text-[10px] normal-case tracking-normal">Media Buyer Certificado</span>
              </div>
            </div>

            {/* Site links */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Site</p>
              <nav className="flex flex-col gap-3 text-sm font-medium text-slate-400" aria-label="Links do site">
                <a href="#serviços" className="hover:text-white transition-colors duration-200">Serviços</a>
                <a href="#processo" className="hover:text-white transition-colors duration-200">Processo</a>
                <a href="#results" className="hover:text-white transition-colors duration-200">Resultados</a>
                <a href="#faq" className="hover:text-white transition-colors duration-200">FAQ</a>
                <a href="#contact" className="hover:text-white transition-colors duration-200">Contato</a>
              </nav>
            </div>

            {/* Solutions */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Soluções</p>
              <nav className="flex flex-col gap-3 text-sm font-medium text-slate-400" aria-label="Soluções">
                <a href="#serviços" className="hover:text-white transition-colors duration-200">TikTok Ads</a>
                <a href="#serviços" className="hover:text-white transition-colors duration-200">TikTok Shop</a>
                <a href="#serviços" className="hover:text-white transition-colors duration-200">TikTok Business</a>
                <a href="#serviços" className="hover:text-white transition-colors duration-200">Rede de Afiliados</a>
              </nav>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs font-medium text-slate-600 tracking-wide">
              &copy; 2026 Conoti. Todos os direitos reservados.
            </p>
            <nav className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-600" aria-label="Links legais">
              <a href="#/termos-de-uso" className="hover:text-white transition-colors duration-200">Termos</a>
              <a href="#/politica-de-privacidade" className="hover:text-white transition-colors duration-200">Privacidade</a>
              <a href="#/politica-de-cookies" className="hover:text-white transition-colors duration-200">Cookies</a>
            </nav>
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
