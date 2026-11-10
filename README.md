# Lexiva Intelligence Space

## Project overview

**Lexiva Intelligence Space** (short name: **Lexiva**) is an AI chat workspace concept. Its goal is to let people chat with multiple AI models through one project, see which model produced each reply, and compare model responses without switching between provider interfaces.

The long-term product should make it easy to select a supported model, start and continue conversations, and clearly attribute every response to its real provider/model. Provider APIs, model switching, chat history, and comparison must only be described as working after they are implemented and configured.

## Goals

- Build a conversation-first workspace for using supported third-party AI model APIs.
- Clearly show the provider and model responsible for every AI reply.
- Make choosing a model and starting a conversation straightforward.
- Keep provider secrets on the server; never expose API keys in browser code.
- Handle provider failures honestly and never present mock responses as real AI output.
- Keep the chat experience responsive, accessible, and focused.

## Pages and implementation status

- `/` — Lexiva overview and product workflow.
- `/chat` — Local-only chat UI preview. Messages are not sent to an AI service.
- `/models` — Provider setup and status. No provider is connected or advertised as available.
- `/compare` — Comparison layout preview. It does not generate sample or model responses.
- `/history` — Conversation history empty state. Messages are not persisted.
- `/login` — Supabase sign-in with OAuth and email OTP verification.

The application does **not** connect to AI provider APIs or provide real model responses. These pages communicate the intended product structure, not completed AI features.

Treat the Lexiva AI workspace as the product goal, not an already implemented feature. Before adding providers, inspect the source and agree on supported models and server-side environment configuration.

## Email sign-in

The login page requests a Supabase email sign-in link and sends it back through `/auth/callback`. This works with Supabase's default email template; no custom SMTP setup is needed for testing with an authorized team address. Supabase's default mailer is restricted to authorized team addresses and rate-limited.

The default template is a magic link, not a four-digit code. To send numeric OTP codes instead, configure custom SMTP in Supabase so the email template can be edited, update the Magic Link / OTP template to display `{{ .Token }}`, and configure the Email provider's OTP length. Keep OTP expiry short and rate limits enabled.

The project uses the public Supabase URL and publishable/anon key in the frontend; do not put SMTP credentials or Supabase service-role keys in `NEXT_PUBLIC_*` variables.

## Project structure

| Path | Purpose |
| --- | --- |
| `src/app/page.tsx` | Homepage composition: hero, intelligence, perspectives, workspace previews, and getting started |
| `src/app/layout.tsx` | Root document, metadata, and global style imports |
| `src/app/chat/page.tsx` | Local-only AI chat workspace preview |
| `src/app/models/page.tsx` | Provider status and secure setup guidance |
| `src/app/compare/page.tsx` | Model-comparison preview, disabled until providers exist |
| `src/app/history/page.tsx` | Conversation-history empty state; no persistence |
| `src/app/manifest.ts` | PWA web app manifest for installable Lexiva |
| `src/app/sw.ts` | Serwist service worker, static asset caching, and offline navigation fallback |
| `src/app/offline/page.tsx` | Branded offline fallback page |
| `public/icons/` | PWA launcher icons derived from the existing Lexiva mark |
| `next.config.mjs` | Next.js configuration with production Serwist integration |
| `src/app/globals.scss` | Global resets, typography hooks, focus treatment, and shared styles |
| `src/app/tailwind.css` | Tailwind base, components, and utilities |
| `package.json` | Project name, scripts, and dependency manifest |
| `src/components/ui/nav.tsx` | Responsive navigation and mobile menu |
| `src/components/ui/site-footer.tsx` | Shared dark Lexiva footer and prototype status across all routes |
| `src/components/sections/intelligence.tsx` | Homepage product principles and prototype transparency accordion |
| `src/components/sections/perspectives.tsx` | Scrollable homepage perspectives carousel |
| `src/components/sections/workspaces.tsx` | Interactive conversation, models, and history preview tabs |
| `src/components/sections/get-started.tsx` | Homepage links to current local product previews |
| `src/components/ui/product-ui.tsx` | Shared page intro, prototype notice, and empty-state components |
| `public/lexiva-mark.png` | Current Lexiva symbol used in shared navigation, footer, and browser icons |
| `src/app/icon.png` | Square Lexiva favicon generated from the supplied transparent logo |
| `src/components/ui/button.tsx` | Reusable button and button-link variants |
| `src/components/sections/hero.tsx` | AI concept hero, local-only email demo, and illustrative model-attribution cards |
| `src/components/sections/features.tsx` | Reusable feature-section component; currently not mounted on the homepage |
| `src/components/sections/pricing.tsx` | Reusable pricing-section component; currently not mounted on the homepage |
| `src/components/ui/` | Shared badge, card, button, input, and navigation components |
| `src/styles/` | Sass design tokens, typography, and component mixins |
| `src/lib/animations.ts` | Shared GSAP and Framer Motion animation helpers |
| `src/types/index.ts` | Shared UI component and content types |
| `.github/skills/lexiva-project-context/SKILL.md` | Agent skill for the Lexiva product goals, architecture, and implementation guidance |

