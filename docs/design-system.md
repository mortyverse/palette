# Palette Design System

> Context document for UI/UX implementation. Focuses on unique design patterns beyond Tailwind defaults.

## Brand Identity

**Name:** Palette
**Concept:** Faithful, warm, elegant art education platform
**Visual Style:** Classical with modern clarity, emphasizing trust and quality

---

## Color Palette

### Primary Colors
```css
--bg-color: #F7F5EF          /* Warm creamy beige - main background */
--card-bg: #FCFBF8           /* Off-white - elevated surfaces */
--text-primary: #3E362E      /* Dark warm brown - primary text */
--text-secondary: #70665C    /* Medium warm brown - secondary text */
```

### Accent Colors
```css
--accent-gold: #A6926D       /* Muted antique gold - primary actions */
--accent-dark: #857252       /* Darker gold - hover states */
--border-color: #E6E2D6      /* Subtle warm border */
```

### Semantic Colors
```css
--danger: #D9534F            /* Destructive actions, costs, warnings */
--mentor-highlight: #A6926D  /* Mentor comment borders */
--credit-bg: #F0EBE0         /* Credit info background */
```

---

## Typography

### Font Families
- **Serif (Headings):** `'Playfair Display', serif` - h1, h2, h3, brand
- **Sans-serif (Body):** `'Lato', sans-serif` - body text, UI elements

### Type Scale (Unique Sizes)
```
Brand Logo:      2rem (compact: 1.5rem)
Page Title:      2.5rem - 2.8rem
Section Header:  2rem - 2.2rem
Card Title:      1.3rem
Body:            0.95rem - 1rem
Label:           0.75rem (uppercase, bold, letter-spacing: 0.5px)
Small:           0.8rem - 0.85rem
```

### Font Weights
- Regular: 400
- Medium: 500
- Bold: 700

---

## Layout

### Container Widths
- Main content: `max-w-[1200px]`
- Form pages: `max-w-[800px]`
- Detail view: `max-w-[1100px]`

### Grid System
```css
/* Artwork/Card Grid */
grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
gap: 2.5rem;

/* Detail Layout (2-column) */
grid-template-columns: 1.5fr 1fr;
gap: 3rem;
```

---

## Components

### Header
```
Height: 60px (compact) | auto (standard)
Padding: 1.5rem 3rem
Border: 1px solid rgba(62, 54, 46, 0.08) (bottom)
Background: var(--bg-color)

Layout: flex, space-between
- Left: Brand logo (Playfair Display, 2rem)
- Right: Nav (flex, gap: 2rem)
```

**Hover State:** Links change to `var(--accent-gold)`

---

### Cards

**Base Styles:**
```css
background: var(--card-bg)
border-radius: 12px
padding: 1.8rem (body)
box-shadow: 0 4px 20px rgba(62, 54, 46, 0.04)
border: 1px solid rgba(62, 54, 46, 0.03)
```

**Hover Effect:**
```css
transform: translateY(-8px)
box-shadow: 0 12px 30px rgba(62, 54, 46, 0.08)
transition: transform 0.3s ease, box-shadow 0.3s ease
```

**Card Image:**
- Height: 240px
- Object-fit: cover
- Hover zoom: `scale(1.05)` with 0.5s ease transition

---

### Badges & Pills

#### Score Pill
```css
position: absolute; top: 12px; right: 12px
background: var(--accent-gold)
color: white
padding: 6px 10px
border-radius: 50px
font-size: 0.8rem
font-weight: 700
box-shadow: 0 2px 8px rgba(0,0,0,0.15)
```

#### Card Badge (Student/Category)
```css
position: absolute; top: 12px; left: 12px
background: rgba(255, 255, 255, 0.9)
color: var(--text-primary)
padding: 6px 10px
font-size: 0.75rem
font-weight: 700
border-radius: 4px
backdrop-filter: blur(4px)
```

#### Mentor Badge (Floating)
```css
position: absolute; top: -10px; left: 20px
background: var(--mentor-badge-bg)
color: var(--mentor-badge-text)
padding: 2px 10px
font-size: 0.75rem
text-transform: uppercase
border-radius: 4px
```

---

### Buttons

#### Primary Button
```css
background: var(--accent-gold)
color: white
padding: 0.8rem 2rem (inline) | 0.9rem 1rem (full)
border-radius: 6px
font-weight: 700
text-transform: uppercase
letter-spacing: 0.5px (optional for labels)
transition: background 0.2s

hover: var(--accent-dark)
```

#### Secondary Button (Outlined)
```css
background: var(--card-bg)
color: var(--accent-gold)
border: 1px solid var(--accent-gold)
padding: 0.9rem
border-radius: 6px
font-weight: 700
text-transform: uppercase
letter-spacing: 1px
transition: all 0.2s

hover:
  background: var(--accent-gold)
  color: white
```

#### Action Button (Icon + Text)
```css
background: none
border: 1px solid var(--border-color)
padding: 0.5rem 1rem
border-radius: 4px
color: var(--text-secondary)
display: flex; gap: 0.5rem

hover:
  border-color: var(--accent-gold)
  color: var(--accent-gold)
```

---

### Forms

#### Input / Select / Textarea
```css
width: 100%
padding: 0.8rem 1rem
border: 1px solid var(--border-color)
border-radius: 6px
background: white
font-size: 1rem
font-family: 'Lato', sans-serif

focus:
  outline: none
  border-color: var(--accent-gold)
```

#### Textarea Specific
```css
min-height: 150px
resize: vertical
```

