import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { TextReveal, FadeIn } from '../components/TextReveal';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    name: 'PasuSamrakshak',
    subtitle: 'Livestock Health Tracking',
    org: 'APT Online Limited',
    client: 'Govt of AP (Animal Husbandry)',
    description: 'Android application for livestock health tracking and monitoring across rural Andhra Pradesh. Features real-time data exchange, offline persistence, and QR-based livestock identification.',
    tags: ['Kotlin', 'Firebase', 'REST API'],
    image: '/images/project-pasu.jpg',
  },
  {
    name: 'SEEDAP JobMela',
    subtitle: 'Employment Portal',
    org: 'APT Online Limited',
    client: 'Govt of AP (SEEDAP)',
    description: 'Employment portal connecting job seekers with employers across Andhra Pradesh. Placement tracking, job listings, and registration workflows.',
    tags: ['Java', 'Jetpack Compose', 'SQLite'],
    image: '/images/project-seedap.jpg',
  },
  {
    name: 'Telangana School Education',
    subtitle: 'Monitoring App',
    org: 'APT Online Limited',
    client: 'Govt of Telangana (Education)',
    description: 'Education monitoring and reporting application for Telangana state school administration. Structured reporting and real-time data capture.',
    tags: ['Kotlin', 'Material Design', 'REST API'],
    image: '/images/project-education.jpg',
  },
  {
    name: 'APSHCL Sand Coupon',
    subtitle: 'QR Verification',
    org: 'APT Online Limited',
    client: 'APSHCL',
    description: 'Sand booking and QR verification system for Andhra Pradesh State Housing Corporation. Secure booking workflows with QR code generation.',
    tags: ['Java', 'QR Integration', 'Payment Gateway'],
    image: '/images/project-sand.jpg',
  },
  {
    name: 'GHMC SLMS',
    subtitle: 'Street Light Management',
    org: 'APT Online Limited',
    client: 'GHMC',
    description: 'GPS-based street light management system for Greater Hyderabad Municipal Corporation. Real-time monitoring and maintenance tracking.',
    tags: ['Kotlin', 'GPS Tracking', 'Firebase'],
    image: '/images/project-ghmc.jpg',
  },
  {
    name: 'TG-Dalit Bandhu',
    subtitle: 'Welfare Tracking',
    org: 'APT Online Limited',
    client: 'Govt of Telangana (Welfare)',
    description: 'Welfare programme beneficiary registration and tracking for the Government of Telangana. Secure data handling and authentication.',
    tags: ['Java', 'Security', 'REST API'],
    image: '/images/project-dalit.jpg',
  },
  {
    name: 'APTonline HRMS',
    subtitle: 'Attendance System',
    org: 'APT Online Limited',
    client: 'Internal',
    description: 'Internal employee attendance capture application with secure authentication and structured reporting workflows.',
    tags: ['Kotlin', 'Firebase', 'PDF Generation'],
    image: '/images/project-hrms.jpg',
  },
];

