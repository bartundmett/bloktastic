# Bloktastic Design Guide

> **Design Philosophy:** "Build with Joy. Share with Pride."
>
> Bloktastic ist eine Community Component Registry für Storyblok. Das Design soll die Verbindung zu Storyblok zeigen, aber mit einem freundlicheren, community-getriebenen Vibe.

---

## 🎨 Farbpalette

### Primärfarben

| Name | Hex | Verwendung |
|------|-----|------------|
| **Joy** | `#E8956C` | Warmes Pfirsich/Coral - emotionale Highlights, "Joy" im Headline |
| **Intelligence** | `#00B3B0` | Storyblok-Teal - Tech-Elemente, Links, Primary Actions |
| **Dark** | `#1B243F` | Graphite - Headlines, Body Text, Primary Buttons |

### Sekundärfarben

| Name | Hex | Verwendung |
|------|-----|------------|
| **Sky** | `#3B82F6` | Helles Blau - Stats, Tags, Akzente |
| **Mint** | `#10B981` | Frisches Grün - Success States, Badges |
| **Lavender** | `#8B5CF6` | Sanftes Lila - Card Gradients, Decorations |

### Neutrale Farben

| Name | Hex | Verwendung |
|------|-----|------------|
| **White** | `#FFFFFF` | Hintergründe, Cards |
| **Light BG** | `#F0F7FF` | Section-Hintergründe, Hover States |
| **Muted** | `#64748B` | Sekundärer Text, Beschreibungen |
| **Border** | `#E2E8F0` | Card Borders, Dividers |

### Gradient-Definitionen

```css
/* Hero Background */
background: linear-gradient(180deg, #FFFFFF 0%, #F0F7FF 100%);

/* CTA Section */
background: linear-gradient(135deg, #00B3B0 0%, #3B82F6 100%);

/* Card Previews (variieren) */
background: linear-gradient(135deg, #F0F7FF 0%, #E0F2FE 50%, rgba(0,179,176,0.2) 100%); /* Teal */
background: linear-gradient(135deg, #FEF3C7 0%, rgba(232,149,108,0.2) 100%); /* Joy/Warm */
background: linear-gradient(135deg, #F3E8FF 0%, rgba(139,92,246,0.2) 100%); /* Lavender */
```

---

## 📝 Typografie

### Font Family

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

> **Note:** Storyblok verwendet Roboto. Für Bloktastic nutzen wir System Fonts für bessere Performance, aber Roboto ist eine gute Alternative.

### Font Sizes & Weights

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| **Hero Headline** | `clamp(48px, 8vw, 72px)` | 800 | 1.1 |
| **Section Headlines** | `36px` | 800 | 1.2 |
| **Card Titles** | `17px` | 700 | 1.3 |
| **Body Text** | `16px` | 400 | 1.6 |
| **Small Text** | `14px` | 500 | 1.5 |
| **Tags/Badges** | `12-13px` | 500-600 | 1.4 |

### Headline-Stil mit Farbakzenten

```jsx
<h1>
  Build with <span style={{ color: '#E8956C' }}>Joy.</span>
  <br />
  Share with <span style={{ color: '#00B3B0' }}>Pride.</span>
</h1>
```

---

## 🧩 UI Components

### Buttons

#### Primary Button (Dark)
```css
padding: 16px 32px;
font-size: 16px;
font-weight: 600;
border-radius: 12px;
border: none;
background-color: #1B243F;
color: #FFFFFF;
box-shadow: 0 4px 14px rgba(27, 36, 63, 0.25);
```

#### Secondary Button (Outline)
```css
padding: 16px 32px;
font-size: 16px;
font-weight: 600;
border-radius: 12px;
border: 1px solid #E2E8F0;
background-color: #FFFFFF;
color: #1B243F;
```

#### Button auf Gradient-Hintergrund
```css
padding: 16px 32px;
font-weight: 700;
border-radius: 12px;
border: none;
background-color: #FFFFFF;
color: #1B243F;
```

### Cards

```css
background-color: #FFFFFF;
border-radius: 20px;
border: 1px solid #E2E8F0;
box-shadow: 0 4px 12px rgba(0,0,0,0.04);
overflow: hidden;
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Hover State */
transform: translateY(-4px);
box-shadow: 0 20px 40px rgba(0,0,0,0.08);
```

### Tags/Badges

```css
padding: 4px 10px;
border-radius: 8px;
background-color: #F0F7FF;
color: #3B82F6;
font-size: 12px;
font-weight: 500;
```

### Feature Icons (Emoji-basiert)