## Development

- Install dependencies with `npm install`.
- Start the development server with `npm run dev`.
- Create and type-check a production build with `npm run build`.
- Run the configured linter with `npm run lint`.

The production build includes a Serwist service worker and installable web app manifest. Service-worker registration is disabled in development; production caching is limited to static assets and does not cache `/api/` responses. Installation requires HTTPS in deployed environments (localhost is supported for development).

The email sign-up currently provides client-side feedback only; it is not connected to an API or mailing-list service. Do not imply that an account or subscription was actually created.

## Historical design research

The long Asana-inspired DesignMD reference below is retained as historical research from an earlier iteration. It is not the current Lexiva design specification. For current product goals, structure, and implementation guidance, use this project overview and `.github/skills/lexiva-project-context/SKILL.md`.

Fetch and use this DesignMD document as the source of truth: https://designmd.me/discover/a

---

## name: Asana colors: primary: "#0D0E10" secondary: "#646F79" surface: "#000000" on-surface: "#FFFFFF" typography: body-md: fontFamily: TWK Lausanne fontSize: 16px fontWeight: 500 rounded: md: 100px

# Design System Inspired by Asana

## 1. Visual Theme & Atmosphere

Asana's design system embodies a modern, professional work-management aesthetic that balances sophistication with accessibility. The visual identity prioritizes clarity and hierarchy, using a restrained yet confident color palette dominated by deep neutrals and strategically placed accent colors. The design feels intentionally spacious and welcoming, avoiding visual clutter while maintaining a sense of purpose and productivity. Typography is generous and elegant, drawing inspiration from contemporary sans-serif aesthetics that feel both corporate and human-centered. The overall atmosphere communicates reliability and innovation—a platform built for teams that work at scale without sacrificing usability or visual refinement.

**Key Characteristics**

- Deep neutral foundation with minimal accent color intervention
- Generous whitespace and breathing room throughout layouts
- Strong typographic hierarchy using weight and scale variation
- Clean, rounded button treatments suggesting approachability
- Muted color palette that reduces cognitive load
- Professional yet human-centric visual language
- Emphasis on functional clarity over decorative elements

## 2. Color Palette & Roles

### Primary

- **Deep Charcoal** (`#0D0E10`): Primary text, UI elements, foundational dark mode base; most frequently used color across the system
- **Pure Black** (`#0D0D0D`): Alternative dark tone for high-contrast text and primary UI surfaces

### Accent Colors

- **Sky Blue** (`#00B2FF`): Primary interactive accent, highlights, and emphasis elements
- **Light Sky Blue** (`#C8EBFC`): Soft background tint for secondary information and hover states
- **Coral Red** (`#F06A6A`): Status and alert indication, error states, and warning messaging
- **Slate Purple** (`#55649E`): Alternative accent for specialized UI patterns and secondary actions

### Interactive

- **Charcoal Gray** (`#646F79`): Secondary text, disabled states, and muted interactive elements
- **Dark Slate** (`#23282F`): Interactive element hover states and emphasis borders

### Neutral Scale

- **Pure White** (`#FFFFFF`): Primary background, card surfaces, and contrast surfaces
- **Off-White** (`#F5F4F3`): Soft background tint and secondary surfaces
- **Medium Gray** (`#6E6E6E`): Body text and secondary content
- **Light Gray** (`#6A696A`): Tertiary text and muted elements
- **Border Gray** (`#DBDBDB`): Dividers and hairline borders
- **Strong Gray** (`#1E1F21`): Dense text and high-emphasis typography