#### Label
```css
display: block
font-weight: 700
margin-bottom: 0.5rem
color: var(--text-primary)

/* For search inputs - uppercase accent style */
font-size: 0.75rem
color: var(--accent-gold)
text-transform: uppercase
letter-spacing: 0.5px
```

#### Upload Area
```css
border: 2px dashed var(--accent-gold)
border-radius: 8px
padding: 2rem
text-align: center
background: rgba(166, 146, 109, 0.05)
cursor: pointer
transition: background 0.2s

hover:
  background: rgba(166, 146, 109, 0.1)
```

**Icon:** 2rem, color: var(--accent-gold)

---

### Hero Section

```css
height: 520px
display: flex
align-items: flex-end
justify-content: center
padding-bottom: 4rem
background-image: url(...)
background-size: cover
background-position: center
filter: brightness(0.95) sepia(0.15) contrast(0.9)
```

#### Search Container (Translucent Card)
```css
background: rgba(252, 251, 248, 0.85)
backdrop-filter: blur(8px)
padding: 1rem 1.5rem
border-radius: 12px
box-shadow: 0 8px 32px rgba(62, 54, 46, 0.1)
border: 1px solid rgba(255,255,255,0.4)
max-width: 800px

display: flex
gap: 0.8rem
flex-wrap: wrap
```

---

### Comment System

#### Mentor Comment (Highlighted)
```css
background: white
border: 1px solid var(--accent-gold)
border-radius: 8px
padding: 1.5rem
box-shadow: 0 4px 15px rgba(166, 146, 109, 0.1)
position: relative
```

With floating badge at `top: -10px; left: 20px`

#### Regular Comment
```css
padding: 1rem 0
border-bottom: 1px solid #eee
```

#### Comment Header
```css
display: flex
justify-content: space-between
margin-bottom: 0.8rem
font-size: 0.9rem

username: font-weight: bold
date: color: #999; font-size: 0.8rem
```

---

### Credit Info Bar

```css
background: #F0EBE0
padding: 1rem
border-radius: 6px
border: 1px solid var(--border-color)
display: flex
justify-content: space-between
align-items: center

.credit-balance: font-weight: 700; color: var(--accent-dark)
.credit-cost: font-weight: 700; color: var(--danger)
```

---

### Canvas/Studio Interface

#### Toolbar (Floating Vertical)
```css
position: absolute
left: 20px; top: 50%
transform: translateY(-50%)
background: var(--toolbar-bg)
padding: 10px
border-radius: 8px
box-shadow: 0 4px 15px rgba(0,0,0,0.3)
z-index: 100

display: flex
flex-direction: column
gap: 10px
```

#### Tool Button
```css
width: 40px; height: 40px
background: rgba(255,255,255,0.1)
border: none
border-radius: 4px
color: var(--toolbar-text)
font-size: 1.2rem

hover: background: rgba(255,255,255,0.2)
active: background: var(--accent-gold); color: white
```

#### View Controls (Bottom Floating)
```css
position: absolute
bottom: 20px; left: 50%
transform: translateX(-50%)
background: white
padding: 8px 16px
border-radius: 50px
box-shadow: 0 4px 15px rgba(0,0,0,0.2)
z-index: 100

display: flex; gap: 1rem
```

---

## Visual Effects

### Shadows
```css
/* Cards */
box-shadow: 0 4px 20px rgba(62, 54, 46, 0.04)

/* Cards (hover) */
box-shadow: 0 12px 30px rgba(62, 54, 46, 0.08)

/* Floating elements */
box-shadow: 0 8px 32px rgba(62, 54, 46, 0.1)

/* Mentor comments */
box-shadow: 0 4px 15px rgba(166, 146, 109, 0.1)

/* Dark overlays */
box-shadow: 0 4px 15px rgba(0,0,0,0.3)
```

### Transitions
```css
/* Default */
transition: all 0.2s

/* Card hover */
transition: transform 0.3s ease, box-shadow 0.3s ease

/* Image zoom */
transition: transform 0.5s ease
```

### Backdrop Effects
```css
/* Search container */
backdrop-filter: blur(8px)

/* Badge with blur */
backdrop-filter: blur(4px)
```

---

## Spacing Scale (Non-Tailwind)

```
Card gap: 2.5rem
Section margin: 3rem - 4rem
Form group: 1.5rem
Card padding: 1.8rem
Container padding: 1.5rem - 3rem
```

---

## Interaction States

### Hover
- Links: `color: var(--accent-gold)`
- Buttons: Background darkens to `var(--accent-dark)`
- Cards: Lift up 8px with stronger shadow
- Images: Scale 1.05
- Borders: Change to `var(--accent-gold)`

### Focus
- Form inputs: `border-color: var(--accent-gold)`, `outline: none`

### Active
- Tool buttons: `background: var(--accent-gold)`

---

## Implementation Notes

1. **Color Warmth:** All colors use warm undertones (beige, brown, gold). Avoid cool grays.
2. **Accessibility:** Maintain contrast ratios - dark warm brown (#3E362E) on light backgrounds.
3. **Typography Hierarchy:** Always use Playfair Display for headings/brand, Lato for UI.
4. **Elevation:** Cards use subtle shadows; only mentor feedback and floating tools use stronger shadows.
5. **Rounded Corners:** Cards/containers use 12px; buttons/inputs use 4-6px; pills use 50px.
6. **Mentor Highlighting:** Use gold borders and floating badges to distinguish mentor content.
