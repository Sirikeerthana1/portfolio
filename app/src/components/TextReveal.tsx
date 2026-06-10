import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  duration?: number;
}

export function TextReveal({
  children,
  as: Tag = 'h2',
  className = '',
  style,
  delay = 0,
  stagger = 0.02,
  duration = 0.6,
}: TextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.style.opacity = '1';
      return;
    }

    const chars = el.querySelectorAll('.char-reveal');

    gsap.set(chars, { opacity: 0, rotateY: -90 });

    const tl = gsap.to(chars, {
      opacity: 1,
      rotateY: 0,
      duration,
      stagger,
      delay,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tl.kill();
    };
  }, [delay, stagger, duration]);

  // Split text into characters, preserving word grouping
  const words = children.split(' ');

  return (
    <Tag
      ref={containerRef as React.RefObject<HTMLHeadingElement>}
      className={className}
      style={{ perspective: '1000px', opacity: 0, ...style }}
    >
      {words.map((word, wi) => (
        <span key={wi} className="word-wrap" style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
          {word.split('').map((char, ci) => (
            <span
              key={ci}
              className="char-reveal"
              style={{
                display: 'inline-block',
                willChange: 'transform, opacity',
                transformOrigin: 'center center',
              }}
            >
              {char}
            </span>
          ))}
          {wi < words.length - 1 && (
            <span className="char-reveal" style={{ display: 'inline-block' }}>&nbsp;</span>
          )}
        </span>
      ))}
    </Tag>
  );
}

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
}

export function FadeIn({ children, className = '', delay = 0, duration = 0.8, y = 30, x = 0 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.style.opacity = '1';
      return;
    }

    gsap.set(el, { opacity: 0, y, x });

    const tl = gsap.to(el, {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tl.kill();
    };
  }, [delay, duration, y, x]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