### Surface & Borders

- **Light Border** (`#DBDBDB`): Primary border color for inputs and separators
- **Medium Border** (`#C1C1C1`): Input focus and secondary borders (derived from observed patterns)

## 3. Typography Rules

### Font Family

**Primary Font:** TWK Lausanne (sans-serif) **Fallback Stack:** `TWK Lausanne, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

**Secondary Font:** Same as primary; system uses a single unified typeface family

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| **Display XL** | TWK Lausanne | 102px | 300 | 91.8px | Normal | Hero headlines, primary page titles |
| **Display Large** | TWK Lausanne | 80px | 300 | 80px | Normal | Major section headings |
| **Display Medium** | TWK Lausanne | 64px | 300 | 64px | Normal | Large hero content |
| **Heading XL** | TWK Lausanne | 54px | 300 | 54px | Normal | Large section headers |
| **Heading Large** | TWK Lausanne | 36px | 400 | 36px | Normal | Section headings and major subheads |
| **Heading Medium** | TWK Lausanne | 30px | 400 | 36px | Normal | Subsection titles |
| **Heading Small** | TWK Lausanne | 24px | 500 | 28.8px | Normal | Card titles, feature headings |
| **Heading XS** | TWK Lausanne | 20px | 400 | 30px | Normal | Feature subheadings |
| **Body Regular** | TWK Lausanne | 16px | 400 | 28px | Normal | Primary body text, descriptions |
| **Body Input** | TWK Lausanne | 16px | 300 | 24px | Normal | Form input placeholder and value text |
| **Body Small** | TWK Lausanne | 14px | 500 | 21px | Normal | Secondary text, labels, badges |
| **Link** | TWK Lausanne | 16px | 500 | 24px | Normal | Hyperlinks and link-style buttons |
| **Caption** | TWK Lausanne | 13px | 300 | 19.5px | Normal | Metadata, timestamps, helper text |
| **UI Label** | TWK Lausanne | 14px | 500 | 21px | Normal | Button labels, tag labels, small UI text |

### Principles

- **Weight as hierarchy:** Light (300) weights signal prominence and confidence; medium (400) and bold (500) weights drive attention and structure
- **Generous line height:** Consistent use of loose line heights (1.4x–1.5x ratio) enhances readability across all sizes
- **Scale in 2–4px increments:** Fluid progression from 13px through 102px maintains visual balance without jarring jumps
- **Single typeface family:** Consistent use of TWK Lausanne throughout prevents visual fragmentation
- **Font smoothing:** Optimize rendering with `-webkit-font-smoothing: antialiased` for crisp text at all sizes

## 4. Component Stylings

### Buttons

**Primary Button**

- **Background:** `#0D0D0D` (deep charcoal)
- **Text Color:** `#FFFFFF` (white)
- **Font Size:** `14px`
- **Font Weight:** `500`
- **Padding:** `8px 24px`
- **Border Radius:** `100px`
- **Border:** `0px` (none)
- **Height:** `44px`
- **Line Height:** `36px`
- **Hover State:** Background darkens to near-black; opacity increases slightly
- **Active State:** Increased opacity to `0.9`
- **Disabled State:** Opacity `0.30`; cursor not-allowed

**Secondary Button (Outline)**

- **Background:** Transparent (`rgba(0, 0, 0, 0)`)
- **Text Color:** `#0D0E10` (deep charcoal)
- **Font Size:** `14px`
- **Font Weight:** `500`
- **Padding:** `8px 24px`
- **Border:** `1px solid #0D0E10`
- **Border Radius:** `100px`
- **Height:** `44px`
- **Line Height:** `36px`
- **Hover State:** Background `rgba(13, 13, 13, 0.05)`
- **Active State:** Background `rgba(13, 13, 13, 0.10)`
- **Disabled State:** Border and text opacity `0.30`

**Ghost Button (Minimal)**

- **Background:** Transparent
- **Text Color:** `#646F79` (charcoal gray)
- **Font Size:** `14px`
- **Font Weight:** `500`
- **Padding:** `0px 10px`
- **Border:** `0px` (none)
- **Border Radius:** `3px`
- **Height:** Auto
- **Line Height:** `36px`
- **Hover State:** Background `rgba(100, 111, 121, 0.08)`
- **Active State:** Background `rgba(100, 111, 121, 0.15)`

