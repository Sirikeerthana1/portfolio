import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextReveal, FadeIn } from '../components/TextReveal';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const statEls = section.querySelectorAll('.stat-item');
    const tl = gsap.from(statEls, {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      delay: 0.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    return () => { tl.kill(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{
        position: 'relative',
        zIndex: 10,
        background: 'var(--color-void)',
        backgroundImage: 'radial-gradient(ellipse at 30% 0%, rgba(61, 170, 224, 0.03) 0%, transparent 60%)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: 'var(--space-2xl) 2rem var(--space-xl)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: 'var(--space-xl)',
          }}
          className="about-grid"
        >
          {/* Left Column */}
          <div>
            <FadeIn delay={0}>
              <span
                style={{
                  fontFamily: 'var(--font-caption)',
                  color: 'var(--color-accent)',
                  letterSpacing: '0.1em',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: 'var(--space-sm)',
                }}
              >
                ABOUT
              </span>
            </FadeIn>

            <TextReveal
              as="h2"
              delay={0.15}
              className="about-heading"
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                color: 'var(--color-ink)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                maxWidth: '480px',
              } as React.CSSProperties}
            >
              Building apps that serve millions
            </TextReveal>

            <FadeIn delay={0.3}>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-ink-secondary)',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  maxWidth: '480px',
                  marginTop: 'var(--space-md)',
                }}
              >
                Mobile application developer with 3+ years of experience designing, developing, and deploying 7+ live Android applications on the Google Play Store. Specialized in Kotlin and Java, with hands-on expertise across government citizen-service platforms serving millions of users across Andhra Pradesh and Telangana. Strong foundation in MVVM/MVC architecture patterns, REST API integration, Firebase services, and Material Design implementation. Recognized for delivering high-quality, user-centric applications.
              </p>
            </FadeIn>

            

          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>



  );
}
