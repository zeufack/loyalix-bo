# Loyalix Theme Implementation Plan

## Overview

This plan outlines the implementation of a custom Loyalix brand theme for the Back Office dashboard. The current setup uses shadcn/ui with CSS variables, making theme customization straightforward.

---

## Phase 1: Brand Identity & Color System

### 1.1 Define Brand Colors (HSL Format)

**Recommended Loyalix Color Palette:**

```css
/* Primary - Main brand color (suggested: vibrant blue/teal for loyalty/trust) */
--loyalix-primary: 199 89% 48%;        /* #0ea5e9 - Sky blue */
--loyalix-primary-dark: 200 98% 39%;   /* #0284c7 - Darker for hover */

/* Secondary - Supporting color */
--loyalix-secondary: 262 83% 58%;      /* #8b5cf6 - Purple (rewards/premium feel) */

/* Accent - Highlights and CTAs */
--loyalix-accent: 142 76% 36%;         /* #16a34a - Green (success/points) */

/* Neutral palette */
--loyalix-gray-50: 210 40% 98%;
--loyalix-gray-100: 210 40% 96%;
--loyalix-gray-200: 214 32% 91%;
--loyalix-gray-300: 213 27% 84%;
--loyalix-gray-400: 215 20% 65%;
--loyalix-gray-500: 215 16% 47%;
--loyalix-gray-600: 215 19% 35%;
--loyalix-gray-700: 215 25% 27%;
--loyalix-gray-800: 217 33% 17%;
--loyalix-gray-900: 222 47% 11%;
```

### 1.2 Files to Update

| File | Changes |
|------|---------|
| `app/globals.css` | Update all CSS variables (`:root` and `.dark`) |
| `tailwind.config.ts` | Add custom color extensions if needed |

---

## Phase 2: Brand Assets

### 2.1 Logo Implementation

**Required Assets:**
- [ ] Primary logo SVG (full color)
- [ ] Logo mark only (icon version)
- [ ] White/inverted logo for dark backgrounds
- [ ] Favicon (16x16, 32x32, 180x180 for Apple)

**Files to Update:**
| File | Changes |
|------|---------|
| `components/icons.tsx` | Replace `Logo()` component with Loyalix logo |
| `public/favicon.ico` | Add Loyalix favicon |
| `public/logo.svg` | Add full logo |
| `public/logo-mark.svg` | Add icon-only version |
| `app/layout.tsx` | Update metadata with brand info |

### 2.2 Image Assets

| Asset | Location | Purpose |
|-------|----------|---------|
| `login-bg.jpg` | `public/` | Login page background |
| `placeholder-user.jpg` | `public/` | Default avatar |
| `empty-state.svg` | `public/` | Empty data illustrations |

---

## Phase 3: Typography

### 3.1 Font Selection

**Recommended:** Inter (modern, clean, highly readable)

**Alternative Options:**
- Poppins (friendly, rounded)
- Plus Jakarta Sans (modern, professional)
- DM Sans (geometric, clean)

