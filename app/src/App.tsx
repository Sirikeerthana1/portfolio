import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './sections/Navigation';
import About from './sections/About';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Achievements from './sections/Achievements';
import Contact from './sections/Contact';

gsap.registerPlugin(ScrollTrigger);

const JellyfishScene = lazy(() => import('./components/JellyfishScene'));

function LoadingFallback() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#030508',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 0,
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '2px solid rgba(61, 170, 224, 0.2)',
          borderTopColor: 'var(--color-accent)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const scrollBoostRef = useRef(1);
  const lenisRef = useRef<Lenis | null>(null);
  const [canvasOpacity, setCanvasOpacity] = useState(1);
  const [canvasFixed, setCanvasFixed] = useState(true);
  const heroWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.2,
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Connect Lenis to GSAP
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Scroll-driven hero camera and parameters
    const heroWrapper = heroWrapperRef.current;
    if (heroWrapper) {
      // Camera descent and parameter changes (0-200vh)
      ScrollTrigger.create({
        trigger: heroWrapper,
        start: 'top top',
        end: '+=200%',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          // scrollBoost: 1.0 -> 3.0
          scrollBoostRef.current = 1 + progress * 2;
        },
      });

      // Canvas fade out (200-250vh)
      ScrollTrigger.create({
        trigger: heroWrapper,
        start: 'top top',
        end: '+=250%',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (progress > 0.8) {
            const fadeProgress = (progress - 0.8) / 0.2;
            setCanvasOpacity(1 - fadeProgress);
          } else {
            setCanvasOpacity(1);
          }
          if (progress >= 1) {
            setCanvasFixed(false);
          } else {
            setCanvasFixed(true);
          }
        },
      });
    }

    // Refresh ScrollTrigger after layout settles
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      clearTimeout(refreshTimeout);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div>
      {/* Navigation */}
      <Navigation />

      {/* Hero Wrapper - Defines scroll area */}
      <div
        ref={heroWrapperRef}
        style={{
          height: '300vh',
          position: 'relative',
        }}
      >
        {/* 3D Canvas */}
        <div
          style={{
            position: canvasFixed ? 'fixed' : 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 0,
            opacity: canvasOpacity,
            transition: canvasFixed ? 'none' : 'opacity 0.3s ease',
          }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <JellyfishScene scrollBoostRef={scrollBoostRef} />
          </Suspense>
        </div>

        {/* Top gradient overlay for heading readability */}
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '30vh',
            background: 'linear-gradient(180deg, rgba(3,5,8,0.4) 0%, rgba(3,5,8,0) 100%)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      </div>

      {/* Content Sections */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <About />
        <Projects />
        <Skills />
        <Achievements />
        <Contact />
      </div>
    </div>
  );
}
