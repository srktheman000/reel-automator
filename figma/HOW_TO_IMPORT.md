# How to Import into Figma

## Files in this folder

| File | Purpose |
|---|---|
| `tokens.json` | Design tokens — colors, typography, spacing, shadows, radii, motion |
| `components.json` | Component anatomy, variants, sizing, and token references |
| `pages.json` | Page layout frames with exact Auto Layout measurements |

---

## Step 1 — Install Token Studio (Figma Tokens)

1. In Figma, open **Plugins → Browse plugins** and search for **Token Studio for Figma** (formerly Figma Tokens).
2. Install it. It's free for local token sync.

> Alternative: use the **Variables Import** plugin if you only need Figma Variables (colors + spacing).

---

## Step 2 — Import `tokens.json`

1. Open Token Studio plugin panel.
2. Go to **Sync → Local file** and point it at `figma/tokens.json`, OR
3. Click **Load from file** and paste the contents of `tokens.json` into the token sets editor.
4. You will see four token sets appear:
   - `global` — primitive values
   - `light` — light mode semantics ← **enable this as default**
   - `dark` — dark mode semantics ← enable alongside `light` when designing dark screens
   - `components` — component-scoped tokens
5. Click **Apply to selection** or **Apply all** to attach tokens to your Figma styles.

### Token set activation
- Light screens: enable `global` + `light` + `components`
- Dark screens: enable `global` + `dark` + `components` (dark overrides light)

---

## Step 3 — Set up Fonts

Download and install **Geist Sans** and **Geist Mono**:

```
https://vercel.com/font
```

Install both variable font files in your OS font folder before opening Figma. Then in the Typography section of Token Studio, verify the family names match `Geist Sans` and `Geist Mono`.

---

## Step 4 — Import Lucide Icons

1. In the Figma Community, search for **Lucide Icons**.
2. Duplicate the community file to your drafts.
3. In your design file: **Assets panel → Libraries → Enable Lucide Icons**.
4. Icons will be available as components you can drag into frames.

Key icons used in this product:

| Icon | Usage |
|---|---|
| `Sparkles` | Generate / AI actions |
| `Download` | Export |
| `ArrowLeft / ArrowRight` | Navigation |
| `MessageSquare` | Chat widget toggle |
| `FileText` | PDF upload |
| `Layers` | Scene list (mobile nav) |
| `CheckCircle2` | Success states |
| `AlertCircle` | Error states |
| `Loader2` | Loading spinner (animate rotation) |
| `Volume2` | Audio generated |
| `Clock` | Audio pending |

---

## Step 5 — Build Pages from `pages.json`

Use `pages.json` as your construction guide. Each top-level entry in `"pages"` = one Figma page:

| Figma Page | Artboards to create |
|---|---|
| 🎨 Design Tokens | Color swatches, type specimen |
| 🧩 Components | All component sets with variants |
| 📱 Reel Wizard — Mobile | 3 artboards (375×812) |
| 💻 Reel Wizard — Desktop | 2 artboards (1440×900) |
| 🎬 Reel Editor — Desktop | 3 artboards (1440×900) |
| 📱 Reel Editor — Mobile | 3 artboards (375×812) |
| 🌙 Dark Mode Variants | 3 key screens in dark mode |
| ♿ Accessibility Annotations | Focus order + ARIA map |

### Auto Layout settings

All frames use Auto Layout. Standard settings:
- **Direction**: Vertical (page body) or Horizontal (nav, rows)
- **Alignment**: Leading (left-align content blocks), Center (nav items)
- **Resizing**: Fill container (fluid) or Fixed (panels with set widths)

---

## Step 6 — Component Naming Convention

Follow Figma's **Variant** naming convention. Example for Button:

```
Component name: Button
Variant properties:
  Variant = default | secondary | outline | ghost | destructive | link
  Size     = xs | sm | md | lg | icon
  State    = default | hover | focus | disabled | loading
```

Create each permutation as a variant inside a single Component Set.

---

## Colour Application Quick Reference

| What you're styling | Token to apply |
|---|---|
| Page background | `light/background` |
| Body text | `light/foreground` |
| Primary button fill | `light/primary` |
| Primary button text | `light/primary-foreground` |
| Card background | `light/card` |
| Input border | `light/input` |
| Muted text (labels, timestamps) | `light/muted-foreground` |
| Dividers | `light/border` |
| Focus ring | `light/ring` |
| Error / destructive | `light/destructive` |
| Hook badge bg | `light/scene/hook-bg` |
| Hook badge text | `light/scene/hook-text` |

---

## Exporting back to code

When designs are finalised, use Token Studio's **Export** feature to sync any token changes back to `figma/tokens.json`, then run Style Dictionary to regenerate CSS variables for the codebase:

```bash
npx style-dictionary build
```

(Style Dictionary config not included — add if needed for CI pipeline.)
