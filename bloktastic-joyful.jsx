import React, { useState } from 'react';

// Bloktastic - Joyful Edition
// Inspired by Storyblok's "Create with Joy" Design Language

const BloktasticJoyful = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  // Storyblok-inspired Color Palette
  const colors = {
    joy: '#E8956C',        // Warm peach/coral (like "Joy" in Storyblok headline)
    intelligence: '#00B3B0', // Teal (like "Intelligence")
    sky: '#3B82F6',        // Bright blue
    mint: '#10B981',       // Fresh green
    lavender: '#8B5CF6',   // Soft purple
    dark: '#1B243F',       // Graphite for text
    muted: '#64748B',      // Muted text
    lightBg: '#F0F7FF',    // Very light blue background
    white: '#FFFFFF',
  };

  // Decorative Star Component
  const Stars = ({ style }) => (
    <div style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <span style={{ fontSize: '16px', color: colors.dark, opacity: 0.4 }}>✦</span>
      <span style={{ fontSize: '12px', color: colors.dark, opacity: 0.3, marginLeft: '4px' }}>✦</span>
      <span style={{ fontSize: '8px', color: colors.dark, opacity: 0.2, marginLeft: '2px' }}>✦</span>
    </div>
  );

  // Block Logo Component
  const BlockLogo = ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="3" fill={colors.intelligence} />
      <rect x="18" y="2" width="12" height="12" rx="3" fill={colors.joy} />
      <rect x="2" y="18" width="12" height="12" rx="3" fill={colors.sky} />
      <rect x="18" y="18" width="12" height="12" rx="3" fill={colors.mint} />
    </svg>
  );

  // Component Card
  const ComponentCard = ({ name, author, downloads, tags, gradient, index }) => (
    <div
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
      style={{
        backgroundColor: colors.white,
        borderRadius: '20px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hoveredCard === index ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hoveredCard === index
          ? '0 20px 40px rgba(0,0,0,0.08)'
          : '0 4px 12px rgba(0,0,0,0.04)',
        cursor: 'pointer',
      }}
    >
      {/* Preview Area with Gradient */}
      <div style={{
        height: '140px',
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <BlockLogo size={48} />
        {/* Floating decorative elements */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255,255,255,0.3)',
          transform: 'rotate(12deg)',
        }} />
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '8px'
        }}>
          <h3 style={{
            fontSize: '17px',
            fontWeight: 700,
            margin: 0,
            color: colors.dark,
          }}>
            {name}
          </h3>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '13px',
            color: '#F59E0B',
            fontWeight: 600
          }}>
            ★ 4.9
          </span>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          fontSize: '13px',
          color: colors.muted
        }}>
          <span>by <span style={{ color: colors.intelligence, fontWeight: 500 }}>@{author}</span></span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            {downloads}
          </span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {tags.map((tag, j) => (
            <span
              key={j}
              style={{
                padding: '4px 10px',
                borderRadius: '8px',
                backgroundColor: colors.lightBg,
                color: colors.sky,
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
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: colors.white,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>

      {/* Navigation */}
      <nav style={{
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #F1F5F9',
        backgroundColor: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BlockLogo size={28} />
          <span style={{
            fontWeight: 800,
            fontSize: '20px',
            color: colors.dark,
          }}>
            Bloktastic
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {['Explore', 'Categories', 'Submit', 'Docs'].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                color: colors.muted,
                textDecoration: 'none',
                fontSize: '15px',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
            >
              {item}
            </a>
          ))}
        </div>

        <button style={{
          padding: '10px 20px',
          fontSize: '14px',
          fontWeight: 600,
          borderRadius: '10px',
          border: 'none',
          backgroundColor: colors.dark,
          color: colors.white,
          cursor: 'pointer',
        }}>
          Sign In
        </button>
      </nav>

      {/* ========== HERO SECTION ========== */}
      <section style={{
        padding: '80px 32px 100px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(180deg, ${colors.white} 0%, ${colors.lightBg} 100%)`,
      }}>
        {/* Decorative Background Blobs */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.joy}20 0%, ${colors.joy}05 100%)`,
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-50px',
          left: '-100px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.intelligence}15 0%, ${colors.intelligence}05 100%)`,
          filter: 'blur(60px)',
        }} />

        {/* Decorative Stars */}
        <Stars style={{ top: '120px', left: '20%' }} />
        <Stars style={{ top: '200px', right: '15%' }} />
        <Stars style={{ bottom: '150px', left: '25%' }} />

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '100px',
          backgroundColor: colors.white,
          border: '1px solid #E2E8F0',
          marginBottom: '28px',
          fontSize: '14px',
          fontWeight: 500,
          color: colors.muted,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <span style={{ fontSize: '16px' }}>🧩</span>
          Community Component Registry for Storyblok
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 72px)',
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: '20px',
          color: colors.dark,
        }}>
          Build with{' '}
          <span style={{ color: colors.joy }}>Joy.</span>
          <br />
          Share with{' '}
          <span style={{ color: colors.intelligence }}>Pride.</span>
        </h1>

        {/* Subheadline */}
        <p style={{
          fontSize: '20px',
          color: colors.muted,
          maxWidth: '550px',
          margin: '0 auto 36px',
          lineHeight: 1.6,
        }}>
          Discover beautiful, production-ready Storyblok components
          crafted by the community. Copy, paste, and ship faster.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '12px',
            border: 'none',
            backgroundColor: colors.dark,
            color: colors.white,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(27, 36, 63, 0.25)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}>
            Explore Components
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>

          <button style={{
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            backgroundColor: colors.white,
            color: colors.dark,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}>
            Share Your Component
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '64px',
          justifyContent: 'center',
          marginTop: '64px',
          flexWrap: 'wrap',
        }}>
          {[
            { number: '2,450+', label: 'Components', color: colors.intelligence },
            { number: '850+', label: 'Contributors', color: colors.joy },
            { number: '15K+', label: 'Downloads', color: colors.sky },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: '36px',
                fontWeight: 800,
                color: stat.color,
              }}>
                {stat.number}
              </div>
              <div style={{ fontSize: '14px', color: colors.muted, fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Trusted By */}
        <div style={{ marginTop: '64px' }}>
          <p style={{ fontSize: '13px', color: colors.muted, marginBottom: '20px', fontWeight: 500 }}>
            Trusted by developers at
          </p>
          <div style={{
            display: 'flex',
            gap: '40px',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.5,
            flexWrap: 'wrap',
          }}>
            {['Vercel', 'Netlify', 'Shopify', 'Adidas', 'Netflix'].map((brand) => (
              <span key={brand} style={{
                fontSize: '18px',
                fontWeight: 700,
                color: colors.dark,
                letterSpacing: '-0.5px',
              }}>
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMPONENT CARDS SECTION ========== */}
      <section style={{
        padding: '80px 32px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 800,
            color: colors.dark,
            marginBottom: '12px',
          }}>
            Trending{' '}
            <span style={{ color: colors.intelligence }}>Components</span>
          </h2>
          <p style={{ color: colors.muted, fontSize: '16px' }}>
            The community's favorites this week
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          <ComponentCard
            index={0}
            name="Hero Slider Pro"
            author="sarah_dev"
            downloads="1.2K"
            tags={['Hero', 'Slider', 'Animation']}
            gradient={`linear-gradient(135deg, ${colors.lightBg} 0%, #E0F2FE 50%, ${colors.intelligence}20 100%)`}
          />
          <ComponentCard
            index={1}
            name="Pricing Table"
            author="componentking"
            downloads="890"
            tags={['Pricing', 'Table', 'SaaS']}
            gradient={`linear-gradient(135deg, #FEF3C7 0%, ${colors.joy}20 100%)`}
          />
          <ComponentCard
            index={2}
            name="Testimonial Carousel"
            author="ux_maria"
            downloads="756"
            tags={['Social Proof', 'Carousel']}
            gradient={`linear-gradient(135deg, #F3E8FF 0%, ${colors.lavender}20 100%)`}
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button style={{
            padding: '12px 24px',
            fontSize: '15px',
            fontWeight: 600,
            borderRadius: '10px',
            border: '1px solid #E2E8F0',
            backgroundColor: colors.white,
            color: colors.dark,
            cursor: 'pointer',
          }}>
            View all components →
          </button>
        </div>
      </section>

      {/* ========== FEATURES SECTION ========== */}
      <section style={{
        padding: '80px 32px',
        backgroundColor: colors.lightBg,
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 800,
              color: colors.dark,
              marginBottom: '12px',
            }}>
              Why{' '}
              <span style={{ color: colors.joy }}>developers</span>
              {' '}love Bloktastic
            </h2>
            <p style={{ color: colors.muted, fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
              Everything you need to supercharge your Storyblok projects
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}>
            {[
              {
                icon: '🧩',
                title: 'Copy & Paste Ready',
                desc: 'Production-ready schemas. Just copy and start using.',
                color: colors.intelligence,
              },
              {
                icon: '👥',
                title: 'Community Driven',
                desc: 'Built by developers, for developers. Vote & contribute.',
                color: colors.joy,
              },
              {
                icon: '👁️',
                title: 'Visual Preview',
                desc: 'See how components look before adding them.',
                color: colors.sky,
              },
              {
                icon: '⚡',
                title: 'Always Fresh',
                desc: 'Updated with latest Storyblok features.',
                color: colors.mint,
              },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  padding: '28px',
                  borderRadius: '16px',
                  backgroundColor: colors.white,
                  border: '1px solid #E2E8F0',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: `${feature.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '16px',
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  marginBottom: '8px',
                  color: colors.dark,
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: colors.muted,
                  lineHeight: 1.6,
                  margin: 0,
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
        padding: '100px 32px',
        textAlign: 'center',
      }}>
        <div style={{
          maxWidth: '700px',
          margin: '0 auto',
          padding: '64px 48px',
          borderRadius: '32px',
          background: `linear-gradient(135deg, ${colors.intelligence} 0%, ${colors.sky} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative elements */}
          <div style={{
            position: 'absolute',
            top: '-30px',
            right: '-30px',
            width: '120px',
            height: '120px',
            borderRadius: '24px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: 'rotate(15deg)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-20px',
            left: '-20px',
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: 'rotate(-10deg)',
          }} />
          <div style={{
            position: 'absolute',
            top: '40%',
            left: '10%',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.08)',
          }} />

          <h2 style={{
            fontSize: '32px',
            fontWeight: 800,
            color: colors.white,
            marginBottom: '16px',
            position: 'relative',
          }}>
            Ready to build something amazing?
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.85)',
            marginBottom: '32px',
            fontSize: '18px',
            position: 'relative',
            maxWidth: '450px',
            margin: '0 auto 32px',
          }}>
            Join hundreds of developers sharing and discovering
            beautiful Storyblok components.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
            <button style={{
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: 700,
              borderRadius: '12px',
              border: 'none',
              backgroundColor: colors.white,
              color: colors.dark,
              cursor: 'pointer',
            }}>
              Get Started Free →
            </button>
            <button style={{
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: '12px',
              border: '2px solid rgba(255,255,255,0.3)',
              backgroundColor: 'transparent',
              color: colors.white,
              cursor: 'pointer',
            }}>
              Browse Components
            </button>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer style={{
        padding: '48px 32px',
        borderTop: '1px solid #E2E8F0',
        backgroundColor: colors.white,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BlockLogo size={24} />
            <span style={{ fontWeight: 700, fontSize: '16px', color: colors.dark }}>
              Bloktastic
            </span>
            <span style={{ color: colors.muted, fontSize: '14px' }}>
              — Made with 💚 for the Storyblok Community
            </span>
          </div>

          <div style={{ display: 'flex', gap: '24px' }}>
            {['GitHub', 'Discord', 'Twitter'].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  color: colors.muted,
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BloktasticJoyful;