```css
width: 48px;
height: 48px;
border-radius: 12px;
background-color: rgba(0,179,176,0.15); /* Mit Farb-Variation */
display: flex;
align-items: center;
justify-content: center;
font-size: 24px;
```

---

## ✨ Dekorative Elemente

### Sterne (Stars)

```jsx
<span style={{ fontSize: '16px', color: '#1B243F', opacity: 0.4 }}>✦</span>
<span style={{ fontSize: '12px', color: '#1B243F', opacity: 0.3 }}>✦</span>
<span style={{ fontSize: '8px', color: '#1B243F', opacity: 0.2 }}>✦</span>
```

Platzierung: Verstreut im Hero-Bereich, subtil und nicht übertrieben.

### Background Blobs

```css
/* Warmer Blob (Joy) */
position: absolute;
width: 400px;
height: 400px;
border-radius: 50%;
background: linear-gradient(135deg, rgba(232,149,108,0.2) 0%, rgba(232,149,108,0.05) 100%);
filter: blur(60px);

/* Kühler Blob (Intelligence) */
background: linear-gradient(135deg, rgba(0,179,176,0.15) 0%, rgba(0,179,176,0.05) 100%);
```

### Floating Rectangles (CTA Section)

```css
position: absolute;
width: 120px;
height: 120px;
border-radius: 24px;
background-color: rgba(255,255,255,0.1);
transform: rotate(15deg);
```

---

## 🏗️ Layout & Spacing

### Section Padding

| Section | Padding |
|---------|---------|
| Navigation | `16px 32px` |
| Hero | `80px 32px 100px` |
| Content Sections | `80px 32px` |
| Footer | `48px 32px` |

### Max Widths

| Element | Max Width |
|---------|-----------|
| Content Container | `1200px` |
| Text Content | `1000px` |
| Narrow Text (Headlines) | `550px` |
| CTA Box | `700px` |

### Grid für Cards

```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 24px;
```

---

## 🎭 Design Principles

### 1. **Joyful, nicht Childish**
- Warme Farben und sanfte Gradients
- Spielerische Elemente (Sterne, Blobs) aber dezent
- Professionell genug für Developer

### 2. **Storyblok-Verbindung**
- Teal (#00B3B0) als Hauptakzent
- Ähnliche Card-Styles
- Block-Logo als visuelles Symbol

### 3. **Community-Vibe**
- Freundliche Sprache ("Built by developers, for developers")
- Contributor-Fokus (@author Mentions)
- Social Proof (Downloads, Ratings)

### 4. **Light & Airy**
- Light Mode als Default
- Viel Whitespace
- Sanfte Schatten statt harte Borders

### 5. **Performance First**
- System Fonts
- CSS-basierte Animationen
- Keine schweren Assets

---

## 📐 Bloktastic Logo

Das Logo besteht aus 4 farbigen Blöcken:

```jsx
<svg width="32" height="32" viewBox="0 0 32 32">
  <rect x="2" y="2" width="12" height="12" rx="3" fill="#00B3B0" />  {/* Teal */}
  <rect x="18" y="2" width="12" height="12" rx="3" fill="#E8956C" /> {/* Joy */}
  <rect x="2" y="18" width="12" height="12" rx="3" fill="#3B82F6" /> {/* Sky */}
  <rect x="18" y="18" width="12" height="12" rx="3" fill="#10B981" /> {/* Mint */}
</svg>
```

**Symbolik:** Blöcke = Components, verschiedene Farben = Vielfalt der Community

---

## 🔗 Referenzen & Inspiration

### Storyblok Website Analyse (Februar 2026)

**Key Findings:**
- Slogan: "Create with Joy. Scale with Intelligence."
- "Joy" = Pfirsich/Coral Farbe
- "Intelligence" = Türkis/Blau
- Heller, freundlicher Look (Light Mode)
- Echte Fotos von lächelnden Menschen
- Floating AI-Icons mit gestrichelten Linien
- JoyConf: 3D-Landschaft mit grünen Hügeln, Pastellfarben
- Schwarze Primary Buttons ("Try for Free")
- G2 5-Sterne Rating als Social Proof

### SaaS Landing Page Trends 2025/2026

- Scroll-triggered Animations
- Oversized Typography
- Multi-color Gradients
- Performance-first (keine Auto-Play Videos)
- Personalisierte CTAs
- Dark + Light Mode Toggle

---

## 📁 File Structure

```
bloktastic/
├── DESIGN_GUIDE.md          # Diese Datei
├── bloktastic-joyful.jsx    # Aktuelle Design-Preview
├── bloktastic-design-preview.jsx  # Ältere Dark-Mode Version
└── ...
```

---

*Last updated: Februar 2026*