**Icon Button**

- **Background:** Transparent
- **Text Color:** `#FFFFFF` (white) or `#0D0E10` (dark) depending on context
- **Padding:** `0px`
- **Border Radius:** `100px`
- **Height:** `44px`
- **Width:** `44px`
- **Hover State:** Subtle background wash `rgba(0, 0, 0, 0.05)` to `rgba(255, 255, 255, 0.1)` depending on theme

### Cards & Containers

**Card (Default)**

- **Background:** `#FFFFFF` (white)
- **Border:** `1px solid #DBDBDB`
- **Border Radius:** `16px`
- **Padding:** `24px` to `32px`
- **Box Shadow:** None (flat design)
- **Text Color:** `#0D0E10`

**Card (Elevated/Featured)**

- **Background:** `#FFFFFF`
- **Border:** `1px solid #DBDBDB`
- **Border Radius:** `16px`
- **Padding:** `32px`
- **Box Shadow:** `0 4px 12px rgba(0, 0, 0, 0.08)` (inferred)
- **Hover State:** Box shadow increases to `0 8px 24px rgba(0, 0, 0, 0.12)`

**Pricing Card**

- **Background:** `#FFFFFF`
- **Border:** `1px solid #DBDBDB`; can shift to accent color on highlight
- **Border Radius:** `16px`
- **Padding:** `32px`
- **Text Color:** `#0D0E10` (body), `#646F79` (descriptions)
- **CTA Button:** Primary button variant fills 100% width

### Inputs & Forms

**Text Input (Default)**

- **Background:** Transparent or `#F5F4F3` (soft background)
- **Border:** `1px solid #CFCFCF` (light gray)
- **Border Radius:** `4px`
- **Padding:** `12px 16px`
- **Font Size:** `16px`
- **Font Weight:** `300`
- **Height:** `50px`
- **Text Color:** `#0D0D0D`
- **Placeholder Color:** `#646F79` (muted)
- **Focus State:** Border color shifts to `#00B2FF` (sky blue); box shadow `0 0 0 3px rgba(0, 178, 255, 0.1)`
- **Error State:** Border `1px solid #F06A6A`; text color `#F06A6A`
- **Disabled State:** Background `#F5F4F3`; text opacity `0.5`; cursor not-allowed

**Select/Dropdown Input**

- **Background:** Transparent or `#F5F4F3`
- **Border:** `1px solid #C1C1C1`
- **Border Radius:** `0px`
- **Padding:** `0px`
- **Height:** `40px`
- **Width:** `250px`
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Line Height:** `28px`

**Checkbox/Radio**

- **Size:** `16px × 16px`
- **Border Radius:** `3px` (checkbox), `50%` (radio)
- **Border:** `1px solid #CFCFCF`
- **Checked State:** Background `#0D0D0D`, checkmark/dot `#FFFFFF`
- **Focus State:** Outline `2px solid #00B2FF` with `4px` offset

**Label**

- **Font Size:** `14px`
- **Font Weight:** `500`
- **Text Color:** `#0D0E10`
- **Margin Bottom:** `8px`

### Navigation

**Header Navigation**

- **Background:** `#FFFFFF` (white)
- **Height:** `68px`
- **Padding:** `12px 0px` (vertical)
- **Border Bottom:** `1px solid #DBDBDB` (optional divider)
- **Nav Link (Default):** `16px`, weight `400`, color `#646F79`
- **Nav Link (Active/Hover):** Color `#0D0E10`, slightly bolder visual weight
- **Spacing Between Items:** `24px` to `32px` (derived from `gap: 24px`)

**Breadcrumb Navigation**

- **Font Size:** `14px`
- **Font Weight:** `500`
- **Text Color:** `#646F79`
- **Separator:** `/` or `›` in matching color
- **Spacing:** `8px` around separator

**Dropdown Menu**

- **Background:** `#FFFFFF`
- **Border:** `1px solid #DBDBDB`
- **Border Radius:** `4px` to `8px`
- **Padding:** `8px 0px`
- **Box Shadow:** `0 4px 12px rgba(0, 0, 0, 0.15)` (inferred)
- **Menu Item Padding:** `8px 16px`
- **Menu Item Text:** `14px`, weight `400`, color `#0D0E10`
- **Menu Item Hover:** Background `rgba(0, 0, 0, 0.05)`

