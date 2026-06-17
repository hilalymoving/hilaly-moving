# Hilaly Moving — Furniture Moving Landing Page

A high-conversion, bilingual (Arabic/English) landing page with:
- 🌙 Dark / Light mode (CSS variable system — works everywhere)
- 🌐 Arabic (RTL) + English (LTR) with one-click toggle
- 💬 WhatsApp booking form with pre-filled message
- ⚙️ Admin Panel (CMS) for live content editing
- ✨ Scroll-triggered animations on all sections
- 📱 Fully responsive / mobile-first

---

## Quick Start

```bash
# 1 — Install dependencies
npm install

# 2 — Start dev server (http://localhost:5173)
npm run dev

# 3 — Build for production
npm run build

# 4 — Preview production build
npm run preview
```

---

## Project Structure

```
naqlaplus/
├── index.html                  # HTML shell with Google Fonts
├── vite.config.js              # Vite + React plugin
├── package.json
└── src/
    ├── main.jsx                # React root
    ├── App.jsx                 # Root component, routing, theme provider
    ├── theme.js                # THEMES object + ThemeCtx context
    ├── cms.js                  # All text content (EN + AR) — edit here
    ├── whatsapp.js             # WA_NUMBER + message builder
    ├── Reveal.jsx              # IntersectionObserver scroll animation
    └── components/
        ├── NavBar.jsx          # Fixed nav with theme/lang/admin toggles
        ├── HeroSection.jsx     # Full-screen hero with glow blobs
        ├── SectionHeader.jsx   # Reusable section title + subtitle
        ├── Sections.jsx        # Offers, Services, Pricing, Gallery, Testimonials
        ├── BookingForm.jsx     # Multi-field quote form → WhatsApp redirect
        ├── Footer.jsx          # Footer with contact links
        └── AdminPanel.jsx      # Password-protected CMS dashboard
```

---

## Customisation Guide

### 1 — Change WhatsApp Number
Open `src/whatsapp.js` and update:
```js
export const WA_NUMBER = '201012345678' // Your number with country code, no +
```

### 2 — Edit All Text Content
Open `src/cms.js` — every string on the site lives here for both EN and AR.

### 3 — Change Admin Password
Open `src/components/AdminPanel.jsx`:
```js
const ADMIN_PWD = 'admin123' // ← Replace with something strong
```

### 4 — Theme Colors
Open `src/theme.js` and update the `THEMES.light` / `THEMES.dark` objects.
The `accent` color is used for buttons, highlights, and the nav CTA.

### 5 — Add Firebase Persistence (optional)
The Admin Panel currently edits in-memory state only.
To persist across sessions, install Firebase and update `setContent` calls
to write to Firestore, and load `CMS` from Firestore on mount.

---

## Admin Panel

Click the **"⚙️ Admin Panel"** button in the bottom-right corner of the site,
or click the **⚙ icon** in the navbar.

**Default password:** `admin123`

Inside you can live-edit:
- Hero headline and subtitle (EN + AR)
- Brand name (EN + AR)
- Offer prices (EN)
- Gallery thumbnails preview

---

## Deployment

Works with any static host:

```bash
npm run build   # outputs to /dist
```

Then upload `/dist` to:
- **Netlify**: drag & drop the dist folder at netlify.com
- **Vercel**: `vercel --prod`
- **GitHub Pages**: push dist to `gh-pages` branch
- **cPanel / FTP**: upload dist contents to public_html

---

## Tech Stack

- **React 18** — UI components
- **Vite 5** — build tool & dev server
- **Inline CSS** — theme system (no Tailwind needed, works in any env)
- **IntersectionObserver** — scroll animations
- **WhatsApp API** — `wa.me/{number}?text=...`
- **Google Fonts** — Inter (EN) + Cairo (AR)
