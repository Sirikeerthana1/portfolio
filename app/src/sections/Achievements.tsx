import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextReveal, FadeIn } from '../components/TextReveal';

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  {
    title: '7+ Live Government Apps',
    description: 'Successfully designed, developed, and deployed 7+ live government mobile applications on the Google Play Store, serving millions of citizens across Andhra Pradesh and Telangana.',
  },
  {
    title: 'TCS + Government Experience',
    description: '3+ years at APT Online Limited, a Joint Venture between TCS and Government of AP & TS , delivering mission-critical citizen-service applications across multiple departments.',
  },
  {
    title: 'Multi-Domain Coverage',
    description: 'Delivered applications spanning Animal Husbandry, Employment, Education, Housing, Municipal Operations, Welfare, and HRMS — demonstrating versatile full-lifecycle mobile development.',
  },
  {
    title: 'Microsoft AI Certified',
    description: 'Completed Global AI Bootcamp by Microsoft (April 2025), demonstrating commitment to emerging AI and machine learning capabilities.',
  },
  {
    title: 'Academic Excellence',
    description: 'College Topper (Intermediate 94.5%), School Topper (SSC GPA 10/10), and 100/100 in MCA project work at Andhra University.',
  },
];

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const items = section.querySelectorAll('.achievement-item');
    const bars = section.querySelectorAll('.achievement-bar');

    const tl1 = gsap.from(items, {
      opacity: 0,
      x: -20,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    const tl2 = gsap.from(bars, {
      scaleY: 0,
      transformOrigin: 'top',
      stagger: 0.15,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      tl1.kill();
      tl2.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: 'relative',
        zIndex: 10,
        background: 'var(--color-surface)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-narrow)',
          margin: '0 auto',
          padding: 'var(--space-2xl) 2rem',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <FadeIn>
            <span
              style={{
                fontFamily: 'var(--font-caption)',
                color: 'var(--color-accent-warm)',
                letterSpacing: '0.1em',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: 'var(--space-sm)',
              }}
            >
              ACHIEVEMENTS
            </span>
          </FadeIn>

          <TextReveal
            as="h2"
            className="achievements-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              color: 'var(--color-ink)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
            } as React.CSSProperties}
          >
            Milestones & recognition
          </TextReveal>
        </div>

        {/* Achievement List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          {achievements.map((achievement, i) => (
            <div
              key={i}
              className="achievement-item"
              style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)' }}
            >
              {/* Accent Marker */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent-warm))',
                    flexShrink: 0,
                  }}
                />
                <div
                  className="achievement-bar"
                  style={{
                    width: '3px',
                    minHeight: '60px',
                    borderRadius: '9999px',
                    background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent-warm))',
                    marginTop: '4px',
                  }}
                />
              </div>

              {/* Content */}
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-subheading)',
                    fontWeight: 600,
                    fontSize: '1.25rem',
                    color: 'var(--color-ink)',
                  }}
                >
                  {achievement.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body-small)',
                    color: 'var(--color-ink-secondary)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    marginTop: '0.25rem',
                  }}
                >
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