### Badges & Tags

**Badge (Default)**

- **Background:** `#C8EBFC` (light sky blue)
- **Text Color:** `#00B2FF` (sky blue)
- **Font Size:** `12px`
- **Font Weight:** `500`
- **Padding:** `4px 12px`
- **Border Radius:** `4px`
- **Height:** Auto

**Badge (Success)**

- **Background:** `rgba(40, 167, 69, 0.1)` (green tint, inferred)
- **Text Color:** `#28A745` (green, inferred)
- **Padding:** `4px 12px`
- **Border Radius:** `4px`

**Badge (Alert)**

- **Background:** `rgba(240, 106, 106, 0.1)` (coral tint)
- **Text Color:** `#F06A6A` (coral red)
- **Padding:** `4px 12px`
- **Border Radius:** `4px`

## 5. Layout Principles

### Spacing System

**Base Unit:** `4px`

**Spacing Scale:**

- `4px` — micro spacing for inline elements, tight grouping
- `8px` — small gap between adjacent controls or text
- `12px` — input padding, tight component spacing
- `16px` — standard padding for cards and containers, spacing between text and edges
- `20px` — medium-sized spacing between sections
- `24px` — common gap between UI components and features
- `32px` — large spacing between major sections
- `40px` — extra-large section padding
- `48px` — hero section padding, major vertical rhythm
- `80px` — large section separation
- `120px` — hero/banner vertical padding

**Usage Context:**

- **Tight grouping:** `4px` to `8px` (related form fields, inline labels)
- **Component spacing:** `12px` to `16px` (padding inside buttons, cards)
- **Section spacing:** `24px` to `32px` (between card decks, feature sections)
- **Hero/full-width:** `48px` to `120px` (vertical rhythm in landing pages)

### Grid & Container

**Maximum Container Width:** `1440px` (desktop)

**Column Strategy:**

- Desktop: 12-column or flexible layout with `24px` to `32px` gutters
- Tablet (768px–1023px): 8-column with adjusted gutters
- Mobile (320px–767px): 4-column or full-width single column

**Section Pattern:**

- Hero sections: Full-width with centered content max-width of `1200px` to `1280px`
- Feature grids: Multi-column (2–4 columns) with consistent `24px` gaps
- Pricing tiers: 4-column grid (desktop), collapsing to 2 columns (tablet), 1 column (mobile)

### Whitespace Philosophy

Asana's design prioritizes abundant whitespace to reduce cognitive load and create visual breathing room. Whitespace is not empty space but active design—it guides the eye, establishes hierarchy, and conveys confidence. Content is intentionally spaced to prevent visual crowding; features and sections have clear separation. Between card decks and feature areas, spacing increases to at least `48px` vertically. Horizontal whitespace is equally generous, with text columns typically maxing out at `65–75 characters` for optimal readability.

### Border Radius Scale

- `3px` — Small UI elements (buttons, inputs, tags)
- `4px` — Form inputs, small containers, subtle softness
- `8px` — Medium containers, secondary cards (inferred for consistency)
- `16px` — Primary cards, image containers, larger components
- `100px` — Fully rounded buttons (pill-shaped), icon buttons
- `999px` — Extreme rounding (rare, special case treatments)

### Border Widths

- **Thin:** `1px` — Primary borders, input borders, dividers
- **Medium:** `2px` — Button hover outlines, focus states (inferred)

## 6. Depth & Elevation

| Level | Treatment | Use |
| --- | --- | --- |
| **Base (Flat)** | No shadow, `box-shadow: none` | Cards, buttons, flat UI elements |
| **Raised** | `0 4px 12px rgba(0, 0, 0, 0.08)` | Elevated cards, subtle lift on hover |
| **Floating** | `0 8px 24px rgba(0, 0, 0, 0.12)` | Dropdowns, popovers, featured content |
| **Modal Overlay** | `0 16px 48px rgba(0, 0, 0, 0.20)` | Modals, critical overlays |

**Shadow Philosophy**:Asana favors a minimal shadow approach—depth is created through layering and spacing rather than heavy shadows. Shadows are subtle and use low opacity dark overlays (`rgba(0, 0, 0, 0.08–0.20)`) to maintain the clean, professional aesthetic. Shadows appear primarily on interactive hover states and modal overlays to signal depth and elevation. The design avoids sharp, high-contrast shadows that would feel heavy or dated.