export default function Projects() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = section.querySelectorAll('.project-card');
    const tl = gsap.from(cards, {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    return () => { tl.kill(); };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = 400;
    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      style={{
        position: 'relative',
        zIndex: 10,
        background: 'var(--color-surface)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-wide)',
          margin: '0 auto',
          padding: 'var(--space-2xl) 2rem',
        }}
      >
        {/* Header */}
        <div style={{ maxWidth: '600px', marginBottom: 'var(--space-xl)' }}>
          <FadeIn>
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
              FEATURED PROJECTS
            </span>
          </FadeIn>

          <TextReveal
            as="h2"
            className="projects-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              color: 'var(--color-ink)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
            } as React.CSSProperties}
          >
            Apps that impact lives
          </TextReveal>

          <FadeIn delay={0.3}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-ink-secondary)',
                fontSize: '1rem',
                lineHeight: 1.7,
                maxWidth: '500px',
                marginTop: 'var(--space-sm)',
              }}
            >
              Government and enterprise applications serving millions of citizens
            </p>
          </FadeIn>
        </div>

        {/* Gallery Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.5rem',
            marginBottom: 'var(--space-md)',
          }}
          className="gallery-controls"
        >
          <button
            onClick={() => scroll('left')}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--color-surface-elevated)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--color-ink-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget).style.color = 'var(--color-ink)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget).style.color = 'var(--color-ink-secondary)';
            }}
            aria-label="Scroll left"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--color-surface-elevated)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'var(--color-ink-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget).style.color = 'var(--color-ink)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget).style.color = 'var(--color-ink-secondary)';
            }}
            aria-label="Scroll right"
          >
            <FiChevronRight size={20} />
          </button>
        </div>

        {/* Horizontal Scroll Gallery (Desktop) */}
        <div
          ref={scrollContainerRef}
          className="hide-scrollbar project-gallery-desktop"
          style={{
            display: 'flex',
            gap: 'var(--space-md)',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: '1rem',
          }}
        >
          {projects.map((project, i) => (
            <div
              key={i}
              className="project-card"
              style={{
                minWidth: '380px',
                maxWidth: '380px',
                background: 'var(--color-void-light)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.04)',
                scrollSnapAlign: 'start',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(61, 170, 224, 0.15)';
                el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
                el.style.transform = 'translateY(-4px)';
                const img = el.querySelector('img');
                if (img) img.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = 'rgba(255,255,255,0.04)';
                el.style.boxShadow = 'none';
                el.style.transform = 'translateY(0)';
                const img = el.querySelector('img');
                if (img) img.style.transform = 'scale(1)';
              }}
            >
              {/* Image */}
              <div style={{ height: '220px', overflow: 'hidden', background: 'rgba(0,0,0,0.04)' }}>
                <img
                  src={project.image}
                  alt={project.name}
                  loading="lazy"
                  decoding="async"
                  width={380}
                  height={220}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s ease-out',
                    willChange: 'transform',
                    display: 'block',
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ padding: 'var(--space-md)' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-caption)',
                    fontSize: '0.7rem',
                    color: 'var(--color-accent)',
                    background: 'rgba(61, 170, 224, 0.1)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'inline-block',
                  }}
                >
                  {project.org}
                </span>

                <h3
                  style={{
                    fontFamily: 'var(--font-subheading)',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: 'var(--color-ink)',
                    marginTop: 'var(--space-xs)',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {project.name} — {project.subtitle}
                </h3>

                <p
                  style={{
                    fontFamily: 'var(--font-body-small)',
                    color: 'var(--color-ink-secondary)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    marginTop: '0.5rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {project.description}
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.4rem',
                    marginTop: 'var(--space-sm)',
                  }}
                >
                  {project.tags.slice(0, 3).map((tag, ti) => (
                    <span
                      key={ti}
                      style={{
                        fontFamily: 'var(--font-caption)',
                        fontSize: '0.7rem',
                        color: 'var(--color-ink-tertiary)',
                        background: 'rgba(255,255,255,0.04)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Stack */}
        <div className="project-gallery-mobile">
          {projects.map((project, i) => (
            <div
              key={i}
              className="project-card"
              style={{
                background: 'var(--color-void-light)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.04)',
                marginBottom: 'var(--space-md)',
              }}
            >
              <div style={{ height: '200px', overflow: 'hidden', background: 'rgba(0,0,0,0.04)' }}>
                <img
                  src={project.image}
                  alt={project.name}
                  loading="lazy"
                  decoding="async"
                  width={360}
                  height={200}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <div style={{ padding: 'var(--space-md)' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-caption)',
                    fontSize: '0.7rem',
                    color: 'var(--color-accent)',
                    background: 'rgba(61, 170, 224, 0.1)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 'var(--radius-sm)',
                    display: 'inline-block',
                  }}
                >
                  {project.org}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-subheading)',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: 'var(--color-ink)',
                    marginTop: 'var(--space-xs)',
                  }}
                >
                  {project.name} — {project.subtitle}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body-small)',
                    color: 'var(--color-ink-secondary)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.6,
                    marginTop: '0.5rem',
                  }}
                >
                  {project.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: 'var(--space-sm)' }}>
                  {project.tags.slice(0, 3).map((tag, ti) => (
                    <span
                      key={ti}
                      style={{
                        fontFamily: 'var(--font-caption)',
                        fontSize: '0.7rem',
                        color: 'var(--color-ink-tertiary)',
                        background: 'rgba(255,255,255,0.04)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(255,255,255,0.04)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .project-gallery-mobile {
          display: none;
        }
        @media (max-width: 768px) {
          .gallery-controls,
          .project-gallery-desktop {
            display: none !important;
          }
          .project-gallery-mobile {
            display: block;
          }
        }
      `}</style>
    </section>
  );
}
