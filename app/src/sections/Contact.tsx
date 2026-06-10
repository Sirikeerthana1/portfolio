import { FiMail, FiLinkedin, FiGithub } from 'react-icons/fi';
import { TextReveal, FadeIn } from '../components/TextReveal';

export default function Contact() {
  return (
    <>
      <section
        id="contact"
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'var(--color-void)',
          backgroundImage: 'radial-gradient(ellipse at 50% 100%, rgba(61, 170, 224, 0.06) 0%, transparent 60%)',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--container-narrow)',
            margin: '0 auto',
            padding: 'var(--space-2xl) 2rem var(--space-3xl)',
            textAlign: 'center',
          }}
        >
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
              LET'S CONNECT
            </span>
          </FadeIn>

          <TextReveal
            as="h2"
            className="contact-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              color: 'var(--color-ink)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              maxWidth: '600px',
              margin: '0 auto',
            } as React.CSSProperties}
          >
            Ready to build something impactful?
          </TextReveal>

          <FadeIn delay={0.3}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                color: 'var(--color-ink-secondary)',
                fontSize: '1rem',
                lineHeight: 1.7,
                maxWidth: '520px',
                margin: 'var(--space-md) auto 0',
              }}
            >
              I'm currently open to new opportunities in mobile application development. Whether you're working on government digital initiatives, enterprise solutions, or innovative consumer apps — I'd love to hear from you.
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <a
              href="mailto:siri.keerthana@email.com"
              style={{
                display: 'inline-block',
                marginTop: 'var(--space-lg)',
                fontFamily: 'var(--font-button)',
                fontWeight: 500,
                fontSize: '0.875rem',
                color: '#fff',
                background: 'linear-gradient(135deg, var(--color-accent), #2B8CC4)',
                padding: '0.875rem 2rem',
                borderRadius: '9999px',
                textDecoration: 'none',
                boxShadow: '0 4px 20px rgba(61, 170, 224, 0.25)',
                transition: 'all 0.3s ease',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.boxShadow = '0 6px 30px rgba(61, 170, 224, 0.4)';
                el.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.boxShadow = '0 4px 20px rgba(61, 170, 224, 0.25)';
                el.style.transform = 'scale(1)';
              }}
            >
              Get in Touch
            </a>
          </FadeIn>

          {/* Secondary Contact Row */}
          <FadeIn delay={0.7}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--space-xl)',
                marginTop: 'var(--space-xl)',
                flexWrap: 'wrap',
              }}
            >
              {[
                { icon: FiMail, label: 'Email', href: 'mailto:siri.keerthana@email.com' },
                { icon: FiLinkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/siri-keerthana' },
           //     { icon: FiGithub, label: 'GitHub', href: 'https://github.com/siri-keerthana' },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--space-xs)',
                    textDecoration: 'none',
                    color: 'var(--color-ink-tertiary)',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--color-accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--color-ink-tertiary)';
                  }}
                >
                  <item.icon size={24} />
                  <span
                    style={{
                      fontFamily: 'var(--font-caption)',
                      fontSize: '0.75rem',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'var(--color-void)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          padding: 'var(--space-lg) 2rem',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-caption)',
            color: 'var(--color-ink-tertiary)',
            fontSize: '0.75rem',
            letterSpacing: '0.04em',
          }}
        >
          &copy; 2025 Siri Keerthana Janapamala. Built with care.
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '0.5rem',
          }}
        >
          <span
            className="pulse-dot"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#4ADE80',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-caption)',
              color: 'var(--color-ink-tertiary)',
              fontSize: '0.7rem',
            }}
          >
            Available for new opportunities
          </span>
        </div>
      </footer>
    </>
  );
}
