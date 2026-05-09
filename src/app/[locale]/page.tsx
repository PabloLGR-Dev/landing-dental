'use client'

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { agendarCitaAction } from "../actions";
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [threshold]);
  return scrolled;
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCounter(target: number, duration = 1800, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const raf = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [active, target, duration]);
  return val;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const ToothLogoSVG = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none">
    <path d="M20 4C13.5 4 8 9.5 8 16c0 3.8 1.5 7.2 4 9.6L20 36l8-10.4c2.5-2.4 4-5.8 4-9.6C32 9.5 26.5 4 20 4z" fill="url(#logoGrad)" />
    <path d="M20 4C16.5 4 14 9 14 16s2.5 10 6 10 6-3 6-10S23.5 4 20 4z" fill="white" opacity="0.2" />
    <defs>
      <linearGradient id="logoGrad" x1="8" y1="4" x2="32" y2="36" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38BDF8" />
        <stop offset="1" stopColor="#2563EB" />
      </linearGradient>
    </defs>
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SpinIcon = () => (
  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

// Service icons
const ImplantIcon  = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C9.5 2 7.5 4 7.5 6.5V9h9V6.5C16.5 4 14.5 2 12 2z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9v3l-1 9h10l-1-9V9M9.5 15h5M10 18h4"/></svg>;
const SmileIcon    = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" strokeWidth={1.5}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 13s1.5 3 4 3 4-3 4-3"/><circle cx="9" cy="9.5" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="9.5" r="1" fill="currentColor" stroke="none"/></svg>;
const OrthoIcon    = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="9" width="18" height="6" rx="3" strokeWidth={1.5}/><circle cx="7" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="17" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>;
const WhiteningIcon= () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/><circle cx="12" cy="12" r="4" strokeWidth={1.5}/></svg>;
const RootCanalIcon= () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>;
const PedsIcon     = () => <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>;

const SERVICE_ICONS = [ImplantIcon, SmileIcon, OrthoIcon, WhiteningIcon, RootCanalIcon, PedsIcon];

// ─── Sub-components ───────────────────────────────────────────────────────────

function LogoMark({ size = "w-9 h-9" }: { size?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`${size} shrink-0`}>
      {failed ? (
        <ToothLogoSVG className="w-full h-full" />
      ) : (
        <img
          src="/images/logo.png"
          alt="PureSmile Dental"
          className="w-full h-full object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Stars({ count = 5, size = "w-4 h-4" }: { count?: number; size?: string }) {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className={size} viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function StatCounter({
  target,
  suffix,
  label,
  active,
}: {
  target: number;
  suffix: string;
  label: string;
  active: boolean;
}) {
  const val = useCounter(target, 1800, active);
  return (
    <div className="text-center px-4">
      <p className="text-4xl lg:text-5xl font-black text-white tabular-nums tracking-tight">
        {val}
        <span className="text-cyan-300">{suffix}</span>
      </p>
      <p className="text-blue-200 text-xs font-semibold mt-2 uppercase tracking-[0.12em]">{label}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DentalLanding() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const scrolled = useScrolled();

  const [loading, setLoading] = useState(false);
  const [service, setService] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  const statsRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStatsActive(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };
  const switchLocale = (l: string) => { router.replace(pathname, { locale: l }); setMobileOpen(false); };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    if (fd.get('servicio') === 'otro') fd.set('servicio', `Otro: ${fd.get('servicio_otro')}`);
    const res = await agendarCitaAction(fd);
    if (res.error) {
      alert(res.error);
    } else if (res.success) {
      alert(t('Alerts.success'));
      (e.target as HTMLFormElement).reset();
      setService('');
    }
    setLoading(false);
  };

  const navLinks = ['services', 'process', 'testimonials'] as const;

  const services = [
    { Icon: SERVICE_ICONS[0], title: t('Services.s1_title'), desc: t('Services.s1_desc') },
    { Icon: SERVICE_ICONS[1], title: t('Services.s2_title'), desc: t('Services.s2_desc') },
    { Icon: SERVICE_ICONS[2], title: t('Services.s3_title'), desc: t('Services.s3_desc') },
    { Icon: SERVICE_ICONS[3], title: t('Services.s4_title'), desc: t('Services.s4_desc') },
    { Icon: SERVICE_ICONS[4], title: t('Services.s5_title'), desc: t('Services.s5_desc') },
    { Icon: SERVICE_ICONS[5], title: t('Services.s6_title'), desc: t('Services.s6_desc') },
  ];

  const processSteps = [
    { num: '01', title: t('Process.s1_title'), desc: t('Process.s1_desc') },
    { num: '02', title: t('Process.s2_title'), desc: t('Process.s2_desc') },
    { num: '03', title: t('Process.s3_title'), desc: t('Process.s3_desc') },
  ];

  const whyItems = [
    { icon: <ShieldIcon />, title: t('WhyUs.b1_title'), desc: t('WhyUs.b1_desc'), accent: 'bg-blue-50 text-blue-600' },
    { icon: <ClockIcon />,  title: t('WhyUs.b2_title'), desc: t('WhyUs.b2_desc'), accent: 'bg-cyan-50 text-cyan-600' },
    { icon: <GlobeIcon />,  title: t('WhyUs.b3_title'), desc: t('WhyUs.b3_desc'), accent: 'bg-indigo-50 text-indigo-600' },
  ];

  const testimonials = [
    { name: 'Laura M.',  text: t('Testimonials.r1_text'), img: '/images/paciente1.jpg' },
    { name: 'Carlos R.', text: t('Testimonials.r2_text'), img: '/images/paciente02.jpg' },
    { name: 'Ana V.',    text: t('Testimonials.r3_text'), img: '/images/paciente3.jpg' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">

      {/* ══ HEADER ══════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <button onClick={scrollToTop} className="flex items-center gap-2.5 shrink-0">
            <LogoMark size="w-8 h-8" />
            <span className={`font-black text-lg tracking-tight transition-colors ${scrolled ? 'text-blue-700' : 'text-white'}`}>
              PureSmile{' '}
              <span className={`font-light ${scrolled ? 'text-slate-400' : 'text-blue-200'}`}>
                Dental
              </span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((s) => (
              <button
                key={s}
                onClick={() => scrollTo(s)}
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  scrolled ? 'text-slate-600' : 'text-white/75'
                }`}
              >
                {t(`Nav.${s}`)}
              </button>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2.5">
            {/* Language switcher */}
            <div
              className={`flex items-center rounded-lg p-0.5 ${
                scrolled ? 'bg-slate-100' : 'bg-white/10'
              }`}
            >
              {(['es', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    locale === l
                      ? scrolled
                        ? 'bg-white shadow-sm text-blue-600'
                        : 'bg-white/20 text-white'
                      : scrolled
                      ? 'text-slate-500 hover:text-slate-800'
                      : 'text-white/55 hover:text-white'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Book CTA — desktop */}
            <button
              onClick={scrollToTop}
              className={`hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                scrolled
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                  : 'bg-white text-blue-700 hover:bg-blue-50'
              }`}
            >
              {t('Nav.book')}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className={`md:hidden p-1.5 rounded-lg transition-colors ${
                scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}
            >
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="px-5 py-5 flex flex-col gap-1">
              {navLinks.map((s) => (
                <button
                  key={s}
                  onClick={() => scrollTo(s)}
                  className="text-left text-slate-700 font-medium py-2.5 hover:text-blue-600 transition-colors border-b border-slate-50 last:border-0"
                >
                  {t(`Nav.${s}`)}
                </button>
              ))}
              <button
                onClick={scrollToTop}
                className="mt-3 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors"
              >
                {t('Nav.book')}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ══ HERO ════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/dentista.jpg"
            alt=""
            fill
            priority
            className="object-cover object-top opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/90 to-cyan-950/80" />
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-1/4 right-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-float pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-indigo-500/8 rounded-full blur-2xl animate-pulse-glow pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-16 w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Copy */}
          <div className="space-y-7 animate-in fade-in slide-in-from-left-8 duration-700">

            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-white/8 border border-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <Stars size="w-3.5 h-3.5" />
              <span className="text-sm text-white/85 font-medium">{t('Hero.badge')}</span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.06] tracking-tight text-white">
                {t('Hero.title1')}
              </h1>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.06] tracking-tight text-shimmer">
                {t('Hero.title2')}
              </h1>
            </div>

            <p className="text-base md:text-lg text-slate-300 max-w-lg leading-relaxed">
              {t('Hero.description')}
            </p>

            {/* Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(['b1', 'b2', 'b3', 'b4'] as const).map((b) => (
                <div key={b} className="flex items-center gap-2.5 text-slate-200">
                  <span className="text-cyan-400 shrink-0">
                    <CheckIcon className="w-4 h-4" />
                  </span>
                  <span className="text-sm font-medium">{t(`Hero.bullets.${b}`)}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={scrollToTop}
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 text-sm"
              >
                {t('Nav.book')} <ArrowIcon />
              </button>
              <button
                onClick={() => scrollTo('services')}
                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-2xl border border-white/10 backdrop-blur-sm transition-all text-sm"
              >
                {t('Hero.learn_more')}
              </button>
            </div>
          </div>

          {/* Form card */}
          <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-black/50 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-700" />
              <div className="p-7 sm:p-8">
                <h2 className="text-2xl font-extrabold text-slate-900">{t('Hero.form.title')}</h2>
                <p className="text-slate-500 text-sm mt-1 mb-6">{t('Hero.form.subtitle')}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" name="direccion_postal" className="hidden" tabIndex={-1} autoComplete="off" />

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                      {t('Hero.form.name')}
                    </label>
                    <Input
                      type="text" name="nombre" required disabled={loading}
                      className="h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-sm"
                      placeholder={t('Hero.form.name_ph')}
                    />
                  </div>

                  {/* Phone + Email */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                        {t('Hero.form.phone')}
                      </label>
                      <Input
                        type="tel" name="telefono" required disabled={loading}
                        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-sm"
                        placeholder={t('Hero.form.phone_ph')}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                        {t('Hero.form.email')}
                      </label>
                      <Input
                        type="email" name="email" required disabled={loading}
                        className="h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-blue-500 text-sm"
                        placeholder={t('Hero.form.email_ph')}
                      />
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                      {t('Hero.form.service')}
                    </label>
                    <div className="relative">
                      <select
                        name="servicio" required disabled={loading} defaultValue=""
                        onChange={(e) => setService(e.target.value)}
                        className="w-full h-11 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                      >
                        <option value="" disabled>{t('Hero.form.service_ph')}</option>
                        <option value="limpieza">{t('Hero.form.opt_cleaning')}</option>
                        <option value="implantes">{t('Hero.form.opt_implants')}</option>
                        <option value="ortodoncia">{t('Hero.form.opt_ortho')}</option>
                        <option value="sonrisa">{t('Hero.form.opt_smile')}</option>
                        <option value="blanqueamiento">{t('Hero.form.opt_whitening')}</option>
                        <option value="emergencia">{t('Hero.form.opt_emergency')}</option>
                        <option value="otro">{t('Hero.form.opt_other')}</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-slate-400">
                        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {service === 'otro' && (
                      <div className="mt-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
                        <Input
                          type="text" name="servicio_otro" required disabled={loading}
                          className="h-11 rounded-xl bg-blue-50 border-blue-200 focus-visible:ring-blue-500 text-sm"
                          placeholder={t('Hero.form.other_ph')}
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit" disabled={loading}
                    className="w-full h-11 mt-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/35 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none text-sm"
                  >
                    {loading ? (<><SpinIcon />{t('Hero.form.btn_loading')}</>) : t('Hero.form.btn_submit')}
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 pt-1">
                    <ShieldIcon />
                    {t('Hero.form.security')}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/30 animate-scroll-bounce">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ══ STATS ═══════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-800 py-14">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-52 h-52 bg-cyan-300 rounded-full blur-3xl" />
        </div>
        <div
          ref={statsRef}
          className="relative max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <StatCounter target={15}   suffix="+"   label={t('Trust.t1_lbl')} active={statsActive} />
          <StatCounter target={5000} suffix="+"   label={t('Trust.t2_lbl')} active={statsActive} />
          <StatCounter target={100}  suffix="%"   label={t('Trust.t3_lbl')} active={statsActive} />
          <StatCounter target={24}   suffix="/7"  label={t('Trust.t4_lbl')} active={statsActive} />
        </div>
      </section>

      {/* ══ SERVICES ════════════════════════════════════════════════════════════ */}
      <section id="services" className="py-24 px-5 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16 space-y-4">
            <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-[0.18em] bg-blue-50 px-4 py-1.5 rounded-full">
              {t('Services.badge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {t('Services.title')}
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              {t('Services.subtitle')}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(({ Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 70}>
                <div className="group relative bg-white border border-slate-100 rounded-3xl p-7 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 overflow-hidden cursor-default h-full">
                  {/* Hover glow */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl" />

                  <div className="relative">
                    <div className="w-12 h-12 bg-slate-50 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center text-blue-600 group-hover:text-white transition-all duration-300 mb-5 shadow-sm">
                      <Icon />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESS ═════════════════════════════════════════════════════════════ */}
      <section id="process" className="py-24 px-5 sm:px-8 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(37,99,235,0.15),transparent)] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <Reveal className="text-center mb-16 space-y-4">
            <span className="inline-block text-xs font-bold text-cyan-400 uppercase tracking-[0.18em] bg-cyan-400/10 border border-cyan-400/20 px-4 py-1.5 rounded-full">
              {t('Process.badge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              {t('Process.title')}
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              {t('Process.subtitle')}
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-[2.4rem] left-[calc(16.7%+2rem)] right-[calc(16.7%+2rem)] h-px bg-gradient-to-r from-transparent via-blue-700/40 to-transparent" />

            {processSteps.map(({ num, title, desc }, i) => (
              <Reveal key={num} delay={i * 120}>
                <div className="flex flex-col items-center text-center gap-5">
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-600/30 ring-4 ring-slate-950">
                      {num}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY US ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* Image */}
          <Reveal className="relative h-[500px] lg:h-[560px] rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-100 order-last lg:order-first">
            <Image
              src="/images/dentista.jpg"
              alt="PureSmile Dental clinic"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/30 to-transparent" />

            {/* Floating badge */}
            <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{t('WhyUs.card_title')}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{t('WhyUs.card_desc')}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Content */}
          <div className="space-y-10">
            <Reveal>
              <div>
                <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-[0.18em] bg-blue-50 px-3 py-1.5 rounded-full mb-4">
                  {t('WhyUs.badge')}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  {t('WhyUs.title')}
                </h2>
              </div>
            </Reveal>

            <div className="space-y-7">
              {whyItems.map(({ icon, title, desc, accent }, i) => (
                <Reveal key={title} delay={i * 100}>
                  <div className="flex gap-5 group">
                    <div className={`w-11 h-11 ${accent} rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                      {icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 mb-1.5">{title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-24 px-5 sm:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16 space-y-4">
            <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-[0.18em] bg-blue-50 px-4 py-1.5 rounded-full">
              {t('Testimonials.badge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {t('Testimonials.title')}
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">{t('Testimonials.subtitle')}</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, text, img }, i) => (
              <Reveal key={name} delay={i * 90}>
                <div className="bg-white border border-slate-100 rounded-3xl p-7 hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col h-full">
                  <Stars size="w-4 h-4" />

                  <p className="text-slate-700 text-sm leading-relaxed mt-5 flex-grow">
                    &ldquo;{text}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 mt-7 pt-5 border-t border-slate-100">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 shrink-0 flex items-center justify-center font-bold text-blue-600 text-sm">
                      <Image
                        src={img} alt={name} fill
                        className="object-cover"
                        onError={() => {}}
                      />
                      <span className="relative z-10">{name[0]}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{name}</p>
                      <Stars size="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-5 sm:px-8 bg-white">
        <Reveal>
          <div className="max-w-4xl mx-auto relative bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-800 rounded-[3rem] p-12 md:p-20 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-x-8 -translate-y-8 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full translate-x-8 translate-y-8 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(6,182,212,0.15),transparent)] pointer-events-none" />

            <div className="relative space-y-6">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {t('CTA.title')}
              </h2>
              <p className="text-lg text-blue-200 max-w-xl mx-auto leading-relaxed">
                {t('CTA.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-blue-200 text-sm">
                <span className="flex items-center gap-1.5">
                  <LocationIcon /> {t('CTA.location')}
                </span>
                <span className="hidden sm:block text-blue-600">·</span>
                <span className="flex items-center gap-1.5">
                  <PhoneIcon /> +1 809-555-0000
                </span>
              </div>
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 px-10 py-4 bg-white text-blue-700 font-black rounded-2xl hover:bg-blue-50 transition-all hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-0.5 text-base mt-2"
              >
                {t('CTA.btn')} <ArrowIcon />
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════════ */}
      <footer className="bg-slate-950 pt-16 pb-8 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <LogoMark size="w-9 h-9" />
                <span className="font-black text-lg text-white tracking-tight">
                  PureSmile{' '}
                  <span className="font-light text-slate-500">Dental</span>
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                {t('Footer.brand_desc')}
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">
                {t('Footer.contact')}
              </h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex items-center gap-2"><PhoneIcon /> +1 809-555-0000</li>
                <li className="flex items-center gap-2"><MailIcon /> pablolgr.dev@gmail.com</li>
                <li className="flex items-center gap-2"><LocationIcon /> {t('Footer.location')}</li>
              </ul>
            </div>

            {/* Hours */}
            <div className="space-y-4">
              <h4 className="text-white font-bold text-sm uppercase tracking-widest">
                {t('Footer.hours')}
              </h4>
              <ul className="space-y-2.5 text-slate-400 text-sm">
                <li>{t('Footer.h_week')}</li>
                <li>{t('Footer.h_sat')}</li>
                <li className="text-cyan-400 font-semibold">{t('Footer.h_urg')}</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-3 text-slate-500 text-xs">
            <p>© {new Date().getFullYear()} PureSmile Dental. {t('Footer.rights')}</p>
            <p>{t('Footer.dev')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
