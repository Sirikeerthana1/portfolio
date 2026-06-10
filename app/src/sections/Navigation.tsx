import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 50);

      if (currentY > lastScrollY.current && currentY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 2rem',
          background: scrolled ? 'rgba(10, 14, 20, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          transform: hidden && !mobileOpen ? 'translateY(-100%)' : 'translateY(0)',
          transition: 'transform 0.3s ease, background 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease',
        }}
      >
        <div
          style={{
            maxWidth: 'var(--container-max)',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Name Mark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              fontFamily: 'var(--font-nav)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: 'var(--color-ink)',
              textDecoration: 'none',
              letterSpacing: '0.01em',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(90deg, var(--color-ink) 0%, var(--color-ink) 50%, var(--color-accent) 50%, var(--color-accent) 100%)',
                backgroundSize: '200% 100%',
                backgroundPosition: '0% 0%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                transition: 'background-position 0.3s ease',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLSpanElement).style.backgroundPosition = '100% 0%';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLSpanElement).style.backgroundPosition = '0% 0%';
              }}
            >
              Siri Keerthana
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '2rem',
            }}
            className="hidden md:flex"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                style={{
                  fontFamily: 'var(--font-nav)',
                  fontWeight: 500,
                  fontSize: '0.8125rem',
                  color: 'var(--color-ink-secondary)',
                  textDecoration: 'none',
                  letterSpacing: '0.02em',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--color-ink)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLAnchorElement).style.color = 'var(--color-ink-secondary)';
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              style={{
                fontFamily: 'var(--font-button)',
                fontWeight: 500,
                fontSize: '0.875rem',
                color: 'var(--color-accent)',
                background: 'rgba(61, 170, 224, 0.12)',
                border: '1px solid rgba(61, 170, 224, 0.3)',
                borderRadius: '9999px',
                padding: '0.5rem 1.25rem',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const el = e.target as HTMLAnchorElement;
                el.style.background = 'rgba(61, 170, 224, 0.25)';
                el.style.borderColor = 'rgba(61, 170, 224, 0.5)';
              }}
              onMouseLeave={(e) => {
                const el = e.target as HTMLAnchorElement;
                el.style.background = 'rgba(61, 170, 224, 0.12)';
                el.style.borderColor = 'rgba(61, 170, 224, 0.3)';
              }}
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-ink)',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'rgba(3, 5, 8, 0.98)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '2rem',
                color: 'var(--color-ink)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            style={{
              fontFamily: 'var(--font-button)',
              fontWeight: 500,
              fontSize: '1rem',
              color: 'var(--color-accent)',
              background: 'rgba(61, 170, 224, 0.12)',
              border: '1px solid rgba(61, 170, 224, 0.3)',
              borderRadius: '9999px',
              padding: '0.75rem 2rem',
              textDecoration: 'none',
              marginTop: '1rem',
            }}
          >
            Get in Touch
          </a>
        </div>
      )}
    </>
  );
}
