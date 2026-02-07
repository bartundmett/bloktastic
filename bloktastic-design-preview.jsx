import React, { useState } from 'react';

// Bloktastic Design System Preview
// Iteratives Design-Tool für die Landing Page Entwicklung

const BloktasticDesignPreview = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [accentColor, setAccentColor] = useState('teal');

  // Farbpaletten-Optionen
  const colors = {
    teal: {
      primary: '#00B3B0',
      primaryHover: '#00A3A0',
      gradient: 'linear-gradient(135deg, #00B3B0 0%, #2DB47D 100%)',
    },
    blue: {
      primary: '#395ECE',
      primaryHover: '#2D4BA8',
      gradient: 'linear-gradient(135deg, #395ECE 0%, #00B3B0 100%)',
    },
    purple: {
      primary: '#7C3AED',
      primaryHover: '#6D28D9',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #395ECE 100%)',
    }
  };

  const currentAccent = colors[accentColor];

  // Theme Colors
  const theme = darkMode ? {
    bg: '#0F172A',
    bgCard: '#1E293B',
    bgCardHover: '#334155',
    text: '#F8FAFC',
    textMuted: '#94A3B8',
    border: '#334155',
  } : {
    bg: '#F8FAFC',
    bgCard: '#FFFFFF',
    bgCardHover: '#F1F5F9',
    text: '#1E293B',
    textMuted: '#64748B',
    border: '#E2E8F0',
  };

  // Scribble SVG Element (Storyblok-inspiriert)
  const Scribble = ({ className }) => (
    <svg className={className} width="120" height="40" viewBox="0 0 120 40" fill="none" style={{ position: 'absolute', opacity: 0.6 }}>
      <path
        d="M5 25C15 10 35 35 55 20C75 5 95 30 115 15"
        stroke={currentAccent.primary}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        style={{ strokeDasharray: '8 6' }}
      />
    </svg>
  );

  // Block Icon (Component Symbol)
  const BlockIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill={currentAccent.primary} />
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill={currentAccent.primary} opacity="0.6" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill={currentAccent.primary} opacity="0.6" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill={currentAccent.primary} opacity="0.3" />
    </svg>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: theme.bg,
      color: theme.text,
      fontFamily: 'Inter, system-ui, sans-serif',
      transition: 'all 0.3s ease'
    }}>

      {/* Design Controls */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: darkMode ? 'rgba(15, 23, 42, 0.9)' : 'rgba(248, 250, 252, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme.border}`,
        padding: '12px 24px',
        display: 'flex',
        gap: '24px',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>🎨 Design Controls:</span>

        {/* Dark/Light Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bgCard,
            color: theme.text,
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500
          }}
        >
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>

        {/* Accent Color Selector */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: theme.textMuted }}>Accent:</span>
          {Object.keys(colors).map((color) => (
            <button
              key={color}
              onClick={() => setAccentColor(color)}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: accentColor === color ? '3px solid white' : 'none',
                backgroundColor: colors[color].primary,
                cursor: 'pointer',
                boxShadow: accentColor === color ? '0 0 0 2px ' + colors[color].primary : 'none'
              }}
            />
          ))}
        </div>
      </div>

      {/* ========== HERO SECTION ========== */}
      <section style={{
        padding: '80px 24px 100px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Gradient */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '800px',
          background: `radial-gradient(circle, ${currentAccent.primary}15 0%, transparent 70%)`,
          pointerEvents: 'none'
        }} />

        {/* Scribble Decoration */}
        <Scribble className="scribble-1" />

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '100px',
          backgroundColor: `${currentAccent.primary}20`,
          border: `1px solid ${currentAccent.primary}40`,
          marginBottom: '24px',
          fontSize: '13px',
          fontWeight: 500,
          color: currentAccent.primary
        }}>
          <BlockIcon size={16} />
          Community Component Registry
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 72px)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '20px',
          background: currentAccent.gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Bloktastic
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: 'clamp(18px, 3vw, 24px)',
          fontWeight: 500,
          color: theme.text,
          marginBottom: '12px',
          maxWidth: '600px',
          margin: '0 auto 12px'
        }}>
          Discover & Share Storyblok Components
        </p>

        {/* Description */}
        <p style={{
          fontSize: '16px',
          color: theme.textMuted,
          maxWidth: '500px',
          margin: '0 auto 32px',
          lineHeight: 1.6
        }}>
          The community-driven registry for beautiful, reusable Storyblok components.
          Built by developers, for developers.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            padding: '14px 28px',
            fontSize: '15px',
            fontWeight: 600,
            borderRadius: '10px',
            border: 'none',
            background: currentAccent.gradient,
            color: 'white',
            cursor: 'pointer',
            boxShadow: `0 4px 14px ${currentAccent.primary}40`,
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}>
            🚀 Explore Components
          </button>

          <button style={{
            padding: '14px 28px',
            fontSize: '15px',
            fontWeight: 600,
            borderRadius: '10px',
            border: `1px solid ${theme.border}`,
            backgroundColor: theme.bgCard,
            color: theme.text,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            Share Your Component
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '48px',
          justifyContent: 'center',
          marginTop: '60px',
          flexWrap: 'wrap'
        }}>
          {[
            { number: '2,450+', label: 'Components' },
            { number: '850+', label: 'Contributors' },
            { number: '15K+', label: 'Downloads' }
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: currentAccent.primary
              }}>
                {stat.number}
              </div>
              <div style={{ fontSize: '14px', color: theme.textMuted }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== COMPONENT CARDS SECTION ========== */}
      <section style={{
        padding: '60px 24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 700,
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          🔥 Trending Components
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {[
            {
              name: 'Hero Slider Pro',
              author: 'sarah_dev',
              downloads: '1.2K',
              tags: ['Hero', 'Slider', 'Animation'],
              rating: 4.9
            },
            {
              name: 'Pricing Table',
              author: 'componentking',
              downloads: '890',
              tags: ['Pricing', 'Table', 'SaaS'],
              rating: 4.7
            },
            {
              name: 'Testimonial Carousel',
              author: 'ux_maria',
              downloads: '756',
              tags: ['Social Proof', 'Carousel'],
              rating: 4.8
            }
          ].map((component, i) => (
            <div
              key={i}
              style={{
                backgroundColor: theme.bgCard,
                borderRadius: '16px',
                border: `1px solid ${theme.border}`,
                overflow: 'hidden',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
            >
              {/* Preview Area */}
              <div style={{
                height: '160px',
                background: `linear-gradient(135deg, ${theme.bg} 0%, ${theme.bgCard} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: `1px solid ${theme.border}`
              }}>
                <BlockIcon size={48} />
              </div>

              {/* Card Content */}
              <div style={{ padding: '20px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px'
                }}>
                  <h3 style={{
                    fontSize: '17px',
                    fontWeight: 600,
                    margin: 0
                  }}>
                    {component.name}
                  </h3>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '13px',
                    color: '#FFAC00',
                    fontWeight: 600
                  }}>
                    ⭐ {component.rating}
                  </span>
                </div>

                {/* Author & Downloads */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                  fontSize: '13px',
                  color: theme.textMuted
                }}>
                  <span>by @{component.author}</span>
                  <span>⬇️ {component.downloads}</span>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {component.tags.map((tag, j) => (
                    <span
                      key={j}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        backgroundColor: `${currentAccent.primary}15`,
                        color: currentAccent.primary,
                        fontSize: '12px',
                        fontWeight: 500
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
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section style={{
        padding: '80px 24px',
        backgroundColor: theme.bgCard,
        borderTop: `1px solid ${theme.border}`,
        borderBottom: `1px solid ${theme.border}`
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            Why Bloktastic?
          </h2>
          <p style={{
            textAlign: 'center',
            color: theme.textMuted,
            marginBottom: '48px',
            maxWidth: '500px',
            margin: '0 auto 48px'
          }}>
            Everything you need to supercharge your Storyblok projects
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                icon: '🧩',
                title: 'Copy & Paste Ready',
                desc: 'Every component is production-ready. Just copy the schema and start using it.'
              },
              {
                icon: '👥',
                title: 'Community Driven',
                desc: 'Built by the Storyblok community. Vote, review, and contribute your own components.'
              },
              {
                icon: '🎨',
                title: 'Visual Preview',
                desc: 'See how components look before adding them to your project.'
              },
              {
                icon: '⚡',
                title: 'Always Updated',
                desc: 'Components stay current with the latest Storyblok features and best practices.'
              }
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  padding: '28px',
                  borderRadius: '12px',
                  backgroundColor: theme.bg,
                  border: `1px solid ${theme.border}`
                }}
              >
                <div style={{
                  fontSize: '32px',
                  marginBottom: '16px'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '17px',
                  fontWeight: 600,
                  marginBottom: '8px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: theme.textMuted,
                  lineHeight: 1.6,
                  margin: 0
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '48px',
          borderRadius: '24px',
          background: currentAccent.gradient,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative Blocks */}
          <div style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            width: '100px',
            height: '100px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: 'rotate(15deg)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '80px',
            height: '80px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: 'rotate(-10deg)'
          }} />

          <h2 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: 'white',
            marginBottom: '12px',
            position: 'relative'
          }}>
            Ready to boost your Storyblok workflow?
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.85)',
            marginBottom: '24px',
            fontSize: '16px',
            position: 'relative'
          }}>
            Join the community and discover hundreds of components.
          </p>
          <button style={{
            padding: '14px 32px',
            fontSize: '15px',
            fontWeight: 600,
            borderRadius: '10px',
            border: 'none',
            backgroundColor: 'white',
            color: currentAccent.primary,
            cursor: 'pointer',
            position: 'relative'
          }}>
            Get Started for Free →
          </button>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{
        padding: '40px 24px',
        borderTop: `1px solid ${theme.border}`,
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '16px'
        }}>
          <BlockIcon size={24} />
          <span style={{ fontWeight: 700, fontSize: '18px' }}>Bloktastic</span>
        </div>
        <p style={{ fontSize: '14px', color: theme.textMuted }}>
          Made with 💚 for the Storyblok Community
        </p>
        <div style={{
          display: 'flex',
          gap: '24px',
          justifyContent: 'center',
          marginTop: '16px'
        }}>
          {['GitHub', 'Discord', 'Twitter'].map((link, i) => (
            <a
              key={i}
              href="#"
              style={{
                color: theme.textMuted,
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.2s'
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default BloktasticDesignPreview;
