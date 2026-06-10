import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiSmartphone, FiCloud, FiLayers } from 'react-icons/fi';
import { FaPalette } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import { TextReveal, FadeIn } from '../components/TextReveal';

gsap.registerPlugin(ScrollTrigger);

interface SkillCategory {
  title: string;
  icon: IconType;
  skills: { name: string; level: number }[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Mobile Development',
    icon: FiSmartphone,
    skills: [
      { name: 'Kotlin', level: 95 },
      { name: 'Core Java', level: 90 },
      { name: 'Android SDK', level: 92 },
      { name: 'Jetpack Compose', level: 85 },
      { name: 'Flutter / Dart', level: 65 },
    ],
  },
  {
    title: 'Architecture & Patterns',
    icon: FiLayers,
    skills: [
      { name: 'MVVM / MVP / MVC', level: 92 },
      { name: 'Clean Architecture', level: 88 },
      { name: 'Jetpack Components', level: 90 },
      { name: 'Kotlin Coroutines', level: 87 },
    ],
  },
  {
    title: 'Backend & APIs',
    icon: FiCloud,
    skills: [
      { name: 'REST API (Retrofit)', level: 93 },
      { name: 'Firebase Services', level: 90 },
      { name: 'SQLite / Room', level: 88 },
      { name: 'SOAP / JSON', level: 85 },
    ],
  },
  {
    title: 'Tools & Practices',
    icon: FaPalette,
    skills: [
      { name: 'Material Design', level: 92 },
      { name: 'Git / Version Control', level: 88 },
      { name: 'JUnit / Mockito', level: 82 },
      { name: 'Play Store Deployment', level: 90 },
    ],
  },
];

const additionalSkills = [
  'QR Integration',
  'PDF Generation',
  'Payment Gateway',
  'Push Notifications',
  'Accessibility Standards',
  'Mobile Security',
  'GPS Tracking',
  'Offline Sync',
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const bars = section.querySelectorAll('.skill-bar-fill');
      bars.forEach((bar) => {
        (bar as HTMLElement).style.width = (bar as HTMLElement).dataset.width || '0%';
      });
      return;
    }

    const bars = section.querySelectorAll('.skill-bar-fill');
    const tl = gsap.from(bars, {
      width: '0%',
      duration: 1.2,
      ease: 'power2.out',
      stagger: 0.08,
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
      id="skills"
      style={{
        position: 'relative',
        zIndex: 10,
        background: 'var(--color-void)',
        backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(184, 102, 255, 0.03) 0%, transparent 50%)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
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
                color: 'var(--color-accent)',
                letterSpacing: '0.1em',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: 'var(--space-sm)',
              }}
            >
              TECHNICAL SKILLS
            </span>
          </FadeIn>

          <TextReveal
            as="h2"
            className="skills-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              color: 'var(--color-ink)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
            }}
          >
            Tools & technologies
          </TextReveal>
        </div>

        {/* Skills Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--space-md)',
          }}
          className="skills-grid"
        >
          {skillCategories.map((category, ci) => {
            const IconComponent = category.icon;
            return (
              <div
                key={ci}
                style={{
                  background: 'var(--color-void-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-md)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  transition: 'border-color 0.3s ease, transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(61, 170, 224, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(61, 170, 224, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-accent)',
                  }}
                >
                  <IconComponent size={20} />
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-subheading)',
                    fontWeight: 600,
                    fontSize: '1.125rem',
                    color: 'var(--color-ink)',
                    marginTop: 'var(--space-sm)',
                  }}
                >
                  {category.title}
                </h3>

                <div style={{ marginTop: 'var(--space-sm)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {category.skills.map((skill, si) => (
                    <div key={si}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.25rem',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'var(--font-body-small)',
                            color: 'var(--color-ink-secondary)',
                            fontSize: '0.875rem',
                          }}
                        >
                          {skill.name}
                        </span>
                        <span
                          style={{
                            fontFamily: 'var(--font-caption)',
                            color: 'var(--color-ink-tertiary)',
                            fontSize: '0.7rem',
                          }}
                        >
                          {skill.level}%
                        </span>
                      </div>
                      <div
                        style={{
                          height: '4px',
                          borderRadius: '9999px',
                          background: 'rgba(255,255,255,0.06)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          className="skill-bar-fill"
                          data-width={`${skill.level}%`}
                          style={{
                            height: '100%',
                            borderRadius: '9999px',
                            background: 'linear-gradient(90deg, var(--color-accent), var(--color-jelly-rim))',
                            width: '0%',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Skills Tags */}
        <FadeIn>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: 'var(--space-xl)',
            }}
          >
            {additionalSkills.map((skill, i) => (
              <span
                key={i}
                style={{
                  fontFamily: 'var(--font-caption)',
                  fontSize: '0.75rem',
                  color: 'var(--color-ink-tertiary)',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .skills-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .skills-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