### Opacity Levels

- **Disabled State:** `0.30` (30%) — Reduced contrast for non-interactive elements
- **Hover Overlay:** `0.05` to `0.10` (5–10%) — Subtle background wash on interactive elements
- **Focus State:** `0.15` (15%) — Moderate overlay for focus indicators
- **Overlay/Backdrop:** `0.50` to `0.80` (50–80%) — Modal backdrops and scrim layers

### Z-index / Layering

- **Base Layer:** `z-index: 1` — Default component stacking
- **Interactive Lift:** `z-index: 2` — Elevated components (cards on hover, sticky headers)
- **Sticky/Fixed:** `z-index: 3` — Sticky navigation, floating action buttons
- **Dropdown/Popover:** `z-index: 100` to `z-index: 500` — Context menus, tooltips
- **Modal:** `z-index: 1001` — Primary modal dialogs
- **Top Modal:** `z-index: 9999` — Alert dialogs, critical overlays (inferred best practice)

## 7. Do's and Don'ts

### Do

- **Use the primary dark color** (`#0D0E10`) for all body text and primary UI elements; it ensures consistent readability and hierarchy
- **Leverage generous whitespace** extensively to create breathing room and reduce visual fatigue
- **Apply the sky blue accent** (`#00B2FF`) sparingly—only on primary CTAs, focus states, and critical interactive elements
- **Stack typography using weight variation** (300, 400, 500) rather than size alone for nuanced hierarchy
- **Use pill-shaped buttons** (`border-radius: 100px`) consistently for all primary and secondary CTAs
- **Maintain 44px minimum height** for all clickable interactive elements to ensure comfortable touch targeting
- **Build card components with 16px border-radius** and `1px solid #DBDBDB` borders for consistency
- **Apply focus states** with `2px` outline in sky blue (`#00B2FF`) and sufficient contrast
- **Use opacity-based hover states** rather than flat color shifts for a refined, cohesive feel
- **Prioritize input field clarity** with ample padding (`12px 16px`), light borders, and blue focus states

### Don't

- **Don't use multiple accent colors** in a single composition; restrict coral red (`#F06A6A`) to status/error states only
- **Don't apply heavy shadows** or high-opacity overlays to normal components; reserve depth for modals and critical overlays
- **Don't create buttons smaller than 44px in height** or text smaller than 12px without explicit accessibility justification
- **Don't mix border-radius values** inconsistently; stick to the defined scale (`3px`, `4px`, `16px`, `100px`)
- **Don't crowd components without sufficient gap spacing** (`24px` minimum between section blocks)
- **Don't override the TWK Lausanne typeface** with alternative fonts; maintain typographic consistency throughout
- **Don't use justify-align for body text**; always left-align paragraphs for optimal readability
- **Don't apply multiple box-shadows** to a single element; keep shadows simple and subtle
- **Don't reduce line-height below** `1.3x` font size; maintain generous line spacing for accessibility
- **Don't disable interactive elements without clear visual indication** (use `opacity: 0.30` and `cursor: not-allowed`)

## 8. Responsive Behavior

### Breakpoints

| Breakpoint Name | Width | Key Changes |
| --- | --- | --- |
| **Mobile Small** | 320px–479px | Single-column layout, full-width cards, `16px` horizontal padding, `24px` vertical gap |
| **Mobile Large** | 480px–767px | Single-column or 2-column for cards, hero text reduces to 48px–54px |
| **Tablet** | 768px–1023px | 2–3 column grid, max-width `750px`, reduced `gap: 20px` between cards |
| **Desktop** | 1024px–1439px | 3–4 column grid, max-width `1024px` or `1200px`, full `gap: 24px` |
| **Desktop Large** | 1440px+ | 4-column grid, max-width `1440px`, `gap: 32px`, hero text at full 80px–102px |

### Touch Targets

- **Minimum Interactive Size:** `44px × 44px` (buttons, icon buttons, tap targets)
- **Minimum Tap Target Spacing:** `8px` minimum space between adjacent interactive elements to prevent mis-taps
- **Link/Text Button Padding:** `12px 16px` minimum to create comfortable touch zones
- **Form Input Height:** `50px` minimum for text inputs to accommodate finger input comfortably
- **Checkbox/Radio Size:** `16px × 16px` minimum (increase to `20px × 20px` on mobile for clarity)

