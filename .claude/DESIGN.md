# Design System — AI Reel Creator & Editor
### Production Design Specification v1.2

> Written from a senior product designer perspective. This document governs all visual decisions, component anatomy, interaction patterns, layout systems, and responsive behaviour across the application. Every new UI addition must reference this file before implementation.

**Changelog:**
- **v1.2** — Updated color system to warm natural OKLCH palette; added DM Serif Display display font; light mode is now the default theme; breadcrumb navigation pattern for wizard + editor; text-only wizard (PDF removed); Profile page replaces Settings; route table updated; dashboard nav documented.
- **v1.0** — Initial specification.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Tokens](#2-design-tokens)
   - 2.1 Color System
   - 2.2 Typography Scale
   - 2.3 Spacing System
   - 2.4 Border Radius
   - 2.5 Elevation & Shadows
   - 2.6 Motion & Duration
3. [Grid & Layout System](#3-grid--layout-system)
   - 3.1 Breakpoints
   - 3.2 Container Widths
   - 3.3 Gutter & Column System
4. [Component Anatomy](#4-component-anatomy)
   - 4.1 Button
   - 4.2 Input & Textarea
   - 4.3 Card
   - 4.4 Badge
   - 4.5 Tabs
   - 4.6 Progress
   - 4.7 Scroll Area
   - 4.8 Separator
5. [Composite Components](#5-composite-components)
   - 5.1 Chat Message Bubble
   - 5.2 Scene Card
   - 5.3 Template Card
   - 5.4 Context Input Panel
   - 5.5 Chat Editor Widget
   - 5.6 Generation Progress Panel
   - 5.7 Export Button
6. [Page Layouts](#6-page-layouts)
   - 6.1 Reel Wizard (`/reels/new`)
   - 6.2 Reel Editor (`/reels/[id]`)
7. [Navigation & Shell](#7-navigation--shell)
8. [State Patterns](#8-state-patterns)
   - 8.1 Loading States
   - 8.2 Error States
   - 8.3 Empty States
   - 8.4 Success States
   - 8.5 Disabled States
   - 8.6 Streaming States
9. [Responsive Design Spec](#9-responsive-design-spec)
   - 9.1 Mobile (< 768px)
   - 9.2 Tablet (768px – 1024px)
   - 9.3 Desktop (1024px – 1440px)
   - 9.4 Wide Desktop (> 1440px)
10. [Dark Mode](#10-dark-mode)
11. [Iconography](#11-iconography)
12. [Accessibility](#12-accessibility)
13. [Motion & Transitions](#13-motion--transitions)
14. [Design Anti-Patterns (Do Nots)](#14-design-anti-patterns-do-nots)

---

## 1. Design Philosophy

### Core Principles

**1. Focus over Feature Overload**
The primary job is video creation. Every UI element must earn its place by reducing friction in that single goal. If a control isn't used within the first 3 user interactions on a page, question whether it belongs on the default view.

**2. Progressive Disclosure**
Show the minimal viable controls by default. Reveal advanced options only when the user has established intent (hovering, selecting, expanding). The reel editor is the apex of complexity — all other pages must feel lighter.

**3. Creator-Grade Aesthetic**
Target: Notion meets Descript meets Linear. Clean whitespace, precise typography, subtle depth. Not a generic SaaS dashboard — this is a professional creative tool. The default theme is a warm natural light mode (cream canvas, espresso primary) that feels like a creative studio — paper, ink, natural light. Dark mode is fully supported as an opt-in, using warm espresso tones rather than cold blue-blacks.

**4. Instant Feedback**
Every async action — AI generation, upload, export — must communicate state within 100ms. Latency is acceptable; silence is not. Use optimistic updates where safe.

**5. Typographic Hierarchy as the Primary Layout Mechanism**
Spacing, weight, and size communicate structure before colour does. Don't use colour to create hierarchy — use it to communicate meaning (status, error, category).

---

## 2. Design Tokens

All tokens are defined in `app/globals.css` using CSS custom properties in the OKLCH colour space. The mapping to Tailwind utilities is done via `@theme inline`. **Never hard-code colour values in component files** — always use semantic token names.

---

### 2.1 Color System

#### Semantic Token Architecture

Tokens are split into three tiers:
- **Primitive tokens**: raw OKLCH values (defined in CSS `:root`)
- **Semantic tokens**: purpose-named aliases (`--background`, `--primary`, `--destructive`)
- **Component tokens**: component-scoped aliases (`--sidebar-background`, `--chart-1`)

#### Light Mode Palette — Warm Natural (default)

The palette uses a warm cream canvas with espresso/amber hues (OKLCH hue angle ~52–75). This avoids the cold, sterile feeling of neutral grays and creates a creative studio atmosphere.

| Token | OKLCH | Tailwind Utility | Usage |
|---|---|---|---|
| `--background` | `oklch(0.96 0.014 75)` | `bg-background` | Warm cream page canvas |
| `--foreground` | `oklch(0.20 0.018 55)` | `text-foreground` | Deep espresso body text |
| `--card` | `oklch(0.99 0.006 80)` | `bg-card` | Near-white cards floating above canvas |
| `--card-foreground` | `oklch(0.20 0.018 55)` | `text-card-foreground` | Card body text |
| `--primary` | `oklch(0.30 0.040 52)` | `bg-primary` / `text-primary` | Deep warm espresso — CTA buttons, active states |
| `--primary-foreground` | `oklch(0.97 0.010 78)` | `text-primary-foreground` | Warm cream text on primary |
| `--secondary` | `oklch(0.91 0.018 72)` | `bg-secondary` | Warm sand — secondary buttons |
| `--secondary-foreground` | `oklch(0.28 0.030 55)` | `text-secondary-foreground` | Text on secondary |
| `--muted` | `oklch(0.91 0.016 72)` | `bg-muted` | Warm stone — inactive tabs, input backgrounds |
| `--muted-foreground` | `oklch(0.52 0.022 62)` | `text-muted-foreground` | Warm medium tone for captions, metadata |
| `--accent` | `oklch(0.91 0.018 72)` | `bg-accent` | Hover states on ghost elements |
| `--accent-foreground` | `oklch(0.25 0.030 55)` | `text-accent-foreground` | Text on accent |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `bg-destructive` / `text-destructive` | Error text, delete actions |
| `--border` | `oklch(0.86 0.018 70)` | `border-border` | Warm stone dividers, card borders |
| `--input` | `oklch(0.86 0.018 70)` | `border-input` | Input field border |
| `--ring` | `oklch(0.60 0.025 62)` | `ring-ring` | Focus rings |

#### Dark Mode Palette — Warm Espresso Dark

Dark mode uses warm espresso tones (not cold blue-black). The `<html>` element receives `class="dark"` when dark mode is active; no media query variant is used.

| Token | OKLCH | Notes |
|---|---|---|
| `--background` | `oklch(0.15 0.018 52)` | Rich warm espresso dark canvas |
| `--foreground` | `oklch(0.93 0.014 74)` | Warm cream text |
| `--card` | `oklch(0.20 0.018 52)` | Elevated warm surface |
| `--primary` | `oklch(0.90 0.018 74)` | Inverted: warm cream button on dark background |
| `--primary-foreground` | `oklch(0.20 0.020 52)` | Espresso text on light primary |
| `--muted` | `oklch(0.26 0.020 52)` | Warm dark muted surfaces |
| `--muted-foreground` | `oklch(0.64 0.020 66)` | Warm medium tone for secondary text |
| `--border` | `oklch(1 0 0 / 10%)` | Translucent white border |
| `--input` | `oklch(1 0 0 / 15%)` | Slightly more opaque for input outlines |

#### Status / Category Colours (Scene Type Badges)

These are **not** in the token system by default. Define them as local constants in `components/editor/scene-card.tsx` and export from there if reused:

| Scene Type | Background | Text | Tailwind |
|---|---|---|---|
| `hook` | Purple 100 | Purple 700 | `bg-purple-100 text-purple-700` |
| `context` | Blue 100 | Blue 700 | `bg-blue-100 text-blue-700` |
| `value` | Green 100 | Green 700 | `bg-green-100 text-green-700` |
| `cta` | Orange 100 | Orange 700 | `bg-orange-100 text-orange-700` |

Dark mode overrides for these must use `dark:` variants. As the `.dark` class is used (not media query), apply: `dark:bg-purple-900/30 dark:text-purple-300` etc.

#### Template Accent Colours (Template Cards)

| Template | Accent Class | Usage |
|---|---|---|
| Educational | `bg-blue-50 border-blue-200` | Card background + border |
| Marketing | `bg-yellow-50 border-yellow-200` | Card background + border |
| Entertainment | `bg-pink-50 border-pink-200` | Card background + border |
| Storytelling | `bg-purple-50 border-purple-200` | Card background + border |
| Product Demo | `bg-green-50 border-green-200` | Card background + border |

---

### 2.2 Typography Scale

The project uses three fonts:
- **Geist Sans** (variable, `--font-sans`) — primary UI font for all body text, labels, and interactive elements. Loaded via `next/font/local` in `app/layout.tsx`.
- **Geist Mono** (variable, `--font-mono`) — code, IDs, counters, and technical values. Loaded via `next/font/local`.
- **DM Serif Display** (`--font-display`) — editorial display font used exclusively for landing page hero headlines. Loaded via `next/font/google`. Applied with the `.font-display` utility class or `style={{ fontFamily: 'var(--font-display)' }}`.

#### Type Scale (Desktop)

| Role | Tag | Size | Weight | Line Height | Letter Spacing | Usage |
|---|---|---|---|---|---|---|
| `display` | `h1` | `2.25rem` (36px) | 700 | 1.15 | `-0.02em` | Page hero titles, wizard step headline |
| `heading-xl` | `h2` | `1.5rem` (24px) | 600 | 1.25 | `-0.01em` | Section headings, modal titles |
| `heading-lg` | `h3` | `1.25rem` (20px) | 600 | 1.3 | `-0.01em` | Card titles, panel headers |
| `heading-md` | `h4` | `1rem` (16px) | 600 | 1.4 | `0` | Sub-section labels, sidebar headers |
| `body-lg` | `p` | `1rem` (16px) | 400 | 1.6 | `0` | Primary body text, descriptions |
| `body-md` | `p` | `0.875rem` (14px) | 400 | 1.6 | `0` | Secondary text, form labels |
| `body-sm` | `p` | `0.8125rem` (13px) | 400 | 1.55 | `0` | Captions, metadata, timestamps |
| `caption` | `span` | `0.75rem` (12px) | 400 | 1.5 | `0.01em` | Badges, tags, character counters |
| `mono` | `code` | `0.8125rem` (13px) | 400 | 1.6 | `0` | Code snippets, IDs, technical values |

#### Mobile Type Adjustments

| Role | Mobile Size | Mobile Weight |
|---|---|---|
| `display` | `1.75rem` (28px) | 700 |
| `heading-xl` | `1.25rem` (20px) | 600 |
| `heading-lg` | `1.125rem` (18px) | 600 |

**Rule**: Typography must never be smaller than `0.75rem` (12px) on any device. Never use `text-xs` for interactive labels or primary content.

#### Tailwind Typography Utilities

```
text-2xl font-bold tracking-tight          → display
text-xl font-semibold tracking-tight       → heading-xl
text-lg font-semibold                      → heading-lg
text-base font-semibold                    → heading-md
text-base                                  → body-lg
text-sm                                    → body-md
text-[13px]                                → body-sm
text-xs tracking-wide                      → caption
font-mono text-[13px]                      → mono
```

---

### 2.3 Spacing System

The project uses Tailwind's default spacing scale (4px base unit). All spacing decisions must come from this scale — never use arbitrary pixel values.

#### Spacing Primitives

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Icon gap, tight inline spacing |
| `space-2` | 8px | Internal component padding, icon margins |
| `space-3` | 12px | Compact card padding |
| `space-4` | 16px | Standard card padding, section gaps |
| `space-5` | 20px | — |
| `space-6` | 24px | Large card padding, between-section gaps |
| `space-8` | 32px | Panel padding, layout section spacing |
| `space-10` | 40px | Large section dividers |
| `space-12` | 48px | Hero padding, wizard step gap |
| `space-16` | 64px | Page-level margins |

#### Component Spacing Guidelines

| Context | Padding | Gap between items |
|---|---|---|
| Inline icon + label | `gap-1.5` | — |
| Button internal | `px-4 py-2` (md) / `px-3 py-1.5` (sm) | — |
| Card body | `p-4` or `p-6` | `space-y-3` or `space-y-4` |
| Form fields | — | `space-y-4` |
| Scene list items | `gap-2` | — |
| Chat messages | — | `space-y-3` |
| Sidebar sections | `gap-6` | — |
| Wizard steps | `gap-8` | — |

---

### 2.4 Border Radius

Defined via `--radius: 0.625rem` base. All radius values derive from this.

| Token | Value | Tailwind | Usage |
|---|---|---|---|
| `--radius-sm` | 6px | `rounded-sm` | Badges, small tags, tight chips |
| `--radius-md` | 8px | `rounded-md` | Buttons (sm), inputs, dropdown items |
| `--radius-lg` | 10px | `rounded-lg` | Buttons (md/default), cards |
| `--radius-xl` | 14px | `rounded-xl` | Modals, drawers, floating panels |
| `--radius-2xl` | 18px | `rounded-2xl` | Large feature cards, wizard panels |
| `--radius-3xl` | 22px | `rounded-3xl` | Avatar containers, large image chips |
| `--radius-4xl` | 26px | `rounded-[26px]` | Pill shapes for special CTAs |

**Rule**: Never use `rounded-full` for rectangular elements. Reserve `rounded-full` only for circular avatars/icons and pill-shaped status indicators.

---

### 2.5 Elevation & Shadows

Shadows communicate layering. Use Tailwind shadow utilities with semantic intent:

| Layer | Shadow | Tailwind | Context |
|---|---|---|---|
| Base surface | none | — | Page canvas, static cards |
| Raised surface | `0 1px 3px rgba(0,0,0,0.08)` | `shadow-sm` | Default cards, input focus |
| Floating | `0 4px 16px rgba(0,0,0,0.12)` | `shadow-md` | Dropdowns, popovers, tooltips |
| Elevated | `0 8px 32px rgba(0,0,0,0.16)` | `shadow-lg` | Modals, drawers, floating chat widget |
| Maximum | `0 24px 64px rgba(0,0,0,0.24)` | `shadow-2xl` | Full-screen overlays (use sparingly) |

**Dark mode shadows**: Use `dark:shadow-black/40` to compensate for reduced contrast.

**Chat widget floating**: `shadow-lg` on light, `dark:shadow-black/50` for dark.

---

### 2.6 Motion & Duration

```
Duration:
  instant    →  0ms     (state changes that require no animation: checked, toggled)
  micro      →  100ms   (button press feedback, immediate reactions)
  fast       →  150ms   (hover states, icon swaps)
  normal     →  200ms   (menu open, tab switch, fade-in)
  slow       →  300ms   (drawer slide, modal enter)
  very-slow  →  500ms   (page transition, progress bar)

Easing:
  ease-out   →  cubic-bezier(0, 0, 0.2, 1)   (elements entering the screen)
  ease-in    →  cubic-bezier(0.4, 0, 1, 1)   (elements leaving the screen)
  ease-inout →  cubic-bezier(0.4, 0, 0.2, 1) (elements that move across)
  spring     →  cubic-bezier(0.34, 1.56, 0.64, 1) (bouncy confirm, success states)
```

Tailwind mappings: `transition-colors duration-150 ease-out` for hover states. Use `tw-animate-css` utilities for enter/exit animations.

---

## 3. Grid & Layout System

### 3.1 Breakpoints

```
xs  → 0px     (base, mobile-first)
sm  → 640px   (large phones, 375px+ base handled in base styles)
md  → 768px   (tablets, small laptops)
lg  → 1024px  (standard laptops 13")
xl  → 1280px  (large laptops 15", desktop monitors)
2xl → 1536px  (wide monitors, design-maximised views)
```

### 3.2 Container Widths

| Page | Max Width | Notes |
|---|---|---|
| Wizard (`/reels/new`) | `max-w-2xl` (672px) | Centered, focused flow |
| Reel Editor (`/reels/[id]`) | `100vw` | Full bleed, no max-width |
| Future dashboard | `max-w-7xl` (1280px) | Padded container |
| Auth pages (future) | `max-w-sm` (384px) | Tight, card-style |

All pages use `min-h-screen` and `flex flex-col` on the root.

### 3.3 Column System (Reel Editor)

The Reel Editor uses a **3-column layout**:

```
┌────────────────────────────────────────────────────────────┐
│ TopNav (full width, h-14, sticky)                          │
├──────────────┬─────────────────────────┬───────────────────┤
│ Scene List   │ Preview + Progress       │ (Future: panel)  │
│ w-72 (288px) │ flex-1 (fluid)          │                   │
│ border-r     │                         │                   │
│              │                         │                   │
│              │                         │                   │
└──────────────┴─────────────────────────┴───────────────────┘
                                     ↗ floating chat widget
                              fixed bottom-right
```

**Column widths:**
- Scene list: `w-72` fixed (desktop), collapses to overlay on mobile
- Preview center: `flex-1` fluid
- Top nav: full width, `h-14`, `sticky top-0 z-40`
- Floating chat widget: `fixed bottom-6 right-6`, `w-[360px]`, `max-h-[480px]`

---

## 4. Component Anatomy

### 4.1 Button

**Anatomy:**
```
[  ← icon (optional)  ][  Label  ][  icon → (optional)  ]
```

| Variant | Default Background | Text | Border | Hover | Notes |
|---|---|---|---|---|---|
| `default` | `bg-primary` | `text-primary-foreground` | none | `opacity-90` | Primary CTA |
| `secondary` | `bg-secondary` | `text-secondary-foreground` | none | `bg-secondary/80` | Secondary action |
| `outline` | transparent | `text-foreground` | `border-border` | `bg-accent` | Tertiary action |
| `ghost` | transparent | `text-foreground` | none | `bg-accent` | Icon buttons, nav items |
| `destructive` | `bg-destructive` | white | none | `opacity-90` | Delete / danger |
| `link` | transparent | `text-primary` | none | underline | Inline text links |

| Size | Height | Padding X | Font Size | Icon Size | Gap |
|---|---|---|---|---|---|
| `xs` | 28px | `px-2.5` | `text-xs` | `w-3 h-3` | `gap-1` |
| `sm` | 32px | `px-3` | `text-sm` | `w-3.5 h-3.5` | `gap-1.5` |
| `default` (md) | 36px | `px-4` | `text-sm` | `w-4 h-4` | `gap-2` |
| `lg` | 44px | `px-6` | `text-base` | `w-5 h-5` | `gap-2` |
| `icon` | 36px square | `p-2` | — | `w-4 h-4` | — |

**Focus ring**: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`

**Disabled**: `disabled:pointer-events-none disabled:opacity-50`

**Loading state (spinner)**: When awaiting async action — replace label text with `<Loader2 className="w-4 h-4 animate-spin" />` + `Loading...` and set `disabled`. Width must not shrink during loading — use `min-w-[content-width]`.

---

### 4.2 Input & Textarea

**Input anatomy:**
```
┌─────────────────────────────────────────────┐
│ [icon (opt)] [placeholder / value]          │
└─────────────────────────────────────────────┘
```

- Height: `h-9` (36px)
- Padding: `px-3 py-1`
- Border: `border border-input rounded-md`
- Background: `bg-background` (transparent on forms)
- Font: `text-sm`
- Focus: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0`
- Error state: `aria-invalid:ring-destructive/20 aria-invalid:border-destructive`
- Placeholder: `text-muted-foreground`
- Disabled: `disabled:cursor-not-allowed disabled:opacity-50`

**Textarea anatomy:** Same as input but:
- Min height: `min-h-[96px]` (3 visible lines)
- `resize-y` allowed (vertical only)
- `field-sizing-content` for auto-grow

**Character counter:** `text-xs text-muted-foreground text-right mt-1` beneath the textarea.

**Label:** Always `text-sm font-medium` above the input, `mb-1.5`.

**Helper text / error message:** `text-xs text-muted-foreground` (or `text-destructive` on error), `mt-1`.

---

### 4.3 Card

**Anatomy layers:**
```
┌─ Card (bg-card, border, rounded-xl, shadow-sm) ──────────┐
│ ┌─ CardHeader (px-6 py-5) ───────────────────────────┐   │
│ │  CardTitle (text-lg font-semibold)                  │   │
│ │  CardDescription (text-sm text-muted-foreground)   │   │
│ └─────────────────────────────────────────────────────┘   │
│   Separator                                               │
│ ┌─ CardContent (px-6 py-4) ──────────────────────────┐   │
│ │  Main content                                       │   │
│ └─────────────────────────────────────────────────────┘   │
│ ┌─ CardFooter (px-6 py-4, flex justify-end) ─────────┐   │
│ │  Action buttons                                     │   │
│ └─────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────┘
```

**Variants:**

| Variant | Class additions | Usage |
|---|---|---|
| Default | `bg-card border border-border` | Standard container |
| Interactive (clickable) | `+ cursor-pointer hover:border-primary/40 transition-colors` | Template cards, session cards |
| Highlighted (selected) | `+ ring-2 ring-primary border-primary` | Selected template, active scene |
| Ghost | No border, no shadow | Layout containers, inner sections |

---

### 4.4 Badge

**Anatomy:** Inline pill with optional leading icon.

```
[ ● icon ][ Text ]
```

- Padding: `px-2 py-0.5`
- Border radius: `rounded-sm` (6px)
- Font: `text-xs font-medium`
- Line height: single-line only

| Variant | Background | Text | Usage |
|---|---|---|---|
| `default` | `bg-primary` | white | Status: active, published |
| `secondary` | `bg-secondary` | foreground | Neutral labels, template tags |
| `outline` | transparent | foreground | `border border-border` |
| `destructive` | `bg-destructive/15` | `text-destructive` | Error status |
| Scene type | Per type (see §2.1) | Per type | Scene type label |

---

### 4.5 Tabs

**Anatomy:**
```
┌─────────────────────────────────────┐
│ [Tab A] [Tab B] [Tab C]             │  ← TabsList
└─────────────────────────────────────┘
  ─────────────────────────────────── ← underline indicator
  Tab content for active tab            ← TabsContent
```

- `TabsList`: `bg-muted rounded-lg p-1` (pill container variant) or flat bottom-border variant
- `TabsTrigger`: `text-sm font-medium`, active: `bg-background shadow-sm text-foreground`, inactive: `text-muted-foreground hover:text-foreground`
- Active indicator: bottom border (`border-b-2 border-primary`) on the line variant, or raised bg on the pill variant
- Full-width tabs in panels: `flex-1` on each trigger

**Rule**: Use `defaultValue` — never control tabs externally unless the URL should reflect the state.

---

### 4.6 Progress

**Anatomy:**
```
[██████████████░░░░░░░] 67%
```

- Track: `bg-primary/20 rounded-full h-2`
- Fill: `bg-primary rounded-full transition-all duration-300`
- Never show a label overlaid on the bar — place percentage as `text-sm` alongside

---

### 4.7 Scroll Area

- Use instead of native `overflow-y: auto` for consistent custom scrollbar across platforms
- `ScrollArea` with `className="h-full"` inside a fixed-height container
- Scrollbar thumb: `bg-border rounded-full w-1.5`
- Scrollbar track: transparent, 4px wide gutters

---

### 4.8 Separator

- Horizontal: `w-full h-px bg-border`
- Vertical: `h-full w-px bg-border`
- Use `decorative` prop for purely visual dividers (no ARIA)
- Spacing around separator: `my-4` (horizontal) or `mx-4` (vertical)

---

## 5. Composite Components

### 5.1 Chat Message Bubble

**User bubble (right-aligned):**
```
                    ┌──────────────────────────┐
                    │  User message text here  │
                    └──────────────────────────┘
```
- `justify-end` row
- `bg-primary text-primary-foreground rounded-2xl rounded-br-sm`
- `px-4 py-2.5 text-sm max-w-[80%]`

**Assistant bubble (left-aligned):**
```
┌────────────────────────────────────┐
│  AI assistant response text        │
└────────────────────────────────────┘
```
- `justify-start` row
- `bg-muted text-foreground rounded-2xl rounded-bl-sm`
- `px-4 py-2.5 text-sm max-w-[80%]`

**Streaming indicator:**
- Same as assistant bubble with `animate-pulse`
- Content: `Thinking...` with three animated dots or spinner icon

**Message timestamp:**
- `text-xs text-muted-foreground mt-1` below bubble (right-align for user, left-align for assistant)
- Only show on hover or when multiple messages from same sender in sequence

**Chat container constraints:**
- Messages list: `flex-1 overflow-y-auto p-4 space-y-3`
- Input row: `border-t border-border p-3 flex gap-2`
- Input: `flex-1 h-9 text-sm`
- Send button: `size icon h-9 w-9`

---

### 5.2 Scene Card

**Anatomy:**
```
┌─────────────────────────────────────────────────────┐
│ ┌──────────┐  [hook]              0:00 – 0:05        │
│ │ Thumbnail│  Scene 1 — Hook                         │
│ │  64×64   │  "Welcome to this quick guide on..."    │
│ │          │  🔊 Audio generated                     │
│ └──────────┘                                         │
└─────────────────────────────────────────────────────┘
```

- Overall: `flex gap-3 p-3 rounded-lg cursor-pointer transition-colors`
- Default: `hover:bg-accent`
- Selected: `bg-accent ring-2 ring-primary/30`
- Thumbnail: `w-16 h-16 rounded-md object-cover bg-muted flex-shrink-0`
- Scene number: `text-xs text-muted-foreground`
- Type badge: Scene type colour (see §2.1)
- Time range: `text-xs text-muted-foreground ml-auto`
- Script preview: `text-xs text-muted-foreground line-clamp-2 mt-0.5`
- Audio status: `text-xs flex items-center gap-1 mt-1`
  - Generated: `text-green-600 dark:text-green-400`
  - Pending: `text-muted-foreground`
  - Failed: `text-destructive`

---

### 5.3 Template Card

**Anatomy:**
```
┌────────────────────────────────────────┐
│  [Emoji icon]               [✓ check] │
│                                        │
│  Template Name                         │
│  Short description of template type   │
│                                        │
│  [tag 1]  [tag 2]  [tag 3]            │
└────────────────────────────────────────┘
```

- Size: Full column width, min-height `h-40`
- Default: `border-2 border-transparent bg-{colour}-50 rounded-2xl p-5 cursor-pointer`
- Hover: `border-{colour}-300 shadow-sm`
- Selected: `border-{colour}-500 ring-2 ring-{colour}-500/30`
- Emoji icon: `text-3xl` in top-left
- Checkmark: `w-5 h-5 text-primary` top-right, only visible when selected
- Title: `text-base font-semibold mt-3`
- Description: `text-sm text-muted-foreground mt-1`
- Tags: Row of `Badge` with `secondary` variant at bottom, `gap-1.5 mt-3`

---

### 5.4 Content Input Panel

> **PDF upload has been removed.** The wizard accepts text-only input. This simplifies the onboarding flow and removes the PDF parsing complexity.

**Anatomy:**
```
┌────────────────────────────────────────────────────────┐
│  What's your reel about?                               │  ← heading
│  Paste your script, story, tips, or article…           │  ← subtext
│                                                        │
│  [Example chip 1] [Example chip 2] [Example chip 3]   │  ← quick-start prompts
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │                                                  │  │
│  │  Textarea (10 rows, autoFocus)                   │  │
│  │                                                  │  │
│  │  ─────────────────────────── 450/2000 ▓▓▓░░  │  │  ← progress bar inline
│  └──────────────────────────────────────────────────┘  │
│  [ℹ] More detail = better script…                      │  ← helper text
│                                                        │
│  [Cancel]              [Next: Choose template →]       │  ← action row
└────────────────────────────────────────────────────────┘
```

**Example prompt chips:** Three pre-filled example texts shown as small clickable pill buttons above the textarea. Clicking replaces the textarea content. Helps users get started quickly.

**Inline progress bar:** Appears inside the textarea bottom padding once text is typed. Turns `bg-orange-400` when ≥ 90% of the 2000-char limit is reached.

**"Cancel" CTA** → `/dashboard`. Only shown in Step 1. Step 2 shows a "Back" arrow within the wizard instead.

---

### 5.5 Chat Editor Widget

**Collapsed state (button only):**
```
                              [💬 Edit Reel]
```
- Fixed `bottom-6 right-6`
- Button: `default` variant, `rounded-full shadow-lg px-4 py-2`
- Icon: `MessageSquare w-4 h-4 mr-2`

**Expanded state (floating panel):**
```
┌──────────────────────────────────────────┐
│  Edit your reel             [×]          │  ← header
├──────────────────────────────────────────┤
│                                          │  ← messages
│  [AI bubble: Describe the changes...]   │
│                                          │
│  [User]: Make the hook more dramatic     │
│  [AI]: I've updated scene 1 to use...   │
│                                          │
├──────────────────────────────────────────┤
│  [Suggestion chips row]                  │  ← only when empty
├──────────────────────────────────────────┤
│  [Type your changes...]  [→]             │  ← input row
└──────────────────────────────────────────┘
```

- Panel: `w-[360px] h-[480px] fixed bottom-20 right-6 bg-card border border-border rounded-xl shadow-lg flex flex-col`
- Header: `px-4 py-3 border-b border-border flex items-center justify-between`
- Title: `text-sm font-semibold`
- Close: Ghost icon button `h-8 w-8`
- Messages: `flex-1 overflow-y-auto p-3 space-y-2`
- Suggestion chips: `flex flex-wrap gap-2 px-3 py-2 border-t border-border`
  - Chip: `text-xs border border-border rounded-full px-3 py-1 cursor-pointer hover:bg-accent`
- Input row: `flex items-center gap-2 p-3 border-t border-border`

**Mobile**: Panel becomes `fixed inset-x-4 bottom-4 top-auto h-auto max-h-[70vh]`. Collapsed button moves to `bottom-4 right-4`.

---

### 5.6 Generation Progress Panel

**Anatomy:**
```
┌────────────────────────────────────────────────────────┐
│  Generating your reel...                               │
│                                                        │
│  [████████████████████░░░░░░░░░░░░] 67%               │
│  Step 2 of 3: Generating scene assets                  │
│                                                        │
│  Scene 1  🖼️ ✓  🔊 ✓                                   │
│  Scene 2  🖼️ ✓  🔊 ⏳                                   │
│  Scene 3  🖼️ ○  🔊 ○                                   │
└────────────────────────────────────────────────────────┘
```

- Container: `bg-muted/50 border border-border rounded-xl p-5`
- Heading: `text-sm font-semibold mb-3`
- Progress bar: `Progress` component with animated fill
- Step text: `text-xs text-muted-foreground mt-2`
- Scene rows: `grid grid-cols-[auto_1fr_auto_auto] gap-x-3 gap-y-1.5 mt-4 text-xs`

**Error state:** Replace progress with:
```
┌────────────────────────────────────────────────────────┐
│  ⚠ Generation failed                                   │
│  [error message here]                                  │
│  [Try again]                                           │
└────────────────────────────────────────────────────────┘
```
- `text-destructive` heading, `text-sm text-muted-foreground` message, `Button variant="outline" size="sm"` retry

---

### 5.7 Export Button

**Anatomy:**
```
[  Download  ] ← default
[  ⏳ Exporting... ] ← loading
[ ✓ Download Ready ] ← success (brief, 3s)
```

- Default: `Button variant="default"`
- Loading: Spinner + "Exporting…" text, disabled
- Error: Toast notification (implement with sonner or shadcn Toast), button resets

---

## 6. Page Layouts

### 6.1 Reel Wizard (`/reels/new`)

**Purpose**: Focused, linear onboarding flow. Single-column, centred, minimal chrome.

```
┌────────────────────────────────────────────────────────────┐
│                     [App Logo / Name]                      │  ← sticky header, h-14
├────────────────────────────────────────────────────────────┤
│                                                            │
│               Step 1 of 2 · Add Context                   │  ← step indicator
│                                                            │
│       ┌──────────────────────────────────────────┐        │
│       │  Context Input Panel (max-w-2xl)          │        │
│       └──────────────────────────────────────────┘        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Step indicator pattern:**
```
[● Step 1]  ─────  [○ Step 2]
 Add Context         Choose Template
```
- Active step: `text-foreground font-medium`
- Inactive step: `text-muted-foreground`
- Connector: `h-px bg-border flex-1 mx-3`
- Step circle: `w-6 h-6 rounded-full text-xs flex items-center justify-center`
  - Active: `bg-primary text-primary-foreground`
  - Complete: `bg-green-500 text-white`
  - Inactive: `border-2 border-border text-muted-foreground`

**Step 2 (Template Picker):**
```
┌────────────────────────────────────────────────────────────┐
│               Step 2 of 2 · Choose a Template              │
│                                                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Template │  │ Template │  │ Template │                  │
│  │   Card   │  │   Card   │  │   Card   │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│  ┌──────────┐  ┌──────────┐                                │
│  │ Template │  │ Template │                                │
│  └──────────┘  └──────────┘                                │
│                                                            │
│  ← Back               [Create Reel →]                      │
└────────────────────────────────────────────────────────────┘
```
- Template grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- Back button: `Button variant="ghost"` with `ArrowLeft` icon
- Create Reel: `Button variant="default"` with `ArrowRight` icon

---

### 6.2 Reel Editor (`/reels/[id]`)

**Full-bleed, three-zone layout (desktop):**

```
┌──────────────────────────────────────────────────────────────────┐
│ ← Back  │  Reel Title                 │ [Generate] [Export]      │  h-14, sticky
├──────────┼──────────────────────────────┤──────────────────────── ┤
│          │                              │                          │
│ SCENE    │  PREVIEW                     │                          │
│ LIST     │  (Remotion Player)           │                          │
│          │                              │                          │
│ w-72     │  flex-1                      │                          │
│          │                              │                          │
│ [Scene 1]│  ┌────────────────────────┐  │                          │
│ [Scene 2]│  │  9:16 aspect ratio     │  │                          │
│ [Scene 3]│  │  preview canvas        │  │                          │
│ [Scene 4]│  └────────────────────────┘  │                          │
│          │                              │                          │
│          │  [ Generation Progress ]     │                          │
│          │  (shown during generation)   │                          │
└──────────┴──────────────────────────────┴──────────────────────────┘
                                                  [💬 Edit Reel]  ← floating
```

**TopNav Anatomy:**
```
┌──────────────────────────────────────────────────────────────────┐
│ ← Dashboard  ›  Reel Title  [Educational]    [Layers] [Generate] │
└──────────────────────────────────────────────────────────────────┘
```
- "← Dashboard": plain `<button>` with `text-sm text-muted-foreground hover:text-foreground group` → `router.push('/dashboard')`
- Arrow hover: `group-hover:-translate-x-0.5 transition-transform`
- Separator: `ChevronRight w-4 h-4 text-muted-foreground/40`
- Title: `text-sm font-semibold truncate max-w-[140px] md:max-w-[300px]`
- Template badge: `Badge variant="secondary" text-[10px] hidden sm:inline-flex`
- Mobile Layers icon: `Button variant="ghost" size="icon" md:hidden` — opens scene drawer
- Generate: `Button size="sm"` with `Sparkles` icon (shown when status is `pending`)
- Export: `ExportButton` (shown when status is `ready`)
- Nav: `h-14 border-b border-border bg-card/70 backdrop-blur-sm sticky top-0 z-20`

**Scene List (left panel):**
- `w-72 border-r border-border h-[calc(100vh-3.5rem)] flex flex-col`
- Header: `px-4 py-3 border-b border-border`
  - Title: `text-sm font-semibold`
  - Scene count: `text-xs text-muted-foreground`
- List: `ScrollArea flex-1`
  - Padding: `p-2`
  - Items: `SceneCard` components, `gap-1`

**Preview Center:**
- `flex-1 h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center bg-muted/30 p-6 overflow-y-auto`
- Player container: `aspect-[9/16] h-full max-h-[calc(100vh-8rem)] rounded-xl overflow-hidden shadow-lg`
- Controls below player: `mt-3 flex items-center gap-3`

---

## 7. Navigation & Shell

### Route Structure

The application has the following routes:

| Route | Layout | Purpose |
|---|---|---|
| `/` | None (landing shell) | Public landing page |
| `/login` | `(auth)` layout | Email + OAuth sign in |
| `/signup` | `(auth)` layout | New account creation |
| `/dashboard` | `dashboard/layout.tsx` | User reel grid + stats |
| `/dashboard/profile` | `dashboard/layout.tsx` | Profile, niche, plan settings |
| `/reels/new` | `(studio)` layout | 2-step creation wizard |
| `/reels/[id]` | `(studio)` layout | Full-screen reel editor |

> **Settings page has been removed.** All user preferences (name, bio, niche, platform links, plan, danger zone) are consolidated under `/dashboard/profile`.

### Dashboard Nav Bar

The `dashboard/layout.tsx` renders a persistent top nav:

```
┌──────────────────────────────────────────────────────────────────┐
│ [Logo] ReelAI  [Pro badge]              [+ New Reel]  [Avatar ▼] │
└──────────────────────────────────────────────────────────────────┘
```
- Logo: `w-7 h-7 bg-primary rounded-lg` + `"ReelAI"` text hidden on mobile
- Plan badge: `bg-primary/10 text-primary text-[10px] rounded-full` — hidden on mobile
- New Reel: `Button size="sm" rounded-full px-4` with `Plus` icon → `/reels/new`
- Avatar dropdown: Profile → `/dashboard/profile`, Sign out → `/`

### Top Navigation Bar (Wizard & Editor) — Breadcrumb Pattern

Both the wizard and editor use a consistent breadcrumb header pattern instead of a generic back button:

**Wizard (`/reels/new`):**
```
┌───────────────────────────────────────────────────────────┐
│ ← Dashboard  ›  [▪] New Reel          Step 1 of 2 – Add Content │
└───────────────────────────────────────────────────────────┘
```

**Editor (`/reels/[id]`):**
```
┌───────────────────────────────────────────────────────────┐
│ ← Dashboard  ›  Reel Title  [Educational]      [Generate] [Export] │
└───────────────────────────────────────────────────────────┘
```

Common anatomy rules:
- `h-14 border-b border-border bg-card/70 backdrop-blur-sm sticky top-0 z-20`
- `px-4 sm:px-6 gap-2 flex items-center`
- Left: `← Dashboard` link (`text-sm text-muted-foreground hover:text-foreground group`) + `group-hover:-translate-x-0.5` on arrow
- Separator: `ChevronRight w-4 h-4 text-muted-foreground/40`
- Context label: icon badge (wizard) or page title (editor) in `text-sm font-medium text-foreground`
- Right: step counter (wizard) or action buttons (editor)

**"← Dashboard" link always navigates to `/dashboard`**, never to the previous wizard step. Within the wizard, forward/back between steps uses inline buttons (Cancel, Back, Next), not the breadcrumb.

---

## 8. State Patterns

### 8.1 Loading States

**Page-level loading:** Skeleton screens — never spinners alone for content areas.

```
Skeleton pattern:
  div with `animate-pulse bg-muted rounded-md`
  Width varies (60%, 80%, 40%) to simulate text line variance
  Height matches the expected content: h-4 for text, h-32 for images
```

**Button loading:** `<Loader2 className="w-4 h-4 animate-spin mr-2" />` inline before text.

**Scene thumbnail loading:** `bg-muted animate-pulse w-16 h-16 rounded-md`

**Chat streaming:** Animated `Thinking...` bubble using `animate-pulse`. Never remove the input while streaming — disable it instead.

### 8.2 Error States

**Inline field error:**
```
[Input field with red border]
⚠ Error message in text-destructive text-xs mt-1
```
- Always add `aria-invalid="true"` to the input
- `aria-describedby` pointing to the error `id`

**API/action error (toast, future):**
- Red background toast with `X` dismiss
- Max 1 visible at a time
- Auto-dismiss 5s

**Page-level error:**
```
┌─────────────────────────────────────────────┐
│                                             │
│    [AlertCircle icon, 48px, red]            │
│    Something went wrong                     │
│    [specific message]                       │
│    [Try again button]                       │
│                                             │
└─────────────────────────────────────────────┘
```

**Generation failure:** Inline within the progress panel (see §5.6 error state).

### 8.3 Empty States

Used when a list has 0 items (no scenes yet, no reels yet).

```
┌─────────────────────────────────────────────┐
│                                             │
│    [Icon 40px text-muted-foreground]        │
│    No scenes yet                            │
│    Generate your reel to get started       │
│    [CTA button if action available]         │
│                                             │
└─────────────────────────────────────────────┘
```
- Container: `flex flex-col items-center justify-center py-12 px-6 text-center`
- Icon: `w-10 h-10 text-muted-foreground/50 mb-3`
- Heading: `text-sm font-medium text-foreground`
- Subtext: `text-xs text-muted-foreground mt-1 max-w-[200px]`

### 8.4 Success States

**Inline confirmation (brief):**
- Replace button label with `✓ Done` for 2–3 seconds, then reset
- Use `text-green-600 dark:text-green-400` for inline confirm icons

**Generation complete:**
- Progress panel transitions: `bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800`
- Shows: `✓ Reel ready — 4 scenes generated`

### 8.5 Disabled States

- All interactive elements: `disabled:pointer-events-none disabled:opacity-50`
- Input during streaming: `disabled:bg-muted/50 cursor-not-allowed`
- Never visually hide disabled elements — always show them as clearly unavailable

### 8.6 Streaming States

Specific to AI chat:
- Input: `disabled` while `status === "streaming"`
- Send button: Disabled, shows stop icon (future enhancement: allow cancel)
- Typing indicator: Animated bubble (3 pulsing dots or `Thinking...` pulse)
- Messages: New assistant bubble appears immediately with loading content

---

## 9. Responsive Design Spec

**Rule**: Design mobile-first. Every component must render usably at 375px viewport width before adding `md:` / `lg:` enhancements.

### 9.1 Mobile (< 768px)

**Wizard (`/reels/new`):**
- Full-width card with `mx-4` margin
- Step indicator: compact, text hidden (dots only on narrow screens)
- Template grid: `grid-cols-1` single column
- Wizard card: no `max-w` on mobile, full width minus `mx-4`

**Reel Editor (`/reels/[id]`):**
- TopNav: Reel title truncated to `max-w-[120px]`, hide template badge
- Scene list: **Hidden by default**, accessible via slide-in drawer triggered by `≡ Scenes` button in nav
- Preview: Full width, `aspect-[9/16]` centered, `p-3`
- Floating chat: `fixed inset-x-4 bottom-20 top-auto max-h-[60vh]` when open. Collapse button at `bottom-4 right-4`.
- Action buttons: Move "Generate" + "Export" to a bottom action bar on mobile, or reduce to icon buttons in nav.

**Chat widget on mobile:**
- Toggle: Sticky bottom bar `fixed bottom-0 inset-x-0 border-t p-3 flex gap-2`
- When open: Full-screen bottom sheet covering `70vh`

### 9.2 Tablet (768px – 1024px)

**Wizard:**
- Template grid: `grid-cols-2`
- Panel: `max-w-xl mx-auto`

**Reel Editor:**
- Scene list visible but narrower: `w-60`
- TopNav: Show template badge
- Floating chat: `w-[320px]`

### 9.3 Desktop (1024px – 1440px)

Standard layout as defined in §6. All three zones visible simultaneously.

### 9.4 Wide Desktop (> 1440px)

**Reel Editor:**
- Scene list: remains `w-72`
- Preview center: fluid, player grows proportionally up to `max-h-[780px]`
- Optional right panel (inspector, future): `w-80` on 1440px+

---

## 10. Dark Mode

Dark mode is toggled via `.dark` class on `<html>`. It is **not** system-preference-based by default (can be added).

### Implementation Rules

1. Use only semantic tokens — never `bg-gray-800`. If a component needs dark mode styling, override via `dark:` variants with semantic values.
2. Shadows become heavier in dark mode: always add `dark:shadow-black/40` alongside shadow utilities.
3. Image overlays: use `dark:brightness-90` on image elements to prevent harsh contrast.
4. Scene type badge dark overrides (mandatory):
   ```
   hook:    dark:bg-purple-900/30 dark:text-purple-300
   context: dark:bg-blue-900/30   dark:text-blue-300
   value:   dark:bg-green-900/30  dark:text-green-300
   cta:     dark:bg-orange-900/30 dark:text-orange-300
   ```
5. Template card dark overrides:
   ```
   All templates: dark:bg-{color}-950/30 dark:border-{color}-800
   ```
6. Chat widget in dark: `dark:bg-card dark:border-border/50`
7. Remotion preview border: `dark:ring-1 dark:ring-white/10`

### Toggle Component (Future)

Add a `ThemeToggle` button in the top-right nav area:
- `Button variant="ghost" size="icon"`
- `Sun` icon in dark mode, `Moon` icon in light mode
- Toggles `.dark` class on `document.documentElement`
- Store preference in `localStorage` under `theme`

---

## 11. Iconography

**Library**: `lucide-react` exclusively. All icons are imported individually.

**Sizing Rules:**

| Context | Class | Pixel size |
|---|---|---|
| Inline with `xs` text | `w-3 h-3` | 12px |
| Inline with `sm` text | `w-3.5 h-3.5` | 14px |
| Standard inline | `w-4 h-4` | 16px |
| Icon buttons | `w-4 h-4` or `w-5 h-5` | 16–20px |
| Feature icons in cards | `w-6 h-6` | 24px |
| Empty state icons | `w-10 h-10` | 40px |
| Hero / onboarding icons | `w-12 h-12` | 48px |

**Never** use `size` prop with pixel values. Always use Tailwind `w-` / `h-` utilities.

**Semantic Icon Mapping (enforce consistency):**

| Action / Meaning | Icon |
|---|---|
| Generate / AI | `Sparkles` |
| Download / Export | `Download` |
| Send message | `ArrowRight` or `Send` |
| Back navigation | `ArrowLeft` |
| Close / Dismiss | `X` |
| Edit | `Pencil` |
| Delete | `Trash2` |
| Add / New | `Plus` |
| Settings | `Settings` |
| Success | `CheckCircle2` |
| Error / Warning | `AlertCircle` |
| Info | `Info` |
| Chat / Message | `MessageSquare` |
| Upload | `Upload` |
| File (PDF) | `FileText` |
| Text input | `Type` |
| Loading (spinning) | `Loader2` with `animate-spin` |
| Scene (hook) | `Zap` |
| Scene (context) | `BookOpen` |
| Scene (value) | `Star` |
| Scene (CTA) | `MousePointerClick` |
| Audio | `Volume2` |
| Image | `Image` |
| Video | `Video` |

---

## 12. Accessibility

**Minimum requirements (must be met before any feature ships):**

### Focus Management

- Every interactive element reachable via `Tab`
- Visible focus ring: `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`
- Never use `outline: none` without providing a custom focus indicator
- When a modal/drawer opens: move focus to first interactive element inside
- When it closes: return focus to the trigger element

### Colour Contrast

- All text must meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- `text-muted-foreground` on `bg-background` passes in both modes — verify when changing token values
- Icon-only buttons must have `aria-label`
- Status-only colour indicators must have a text alternative

### ARIA Patterns

| Component | Required ARIA |
|---|---|
| Icon-only button | `aria-label="[action]"` |
| Progress bar | `role="progressbar" aria-valuenow aria-valuemin aria-valuemax` |
| Chat messages | `role="log" aria-live="polite"` on the messages container |
| Error message | `role="alert"` |
| Loading indicator | `aria-live="polite"` or `aria-busy="true"` on the loading container |
| Tabs | Radix UI handles — do not add conflicting ARIA |
| Drag-and-drop zone | `role="button" aria-label="Upload PDF" tabIndex={0}` |

### Keyboard Interactions

| Interaction | Keys |
|---|---|
| Submit chat | `Enter` (not `Shift+Enter`) |
| New line in textarea | `Shift+Enter` |
| Close floating widget | `Escape` |
| Navigate scene list | `↑` / `↓` arrow keys when focused in list |
| Select template card | `Space` or `Enter` when focused |

---

## 13. Motion & Transitions

### Rules

1. **Respect `prefers-reduced-motion`**: Wrap all non-essential animations in:
   ```css
   @media (prefers-reduced-motion: no-preference) { ... }
   ```
   Or in Tailwind: `motion-safe:animate-pulse` instead of `animate-pulse`.

2. **Never animate layout shifts** — avoid animations that change element size or position in a way that reflows content.

3. **Spinner (Loader2)**: `animate-spin` — the only animation that should run continuously.

4. **Skeleton loading**: `animate-pulse` — slow, 2s duration.

5. **Chat bubble entry**: `animate-fade-in` (from tw-animate-css) on new messages. Duration: 150ms.

6. **Floating widget open/close**: CSS `transition` on `opacity` and `transform` (scale from 95% → 100%). Duration: 150ms `ease-out`.

7. **Progress bar fill**: `transition-all duration-300 ease-out` on the inner fill element.

8. **Page transitions (wizard steps)**: Slide + fade. Outgoing: `translate-x-[-20px] opacity-0`. Incoming: `translate-x-[20px] opacity-0 → translate-x-0 opacity-100`. Duration 200ms.

9. **Template card hover**: `transition-all duration-150` on `border-color` and `box-shadow`.

10. **Tab switch**: Radix handles animation via `data-state` — no additional animation needed.

### Animation Inventory

| Element | Animation | Duration | Trigger |
|---|---|---|---|
| AI streaming bubble | `animate-pulse` | 2s repeat | On `status === "streaming"` |
| Button loading | `animate-spin` on icon | Infinite | On pending async |
| Skeleton screens | `animate-pulse` | 2s repeat | While loading |
| Progress bar fill | `transition-all` | 300ms | On value change |
| Chat widget panel | scale + opacity | 150ms | On toggle |
| Wizard step change | slide + fade | 200ms | On step increment |
| New message bubble | `animate-fade-in` | 150ms | On append |
| Generation complete | flash green | 300ms | `status === ready` |

---

## 14. Design Anti-Patterns (Do Nots)

These patterns are explicitly forbidden:

| ❌ Forbidden | ✅ Use Instead |
|---|---|
| `style={{ color: '#333' }}` | Semantic token: `text-foreground` |
| `className="text-gray-500"` | `text-muted-foreground` |
| `rounded-full` on rectangular buttons | `rounded-lg` or `rounded-xl` |
| Multiple competing CTA buttons of same weight | One `default` + one `outline` or `ghost` maximum |
| Inline `<style>` tags | Tailwind utilities + globals.css tokens |
| `z-index: 9999` | Use Tailwind z-scale: `z-10`, `z-20`, `z-30`, `z-40` (nav), `z-50` (modals) |
| Nested scroll areas without defined heights | Always set `h-[calc(...)]` on scroll containers |
| Icon + text buttons with no gap | Always `gap-1.5` or `gap-2` |
| Placeholder-only forms (no labels) | Always pair label + input; use `sr-only` if visually hidden |
| `select('*')` in UI-facing queries | Select only needed columns (performance + type safety) |
| Loading spinner as only feedback for > 3s operations | Use progress indicator or skeleton + estimated time |
| Colours for status without text alternative | Always pair colour with icon or label |
| Raw `<img>` tags | Always `next/image` with `alt` |
| `text-xs` for interactive elements | Min `text-sm` for buttons, labels, inputs |
| Empty `alt=""` on meaningful images | Always descriptive `alt` text |
| CSS classes on `components/ui/` files | Create wrapper components for customisation |

---

## Appendix A: Component Implementation Checklist

Before marking any new component done, verify:

- [ ] Uses semantic colour tokens only (`bg-background`, `text-foreground`, `border-border`)
- [ ] Uses `cn()` for all conditional class merging
- [ ] Has hover, focus, disabled, and error visual states
- [ ] Renders correctly at 375px viewport
- [ ] Has `aria-label` on icon-only interactive elements
- [ ] Imports Lucide icons individually, sized with `w-4 h-4`
- [ ] No `any` TypeScript types
- [ ] Dark mode variants provided where native token doesn't cover (especially category/status colours)
- [ ] Loading state does not cause layout shift (fixed-width buttons, skeleton placeholders)
- [ ] Animation respects `prefers-reduced-motion` or uses `motion-safe:` prefix

---

## Appendix B: Z-Index Layer Map

```
z-0    → Base content (default)
z-10   → Elevated content within a panel (sticky column headers)
z-20   → In-panel overlays (loading overlays on cards)
z-30   → Floating elements (tooltips, small popovers)
z-40   → Navigation (sticky topnav, scene list overlay on mobile)
z-50   → Modals, dialogs, drawers
z-[60] → Floating chat widget (above modals background, below modal)
z-[70] → Toast notifications (always topmost)
```

---

## Appendix C: Responsive Breakpoint Quick Reference

```
Mobile-first rule: every style is mobile by default.
Add md: and lg: prefixes to enhance for larger screens.

Base (0+):    Single column, full-width panels
sm (640+):    Two-column grids become available
md (768+):    Scene list shows, side-by-side layouts
lg (1024+):   Full three-zone editor layout
xl (1280+):   More breathing room, wider containers
2xl (1536+):  Large player, optional right inspector panel
```

---

*Last updated: 2026-03-21 · Maintained alongside `CLAUDE.md` · Must be reviewed when shadcn/ui is updated or new page surfaces are added.*