### 3.2 Implementation

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// Apply to body
<body className={`${inter.variable} font-sans`}>
```

```typescript
// tailwind.config.ts
fontFamily: {
  sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
}
```

---

## Phase 4: Component Customization

### 4.1 Button Variants

Add Loyalix-specific button styles:

```typescript
// components/ui/button.tsx - Add new variants
brand: 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90',
success: 'bg-green-600 text-white hover:bg-green-700',
```

### 4.2 Card Enhancements

```css
/* Add subtle brand touches */
.card-brand {
  border-left: 4px solid hsl(var(--primary));
}
```

### 4.3 Data Table Styling

- Add alternating row colors
- Brand-colored selection states
- Custom pagination styling

---

## Phase 5: Dark Mode Polish

### 5.1 Dark Theme Colors

```css
.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;
  --primary: 199 89% 48%;
  --primary-foreground: 222 47% 11%;
  /* ... continue with dark variants */
}
```

### 5.2 Theme Toggle Enhancement

- Add smooth transition between themes
- Persist preference in localStorage
- Optional: System preference detection

---

## Phase 6: Login Page Branding

### 6.1 Updates Required

| Element | Change |
|---------|--------|
| Logo | Large Loyalix logo above form |
| Background | Brand gradient or image |
| Form card | Subtle shadow, brand accent |
| Footer | "Powered by Loyalix" text |

### 6.2 Design Concept

```
┌─────────────────────────────────────────┐
│                                         │
│         [LOYALIX LOGO]                  │
│                                         │
│    ┌─────────────────────────┐          │
│    │                         │          │
│    │   Welcome Back          │          │
│    │                         │          │
│    │   [Email Input]         │          │
│    │   [Password Input]      │          │
│    │                         │          │
│    │   [Sign In Button]      │          │
│    │                         │          │
│    └─────────────────────────┘          │
│                                         │
│         © 2024 Loyalix                  │
└─────────────────────────────────────────┘
```

---

## Phase 7: Dashboard Polish

### 7.1 Sidebar Branding

- Loyalix logo at top
- Brand-colored active states
- Subtle hover effects

### 7.2 Header Updates

- Welcome message with user name
- Brand-styled notifications
- Profile dropdown with avatar

### 7.3 Stats Cards

- Gradient backgrounds for key metrics
- Brand icons
- Animated counters

---

## Implementation Checklist

### Quick Wins (1-2 hours)
- [ ] Update CSS variables in `globals.css`
- [ ] Replace logo in `icons.tsx`
- [ ] Add favicon
- [ ] Update page titles and metadata

### Core Theme (2-4 hours)
- [ ] Implement custom font
- [ ] Fine-tune color palette
- [ ] Update dark mode colors
- [ ] Style login page

### Polish (2-4 hours)
- [ ] Add custom button variants
- [ ] Style data tables
- [ ] Add loading animations
- [ ] Create empty state illustrations

### Final Touches (1-2 hours)
- [ ] Test all components
- [ ] Verify accessibility (contrast)
- [ ] Test responsive design
- [ ] Cross-browser testing

---

## CSS Variables Reference

### Complete Light Theme

```css
:root {
  /* Background & Foreground */
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;

  /* Primary - Main brand */
  --primary: 199 89% 48%;
  --primary-foreground: 0 0% 100%;

  /* Secondary */
  --secondary: 210 40% 96%;
  --secondary-foreground: 222 47% 11%;

  /* Accent */
  --accent: 210 40% 96%;
  --accent-foreground: 222 47% 11%;

  /* Muted */
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;

  /* Destructive */
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;

  /* Card */
  --card: 0 0% 100%;
  --card-foreground: 222 47% 11%;

  /* Popover */
  --popover: 0 0% 100%;
  --popover-foreground: 222 47% 11%;

  /* Border & Input */
  --border: 214 32% 91%;
  --input: 214 32% 91%;
  --ring: 199 89% 48%;

  /* Radius */
  --radius: 0.5rem;
}
```

### Complete Dark Theme

```css
.dark {
  --background: 222 47% 11%;
  --foreground: 210 40% 98%;

  --primary: 199 89% 48%;
  --primary-foreground: 222 47% 11%;

  --secondary: 217 33% 17%;
  --secondary-foreground: 210 40% 98%;

  --accent: 217 33% 17%;
  --accent-foreground: 210 40% 98%;

  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;

  --destructive: 0 62% 30%;
  --destructive-foreground: 0 0% 100%;

  --card: 222 47% 11%;
  --card-foreground: 210 40% 98%;

  --popover: 222 47% 11%;
  --popover-foreground: 210 40% 98%;

  --border: 217 33% 17%;
  --input: 217 33% 17%;
  --ring: 199 89% 48%;
}
```

---

## Estimated Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1: Colors | 1 hour | Brand guidelines |
| Phase 2: Assets | 2 hours | Logo files |
| Phase 3: Typography | 30 min | Font selection |
| Phase 4: Components | 2 hours | Phases 1-3 |
| Phase 5: Dark Mode | 1 hour | Phase 1 |
| Phase 6: Login | 1 hour | Phases 1-3 |
| Phase 7: Dashboard | 2 hours | All phases |
| **Total** | **~10 hours** | |

---

## Questions to Clarify Before Implementation

1. **Brand Colors**: Do you have specific hex/RGB values for Loyalix brand?
2. **Logo**: Do you have SVG files ready, or need them created?
3. **Font**: Any preference for the typeface?
4. **Dark Mode**: Should it follow system preference or be manual toggle?
5. **Illustrations**: Need custom empty state graphics?

---

## Next Steps

1. Confirm brand colors and get logo assets
2. Choose font family
3. I'll implement Phase 1 (colors) first
4. Review and iterate on each phase