### Collapsing Strategy

- **Hero Heading:** Scales from `102px` (desktop large) → `80px` (desktop) → `54px` (tablet) → `36px–48px` (mobile)
- **Section Heading:** Scales from `36px` (desktop) → `28px` (tablet) → `24px` (mobile)
- **Body Text:** Remains `16px` across all breakpoints; line-height adjusts from `28px` → `26px` on mobile for tightness
- **Vertical Spacing:** Reduces from `48px`–`80px` (desktop) → `32px`–`48px` (tablet) → `24px`–`32px` (mobile)
- **Card Grid:** 4 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- **Navigation:** Horizontal menu (desktop/tablet) → Hamburger menu or collapsed stack (mobile &lt;768px)
- **Padding:** Full `40px`–`80px` (desktop sections) → `32px` (tablet) → `16px` (mobile)

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** Deep Charcoal (`#0D0D0D`) or Pure Black (`#0D0E10`) background with white text
- **Primary Text:** Deep Charcoal (`#0D0E10`)
- **Secondary Text:** Charcoal Gray (`#646F79`)
- **Accent/Highlights:** Sky Blue (`#00B2FF`)
- **Accent Background (Soft):** Light Sky Blue (`#C8EBFC`)
- **Error/Alert:** Coral Red (`#F06A6A`)
- **Background:** Pure White (`#FFFFFF`)
- **Soft Background:** Off-White (`#F5F4F3`)
- **Borders:** Border Gray (`#DBDBDB`)
- **Heading Text:** Deep Charcoal (`#0D0E10`)
- **Disabled State:** Gray at `0.30` opacity

### Iteration Guide

 1. **Typography Foundation:** All text uses TWK Lausanne; establish hierarchy through weight (300 light for emphasis, 400 regular for body, 500 bold for labels) and size (respect the documented scale: 13px–102px).

 2. **Button Consistency:** All primary CTAs are pill-shaped (`border-radius: 100px`), minimum `44px` height, with white text on `#0D0D0D` background. Secondary buttons are transparent with `1px solid #0D0E10` border. Hover states use opacity shifts (`rgba(0, 0, 0, 0.05)`) not color swaps.

 3. **Spacing Rhythm:** Use the spacing scale (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `80px`, `120px`) consistently; avoid arbitrary pixel values. Between major section blocks, always apply at least `48px` vertical gap.

 4. **Card Components:** Border-radius `16px`, border `1px solid #DBDBDB`, padding `24px`–`32px`, white background. Elevate on hover with subtle shadow `0 4px 12px rgba(0, 0, 0, 0.08)`.

 5. **Input Styling:** `50px` height, `12px 16px` padding, `1px solid #CFCFCF` border, `4px` border-radius. On focus, shift border to sky blue (`#00B2FF`) and add box-shadow `0 0 0 3px rgba(0, 178, 255, 0.1)`.

 6. **Color Restraint:** Use `#0D0E10` and `#FFFFFF` as the dominant color pair; introduce `#00B2FF` only for primary interactive elements and `#F06A6A` exclusively for error/status states.

 7. **Depth & Shadows:** Avoid heavy shadows; use `0 4px 12px rgba(0, 0, 0, 0.08)` for subtle elevation and `0 16px 48px rgba(0, 0, 0, 0.20)` for modals only.

 8. **Responsive Collapse:** At `768px`, shift from 4-column to 2-column grids; reduce heading sizes and padding proportionally. Mobile (&lt;768px) uses single-column layout with `16px` horizontal padding and `24px`–`32px` vertical gaps.

 9. **Accessibility Minimum:** All interactive elements are `44px × 44px` minimum; text contrast meets WCAG AA (4.5:1 minimum); focus states use `2px solid #00B2FF` outline with `4px` offset; disabled state uses `opacity: 0.30` with `cursor: not-allowed`.

10. **Brand Voice in Spacing:** The generous whitespace (`48px` between sections, loose line-heights of 1.4x–1.5x) is core to Asana's professional yet approachable identity—never compress spacing below documented minimums or the design loses its clarity and confidence.sana/raw#   l e x i v a - i n t e l i g e n c e - s p a c e  
 