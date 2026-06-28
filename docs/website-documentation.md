# الهلالي لنقل الاثاث — Website Documentation

> **Live URL:** `https://hilalymoving.com`  
> **Admin Panel:** `/admin`  
> **Tech Stack:** React 18, Firebase, Cloudinary, Vite  
> **Language:** Arabic (RTL)  
> **Last Updated:** June 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Data Flow & Content Management](#4-data-flow--content-management)
5. [CMS Data Fields (Complete Reference)](#5-cms-data-fields-complete-reference)
6. [Pages & Routes](#6-pages--routes)
7. [Components (Complete Reference)](#7-components-complete-reference)
8. [Admin Panel](#8-admin-panel)
9. [Firebase Integration](#9-firebase-integration)
10. [Cloudinary Media Upload](#10-cloudinary-media-upload)
11. [Features in Detail](#11-features-in-detail)
12. [Build, Deploy & Prerendering](#12-build-deploy--prerendering)
13. [Customization Guide](#13-customization-guide)

---

## 1. Project Overview

A full-featured Arabic-language moving services website for **الهلالي لنقل الاثاث** (Hilaly Moving). The site acts as a complete digital presence — part brochure, part lead-generation machine — with all content editable from a password-protected admin panel.

### Key Goals

- Generate leads via WhatsApp booking form
- Establish local SEO authority in Egyptian cities
- Provide a professional brand presence editable by a non-technical owner
- Serve static prerendered pages for fast loading

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | React 18 | UI rendering |
| **Routing** | React Router DOM v7 | SPA routing with `/blog/:slug` params |
| **Build** | Vite 5 | Fast dev server + production builds |
| **CMS/Database** | Firebase Firestore | Store all site content (document `hilaly-moving/site`) |
| **Auth** | Firebase Auth | Admin login (email/password) |
| **Media CDN** | Cloudinary | Image & video hosting with transformations |
| **SEO** | react-helmet-async | Per-page meta tags + canonical URLs |
| **Animations** | Custom IntersectionObserver | Scroll-triggered reveals |
| **Styling** | Inline styles + CSS vars + Tailwind 3.4 | Theming (light/dark), responsive |
| **Hosting** | Cloudflare Pages (target) | Free tier, global CDN, auto SSL |

### Key Dependencies (package.json)

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^7.6.2",
  "react-helmet-async": "^2.0.5",
  "firebase": "^11.6.2"
}
```

Dev dependencies: Vite 5, Tailwind 3.4, PostCSS, Autoprefixer.

---

## 3. Project Structure

```
hilalyMoving/
├── index.html                  # SPA entry, JSON-LD schemas, Open Graph, fonts
├── package.json                # Dependencies, scripts
├── vite.config.js              # Vite config + vendor chunking
├── tailwind.config.js          # Custom colors, shadows, font
├── postcss.config.js           # Tailwind + autoprefixer
├── firestore.rules             # Firestore security rules
├── public/
│   ├── favicon.jpg
│   ├── robots.txt              # SEO crawl instructions
│   ├── sitemap.xml             # 6 URLs with priorities
│   └── _redirects              # SPA fallback (Netlify/Cloudflare)
├── scripts/
│   └── prerender.cjs           # Post-build static prerender (5 routes)
├── src/
│   ├── main.jsx                # React entry → <BrowserRouter>
│   ├── App.jsx                 # Routes: 7 inside MainLayout + /admin
│   ├── index.css               # CSS variables for light/dark themes
│   ├── cms.js                  # Default CMS data (261 lines, all Arabic)
│   ├── firebase.js             # Firestore CRUD + blog queries
│   ├── theme.js                # Light/Dark theme palettes + context
│   ├── whatsapp.js             # WhatsApp message builder
│   ├── imagekit.js             # Cloudinary URL transformation helpers
│   ├── ikUpload.js             # Cloudinary file upload (unsigned preset)
│   ├── Reveal.jsx              # Scroll animation wrapper component
│   ├── layouts/
│   │   └── MainLayout.jsx      # Root layout: NavBar + Outlet + Footer + Popup
│   ├── pages/
│   │   ├── Home.jsx            # / — landing page
│   │   ├── Services.jsx        # /services — service cards
│   │   ├── Contact.jsx         # /contact — contact methods + form
│   │   ├── About.jsx           # /about — story + stats + guarantees
│   │   ├── Pricing.jsx         # /pricing — offers + pricing factors
│   │   ├── Blog.jsx            # /blog — post listing grid
│   │   ├── BlogPost.jsx        # /blog/:slug — full article
│   │   └── AdminPage.jsx       # /admin — loads data → renders AdminPanel
│   └── components/
│       ├── NavBar.jsx          # Fixed nav with ticker bar + mobile menu
│       ├── Footer.jsx          # Brand, social, contacts, copyright
│       ├── HeroSection.jsx     # Full-screen hero with slider + stats
│       ├── VideoSection.jsx    # Autoplay video with IntersectionObserver
│       ├── Sections.jsx        # 7 exported sections (see below)
│       ├── BookingForm.jsx     # Multi-field form → WhatsApp message
│       ├── FAQSection.jsx      # Accordion FAQ
│       ├── SectionHeader.jsx   # Reusable title + subtitle
│       ├── SpecialServicesSection.jsx  # Dark card grid
│       ├── HowItWorksSection.jsx       # 5-step timeline
│       ├── TrustBadgesSection.jsx      # Badges + guarantees
│       └── AdminPanel.jsx      # Full CMS admin (16 tabs, Firebase Auth)
└── docs/
    └── website-documentation.md  # This file
```

### Sections.jsx Exports

| Component | Renders | CMS Data |
|-----------|---------|----------|
| `OffersSection` | 3 pricing cards with features | `t.offers.*` |
| `ServicesSection` | 7 service cards with images | `t.services.*` |
| `PricingSection` | 6 pricing factor cards | `t.pricing.*` |
| `GallerySection` | Bento grid + lightbox | `t.gallery.*` |
| `TestimonialsSection` | Auto-rotating testimonial | `t.testimonials.*` |
| `ServiceAreasSection` | 6 region cards with area chips | `t.serviceAreas.*` |
| `SliderSection` | Image slider with nav | `t.slider.*` |

---

## 4. Data Flow & Content Management

### Architecture

```
                    ┌──────────────────┐
                    │   Firestore DB   │
                    │ hilaly-moving/site│
                    └────────┬─────────┘
                             │ loadSiteData()
                             ▼
                    ┌──────────────────┐
                    │   MainLayout     │
                    │ mergeCMS(saved)  │ ← deep merge over CMS.js defaults
                    │ content state    │
                    └────────┬─────────┘
                             │ Outlet context: { t, th, lang, scrollTo, video }
                             ▼
                    ┌──────────────────┐
                    │   All Pages      │
                    │ useOutletContext │ → reads t.hero, t.services, etc.
                    └──────────────────┘
                    ▲
                    │ saveSiteData()
                    │
                    ┌──────────────────┐
                    │   AdminPanel     │
                    │ draft state      │ → edits → Save → Firestore
                    └──────────────────┘
```

### Content Fallback Chain

1. **Firestore** `loadSiteData()` → `{ content, video }`
2. **localStorage** `nq_content`, `nq_video` (if Firestore fails)
3. **CMS.js defaults** (hardcoded content shipped with the app)

### mergeCMS Logic

Located in `src/layouts/MainLayout.jsx`. Deeply merges saved Firestore data over default CMS data:

```js
{
  ar: {
    ...CMS.ar,
    ...saved.ar,
    nav: { ...CMS.ar.nav, ...saved.ar?.nav },      // partial merge
    footer: { ...CMS.ar.footer, ...saved.ar?.footer },
    services: saved.ar?.services || CMS.ar.services,  // full override
    popup: saved.ar?.popup || CMS.ar.popup,
    slider: saved.ar?.slider || CMS.ar.slider,
    specialServices: saved.ar?.specialServices || CMS.ar.specialServices,
    blog: saved.ar?.blog || CMS.ar.blog,
    // FAQ is always from CMS defaults (not editable from admin)
  }
}
```

---

## 5. CMS Data Fields (Complete Reference)

All content lives under `CMS.ar.*` in `src/cms.js`. Each section maps directly to admin panel tabs.

### `ar.nav` — Navigation

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `brand` | string | `"الهلالي لنقل الاثاث"` | ✅ Admin |
| `logo` | string (URL) | `""` | ✅ Admin |
| `book` | string | `"احجز الآن"` | ✅ Admin |

### `ar.hero` — Hero Section

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `badge` | string | `"✦ موثوق من أكثر من ١٠,٠٠٠ عائلة"` | ✅ Admin |
| `headline` | string | `"انتقل بذكاء.\nانتقل بأمان."` | ✅ Admin |
| `sub` | string | Long description | ✅ Admin |
| `cta` | string | `"احجز الان"` | ✅ Admin |
| `ctaSub` | string | `"لا يلزم أي التزام"` | ✅ Admin |
| `stats` | `[string, string][]` | 3 pairs (e.g., `["+١٠ آلاف", "عملية نقل"]`) | ✅ Admin |

### `ar.popup` — Exit/Entry Popup

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `enabled` | boolean | `true` | ✅ Admin |
| `title` | string | `"خصم 15% على أول عملية نقل!"` | ✅ Admin |
| `desc` | string | Long text | ✅ Admin |
| `button` | string | `"احجز الآن والحصول على الخصم"` | ✅ Admin |
| `timerHours` | number | `48` | ✅ Admin |
| `bgImage` | string (URL) | `""` | ✅ Admin |

### `ar.slider` — Hero Image Slider

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `title` | string | `"معرض الصور المتحرك"` | ✅ Admin |
| `items` | `{ url, caption }[]` | 3 slider images | ✅ Admin |

### `ar.services` — Services Section

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `title` | string | `"خدماتنا"` | ✅ Admin |
| `sub` | string | `"حلول نقل شاملة من الألف إلى الياء"` | ✅ Admin |
| `items` | `{ icon, title, desc, image }[]` | 7 services | ✅ Admin |

### `ar.offers` — Offers/Pricing Cards

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `title` | string | `"العروض الحالية"` | ✅ Admin |
| `sub` | string | `"عروض محدودة للمنتقلين الأذكياء"` | ✅ Admin |
| `items` | `{ badge, color, title, price, desc, features[] }[]` | 3 offers | ✅ Admin |

### `ar.serviceAreas` — Geographic Coverage

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `title` | string | `"مناطق الخدمة"` | ✅ Admin |
| `sub` | string | `"نخدم جميع أنحاء مصر"` | ✅ Admin |
| `cities` | `{ region, color, areas[] }[]` | 6 regions, 60+ areas | ❌ Hardcoded |

### `ar.storage` — Storage Solutions

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `title` | string | `"حلول التخزين"` | ❌ Hardcoded |
| `sub` | string | Description | ❌ Hardcoded |
| `items` | `{ icon, title, desc }[]` | 2 storage types | ❌ Hardcoded |

### `ar.specialServices` — Specialized Services

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `title` | string | `"خدمات متخصصة"` | ✅ Admin |
| `sub` | string | Description | ✅ Admin |
| `items` | `{ icon, title, desc, tag }[]` | 7 services | ✅ Admin |

### `ar.pricing` — Pricing Factors

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `title` | string | `"كيف نسعّر؟"` | ✅ Admin |
| `sub` | string | `"شفافية تامة. بدون رسوم مخفية."` | ✅ Admin |
| `factors` | `{ icon, label, desc, bg, col }[]` | 6 factors | ✅ Admin |

### `ar.gallery` — Photo Gallery

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `title` | string | `"أعمالنا"` | ✅ Admin |
| `sub` | string | `"عمليات نقل حقيقية، نتائج حقيقية"` | ✅ Admin |
| `items` | `{ url, caption }[]` | 6 gallery images | ✅ Admin |

### `ar.testimonials` — Customer Reviews

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `title` | string | `"ماذا يقول عملاؤنا؟"` | ✅ Admin |
| `sub` | string | `"أكثر من ١٠,٠٠٠ عملية بخمس نجوم"` | ✅ Admin |
| `items` | `{ name, role, text, rating }[]` | 4 testimonials | ✅ Admin |

### `ar.trust` — Trust Badges & Guarantees

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `title` | string | `"لماذا تثق الآلاف فينا؟"` | ✅ Admin |
| `sub` | string | Description | ✅ Admin |
| `badges` | `{ icon, num, label, desc }[]` | 4 badges | ✅ Admin |
| `guarantees` | `{ icon, title, desc }[]` | 3 guarantees | ✅ Admin |

### `ar.faq` — FAQ

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `title` | string | `"أسئلة شائعة"` | ✅ Admin |
| `sub` | string | `"كل ما تحتاج لمعرفته عن خدمتنا"` | ✅ Admin |
| `items` | `{ q, a }[]` | 15 Q&As | ✅ Admin |

### `ar.howItWorks` — Process Steps

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `title` | string | `"كيف تتم العملية؟"` | ✅ Admin |
| `sub` | string | `"5 خطوات بسيطة"` | ✅ Admin |
| `steps` | `{ num, icon, title, desc }[]` | 5 steps | ✅ Admin |

### `ar.form` — Booking Form Labels

| Field | Type | Purpose |
|-------|------|---------|
| `title`, `sub` | string | Section heading |
| `name`, `namePh` | string | Name field label + placeholder |
| `phone`, `phonePh` | string | Phone field label + placeholder |
| `from`, `fromPh` | string | "From" field label + placeholder |
| `to`, `toPh` | string | "To" field label + placeholder |
| `date` | string | Date field label |
| `rooms`, `roomsOpts[]` | string + string[] | Rooms label + dropdown options |
| `floor`, `floorPh` | string | Floor label + placeholder |
| `services`, `servicesOpts[]` | string + string[] | Services label + toggle options |
| `notes`, `notesPh` | string | Notes label + placeholder |
| `submit`, `submitting` | string | Button text + submitting text |

All form fields are **editable from Admin Panel**.

### `ar.blog` — Blog

| Field | Type | Default | Editable? |
|-------|------|---------|-----------|
| `title` | string | `"المدونة"` | ✅ Admin |
| `sub` | string | Description | ✅ Admin |
| `items` | `{ title, slug, date, image, excerpt, content, author }[]` | 4 posts | ✅ Admin |

### `ar.footer` — Footer

| Field | Type | Editable? |
|-------|------|-----------|
| `tag` | string | ✅ Admin |
| `phone1` | string | ✅ Admin |
| `phone2` | string | ✅ Admin |
| `email` | string | ✅ Admin |
| `copy` | string | ✅ Admin |
| `social.facebook` | string (URL) | ✅ Admin |
| `social.instagram` | string (URL) | ✅ Admin |
| `social.whatsapp` | string (URL) | ✅ Admin |
| `social.tiktok` | string (URL) | ✅ Admin |

---

## 6. Pages & Routes

| Route | File | Helmet Title | Sections Rendered |
|-------|------|-------------|-------------------|
| `/` | `Home.jsx` | سلبيات الموقع + city keywords | Hero, Video, Offers, Services, ServiceAreas, Pricing, Gallery, Testimonials, FAQ, BookingForm |
| `/services` | `Services.jsx` | خدمات نقل الأثاث | Gradient header, services grid, BookingForm |
| `/contact` | `Contact.jsx` | اتصل بنا | 4 contact method cards, BookingForm |
| `/about` | `About.jsx` | من نحن | Story, stats, guarantees, BookingForm |
| `/pricing` | `Pricing.jsx` | أسعار نقل الأثاث + خصم 15% | Offers cards, pricing factors, BookingForm |
| `/blog` | `Blog.jsx` | مدونة الهلالي | Post card grid (image, date, author, title, excerpt) |
| `/blog/:slug` | `BlogPost.jsx` | Post title | Back link, header, featured image, content paragraphs, WhatsApp button |
| `/admin` | `AdminPage.jsx` | (no Helmet) | AdminPanel with Firebase Auth |

All content pages share: `MainLayout` → NavBar (fixed top) + responsive padding + Footer.

---

## 7. Components (Complete Reference)

### `NavBar.jsx`

| Prop | Type | Source |
|------|------|--------|
| `lang` | string | `"ar"` |
| `dark` | boolean | Theme state |
| `setDark` | function | Theme toggle |
| `t` | object | Current CMS data (Arabic) |
| `scrollTo` | function | Smooth scroll helper |

**Renders:**
- **Ticker bar** (34px): Infinite-scrolling strip of phone numbers + social links. CSS `@keyframes ticker 28s linear infinite`.
- **Main nav**: Brand logo/text → desktop nav links → dark/light toggle → CTA button.
- **Mobile menu** (<640px): Hamburger button → animated slide-in panel with backdrop. Menu items + quick WhatsApp/phone buttons.

**Nav links:** الرئيسية (`/`), الخدمات (`/services`), المدونة (`/blog`), العروض (`/pricing`), اتصل بنا (`/contact` — highlighted).

### `Footer.jsx`

| Prop | Type | Source |
|------|------|--------|
| `t` | object | Current CMS data |

**Renders:** Brand name → tagline → social icons (only those with URLs) → phone → email → copyright.

### `HeroSection.jsx`

| Prop | Type | Source |
|------|------|--------|
| `t` | object | CMS (`t.hero.*`, `t.slider.*`) |
| `scrollTo` | function | Scroll helper |

**Renders:** Full-viewport dark hero with animated badge, gradient headline, subtitle, CTA + phone secondary button, 3 stat cards, and a touch-enabled image slider.

### `VideoSection.jsx`

| Prop | Type | Source |
|------|------|--------|
| `video` | object | `{ src, poster, title, desc }` from Firestore |

Returns `null` if no `video.src`. Autoplay via IntersectionObserver at 30% threshold. Shows play overlay if autoplay blocked. Supports iOS inline playback.

### `BookingForm.jsx`

| Prop | Type | Source |
|------|------|--------|
| `t` | object | CMS (`t.form.*`, `t.footer.phone1`) |
| `lang` | string | `"ar"` |

**Fields:** name, phone (required), from (required), to (required), date (required), rooms (dropdown), floor, services (toggle chips), notes.

**Submission:** Builds WhatsApp message via `buildWAMessage()` → opens `wa.me` link in new tab.

### `FAQSection.jsx`

| Prop | Type |
|------|------|
| `t` | object (CMS `t.faq.*`) |

Accordion with animated expand/collapse. Returns `null` if no `t.faq`.

### `SectionHeader.jsx`

| Prop | Type |
|------|------|
| `title` | string |
| `sub` | string |

Centered title + subtitle wrapped in Reveal animation.

### Reusable Section Components (from `Sections.jsx`)

| Component | CMS Data | Visual Features |
|-----------|----------|-----------------|
| `OffersSection` | `t.offers.*` | 3 cards, popular ribbon (middle card), hover lift, feature checkmarks, gold CTA |
| `ServicesSection` | `t.services.*` | 7 cards, 180px images, stat badges, hover border glow, bottom custom CTA banner |
| `PricingSection` | `t.pricing.*` | 6 factor cards, 4-step calculation block, guarantee strip |
| `GallerySection` | `t.gallery.*` | Stats bar, bento grid (12-col desktop / 2-col mobile), lightbox with prev/next |
| `TestimonialsSection` | `t.testimonials.*` | Auto-rotate 5s, star rating, avatar initial, dot indicators |
| `ServiceAreasSection` | `t.serviceAreas.*` | 6 color-coded region cards with area chips. Returns null if no data |
| `SliderSection` | `t.slider.*` | Image slider with prev/next arrows, auto-advance 5s, dots, captions |

### `SpecialServicesSection.jsx`

| Prop | Type |
|------|------|
| `t` | object |

Dark card grid with dot background. Each card: tag badge, icon, title, description, CTA button.

### `HowItWorksSection.jsx`

| Prop | Type |
|------|------|
| `t` | object |

Desktop: 5-column timeline with colored circles + gradient line. Mobile: vertical list with icons.

### `TrustBadgesSection.jsx`

| Prop | Type |
|------|------|
| `t` | object |

Badges grid (4 items) + guarantees grid (3 items) + trust statement.

### `Reveal.jsx`

Scroll-triggered animation wrapper. Uses IntersectionObserver. Props: `direction` (up/down/left/right), `delay` (ms).

---

## 8. Admin Panel

### Access

Route: `/admin`  
Login: Firebase Auth (email/password)  
Account: `admin@hilalymoving.com` / `Hilaly@Admin2026`

### Authentication Flow

1. `onAuthStateChanged` listener runs on mount → checks existing session
2. If not logged in: shows login form with email + password
3. Error messages in Arabic (6 error types handled)
4. Session persists across page reloads (Firebase Auth tokens)

### Draft System

- `draft` = deep clone of `content` on mount
- `videoDraft` = deep clone of `video`
- `dirty` flag tracks unsaved changes
- `updDraft(path, val)` — dot-notation path setter (e.g., `ar.footer.phone1`)
- `save()` → `saveSiteData(draft, videoDraft)` → Firestore write
- `discard()` → resets both drafts from original data
- Sticky save bar at bottom when dirty: shows warning + save/discard buttons

### 16 Tabs

| # | Tab Key | Label | What You Can Edit |
|---|---------|-------|-------------------|
| 1 | `contacts` | 📞 أرقام التواصل | Company name, logo upload, book button, phones, email, WhatsApp number, social links |
| 2 | `hero` | 🎬 البطل الرئيسي | Badge, headline, subtitle, CTA, sub CTA, 3 stats |
| 3 | `media` | 🖼️ الصور والفيديو | Video URL or upload, gallery images (add/remove/reorder) |
| 4 | `popup` | 🎁 العرض المنبثق | Enable/disable, title, desc, button, timer hours, background image |
| 5 | `slider` | 🖼️ عرض الشرائح | Section title, slider images |
| 6 | `services` | 🛠️ خدماتنا | Section titles, service items with icon, title, desc, image |
| 7 | `offers` | 💰 العروض | Section titles, offer cards with badge, color, title, price, features |
| 8 | `special` | ⭐ خدمات متخصصة | Section titles, special service items |
| 9 | `testimonials` | 💬 تقييمات العملاء | Customer name, role, rating, review text |
| 10 | `pricing` | 📊 كيفية التسعير | Section titles, pricing factors |
| 11 | `trust` | 🏆 الثقة والضمانات | Badges + guarantees with icons, titles, descriptions |
| 12 | `how` | 📋 خطوات العمل | Steps with numbers, icons, titles, descriptions |
| 13 | `faq` | ❓ الأسئلة الشائعة | Question/answer pairs |
| 14 | `form` | 📝 نموذج الحجز | All field labels, placeholders, options lists |
| 15 | `blog` | 📝 المدونة | Section titles, blog posts with title, slug, date, author, image, excerpt, content |
| 16 | `footer` | 📌 تذييل الموقع | Tagline + copyright text |

### Save Behavior

- Writes to Firestore doc `hilaly-moving/site`
- Includes audit trail: `updatedBy` (user email) + `updatedAt` (ISO timestamp)
- Strips large base64 video data (>500KB) — shows `video_large` warning
- Shows success/error feedback (auto-dismisses after 4s)
- Sticky save bar visible when unsaved changes exist

---

## 9. Firebase Integration

### Configuration

```
Project ID:    helaly-moving
Firestore doc: hilaly-moving/site
Auth method:   email/password (admin only)
```

### Key Functions (`src/firebase.js`)

| Function | Description |
|----------|-------------|
| `loadSiteData()` | Reads `hilaly-moving/site`, returns `{ content, video }` or null |
| `saveSiteData(content, video)` | Writes sanitized content + audit fields to Firestore |
| `sanitize(obj)` | Removes undefined values, converts nested arrays to `[{k,v}]` format |
| `deserialize(obj)` | Restores `[{k,v}]` back to `[[k,v]]` for stats |
| `getBlogPosts()` | Reads `blog` collection ordered by date desc |
| `getBlogPost(slug)` | Finds single blog post by slug |

### Firestore Rules

```js
// Firestore locked to admin UID only:
allow write: if request.auth.uid == 'q15mMz7v0IbKk2AkOwv4QEkZxwf1';
```

### Offline Handling

Console warnings from Firebase offline mode are suppressed in `firebase.js`.

---

## 10. Cloudinary Media Upload

Despite the internal naming ("ImageKit"), media uploads go to **Cloudinary**.

### Configuration (`src/imagekit.js`)

```
Cloud Name:  dxvoir9oy
API Key:     SOipLMq61OSi8lMQQwYTIf3BFpE
Upload Type: Unsigned (preset: "store folder")
```

### Upload Function (`src/ikUpload.js`)

- `uploadToImageKit(file, folder)` — converts to base64, posts to Cloudinary unsigned upload API
- Image limit: 10MB
- Video limit: 100MB
- Returns `{ url }` on success

### Image Transformation Helper

`ikUrl(src, { w, h, q, f })` — builds Cloudinary URLs with optimization parameters (width, height, quality, format, crop).

---

## 11. Features in Detail

### WhatsApp Integration

Every form submission generates a pre-formatted WhatsApp message:

```
📦 طلب نقل أثاث جديد
────────────────
👤 الاسم: محمد علي
📱 واتساب: 01012345678
📍 من: مدينة نصر
📍 إلى: التجمع الخامس
📅 التاريخ: 2026-06-25
🛏️ الغرف: 3 غرف
📌 ملاحظات: ...
────────────────
🚛 الهلالي لنقل الاثاث
```

The message is built via `buildWAMessage(f, lang)` in `src/whatsapp.js`, supporting Arabic and English (`lang` parameter). The WhatsApp number is extracted from `t.footer.phone1` (digits-only regex).

**WhatsApp links appear in:**
- Booking form submission
- Blog post "استفسر عبر واتساب" button
- NavBar mobile menu direct button
- Footer phone number links
- Ticker bar phone numbers

### Dark/Light Theme

Two theme palettes in `src/theme.js` with 12 CSS variable keys each (bg, text, accent, border, shadow, etc.). Toggle in NavBar with localStorage persistence (`nq_dark`). Tailwind configured with `darkMode: 'class'`.

### Popup Timer

- Full-screen modal appears on site entry if enabled
- Animated entry (scale 0.5 → 1.05 → 1)
- Countdown timer starts from `popup.timerHours` hours
- CTA button closes popup + smooth scrolls to booking form
- Static CSS animation timer display

### Scroll Animations

Custom IntersectionObserver-based Reveal component. Elements fade + translate into view on scroll. Configurable direction (up/down/left/right) and delay. No external animation library.

### Gallery Lightbox

Full-screen dark overlay with:
- Image at max 80vh
- Caption + page counter footer
- Prev/next navigation arrows
- Close button (or click outside)

### Audio/Video Considerations

- Video autoplay via IntersectionObserver (30% threshold)
- Falls back to manual play if autoplay blocked
- iOS inline playback attributes (`playsInline`, `webkit-playsinline`)
- "اضغط للتشغيل" hint on mobile

### SEO & Structured Data

- **JSON-LD schemas** in `index.html`: MovingCompany, LocalBusiness, BreadcrumbList, FAQPage
- **Per-page Helmet**: Unique `<title>`, `<meta name="description">`, `<link rel="canonical">`
- **Open Graph** + **Twitter Cards** for social sharing
- **Sitemap**: 6 URLs with priorities (home: 1.0, blog: 0.9, services: 0.9, etc.)
- **Robots.txt**: Allow all, disallow admin queries, sitemap URL, crawl-delay 1

### Service Areas (Geo)

6 regions covering:
- القاهرة الكبرى (15 areas)
- القاهرة الجديدة (9 areas)
- الشيخ زايد و 6 أكتوبر (7 areas)
- الإسكندرية (10 areas)
- الدلتا والمحافظات (8 areas)
- الصعيد والقنال (9 areas)

Each shown as a color-coded card with area chips.

---

## 12. Build, Deploy & Prerendering

### Local Development

```bash
npm run dev      # Vite dev server (default http://localhost:5173)
npm run build    # Production build + prerender
npm run preview  # Preview production build
```

### Build Output

```
dist/
├── index.html
├── assets/
│   ├── vendor-*.js        # React/React DOM (141KB)
│   ├── index.esm-*.js     # Firebase code-split (196KB)
│   ├── index-*.js         # App bundle (791KB)
│   └── index-*.css        # Styles (17KB)
├── services/index.html
├── contact/index.html
├── about/index.html
├── pricing/index.html
└── blog/index.html
```

### Prerender Script (`scripts/prerender.cjs`)

Copies `dist/index.html` into subdirectories for 5 routes, enabling static serving without a server-side renderer. Runs automatically after `vite build` via the `build` npm script.

### Deployment Targets

| Target | Status | Notes |
|--------|--------|-------|
| Azure (current) | ✅ Active | `helalymoving.tryasp.net` — SPA via `web.config` |
| Cloudflare Pages (target) | 🔜 Pending | Connect GitHub repo, build command `npm run build`, output dir `dist` |

### SPA Routing

For any static host (Cloudflare Pages, Netlify, Vercel), the `_redirects` file at `public/_redirects` handles all routes:

```
/*    /index.html    200
```

### Post-Deploy Checklist

1. Verify all 6 routes load (home, services, contact, about, pricing, blog)
2. Test admin panel login at `/admin`
3. Test WhatsApp form submission (opens correct wa.me link)
4. Test image upload in admin (Cloudinary)
5. Verify SEO meta tags via browser DevTools
6. Test dark/light theme toggle
7. Test mobile menu and responsiveness
8. Verify popup appears once per session

---

## 13. Customization Guide

### Adding a New CMS Field

1. Add field to `CMS.ar.*` in `src/cms.js` (with Arabic default)
2. Add merge logic in `mergeCMS()` in `src/layouts/MainLayout.jsx`
3. Add admin UI in the appropriate tab in `src/components/AdminPanel.jsx`
4. Use the field in your component via `t.sectionName.fieldName`
5. Build and test

### Adding a New Page

1. Create `src/pages/NewPage.jsx` with Helmet + sections
2. Add route in `src/App.jsx` inside `MainLayout`
3. Add nav link in `src/components/NavBar.jsx`
4. Add to `scripts/prerender.cjs` routes array
5. Add to `public/sitemap.xml`

### Adding a New Admin Tab

1. Add tab entry in the tabs array in `AdminPanel.jsx` (line ~207)
2. Add `{tab === 'newtab' && (...)}` block before the footer tab section
3. Use `updDraft('ar.section.field', value)` or direct JSON manipulation for edits
4. Follow existing patterns for add/delete UI

### Changing Theme Colors

Edit `THEMES.light` and `THEMES.dark` in `src/theme.js`. Each has 12 keys:

```js
{ bg, bgCard, bgSection, bgNav, text, textMuted, border, accent, accentLight, accentText, shadow, shadowSm }
```

Also update CSS variables in `src/index.css` and `tailwind.config.js` if using Tailwind classes.

### Changing WhatsApp Number

Edit `phone1` in the footer tab of the admin panel, or update the default in `cms.js` `ar.footer.phone1`. This number is used for:
- Ticker bar display
- Footer contact
- WhatsApp booking form link
- Blog post inquiry button

### Adding a New Language (e.g., English)

1. Add `en: { ... }` to `CMS` in `src/cms.js` with English translations
2. Update `mergeCMS()` to handle both languages
3. Add a language switcher in NavBar
4. Update `lang` state flow throughout components
5. Update `buildWAMessage()` in `src/whatsapp.js` for English format

---

## Appendix: Environment & Admin Quick Reference

| Item | Value |
|------|-------|
| Admin URL | `/admin` |
| Admin email | `admin@hilalymoving.com` |
| Admin password | `Hilaly@Admin2026` |
| Firebase project | `helaly-moving` |
| Firestore doc | `hilaly-moving/site` |
| Cloudinary cloud | `dxvoir9oy` |
| Cloudinary preset | `store folder` (unsigned) |
| Brand name (default) | الهلالي لنقل الاثاث |
| Primary phone | editable from admin |
| WhatsApp number | derived from phone1 (digits only) |
| Build command | `npm run build` |
| Output directory | `dist/` |
| SPA fallback | `_redirects` file |
