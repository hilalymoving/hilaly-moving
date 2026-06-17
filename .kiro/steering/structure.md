# Project Structure

## Directory Layout

```
hilaly-moving/
├── public/                    # Static assets
│   ├── favicon.jpg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/            # React components
│   │   ├── AdminPanel.jsx     # Password-protected CMS editor
│   │   ├── BookingForm.jsx    # WhatsApp quote form
│   │   ├── FAQSection.jsx     # FAQ accordion
│   │   ├── Footer.jsx         # Footer with contact info
│   │   ├── HeroSection.jsx    # Full-screen hero with animations
│   │   ├── HowItWorksSection.jsx
│   │   ├── NavBar.jsx         # Fixed nav with theme/lang toggles
│   │   ├── SectionHeader.jsx  # Reusable section title component
│   │   ├── Sections.jsx       # Offers, Services, Pricing, Gallery, Testimonials
│   │   ├── SpecialServicesSection.jsx
│   │   ├── TrustBadgesSection.jsx
│   │   └── VideoSection.jsx   # Video player with poster
│   ├── App.jsx                # Root component, routing, theme provider
│   ├── cms.js                 # **SINGLE SOURCE OF TRUTH** - All content (AR/EN)
│   ├── firebase.js            # Firestore initialization and helpers
│   ├── imagekit.js            # ImageKit configuration
│   ├── ikUpload.js            # ImageKit upload utilities
│   ├── main.jsx               # React entry point
│   ├── Reveal.jsx             # IntersectionObserver animation wrapper
│   ├── theme.js               # Theme definitions (light/dark) + context
│   ├── whatsapp.js            # WhatsApp number + message builder
│   └── index.css              # Global CSS (minimal)
├── index.html                 # HTML shell with Google Fonts
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Key Architecture Patterns

### Content Management
- **`cms.js`** is the single source of truth for all text content
- Structured as `CMS.ar` (Arabic) with nested objects per section
- Admin panel edits in-memory state, persists to Firestore
- Content loaded from Firestore on mount, falls back to localStorage

### Component Organization
- **Sections.jsx** exports multiple section components (Offers, Services, Pricing, Gallery, Testimonials)
- Each component receives `t` (translated content) as prop
- Components are self-contained with inline styles

### Styling Pattern
- Theme context (`ThemeCtx`) provides color tokens
- Components use `useTheme()` hook to access theme
- Inline `style` objects reference theme variables
- Animations defined in inline `<style>` tags within components

### State Management
- No external state library
- React Context for theme (`ThemeCtx`)
- Local state in `App.jsx` for content, video, admin mode
- Firestore for persistence

### Routing
- Single-page application (no router library)
- Conditional rendering: `admin ? <AdminPanel /> : <MainSite />`
- Smooth scroll navigation via `scrollTo(id)`

## File Naming Conventions
- Components: PascalCase (e.g., `NavBar.jsx`, `BookingForm.jsx`)
- Utilities: camelCase (e.g., `cms.js`, `whatsapp.js`, `theme.js`)
- Config files: lowercase with dots (e.g., `vite.config.js`)

## Important Files to Know

### Content & Configuration
- **`src/cms.js`** - Edit all site text here (Arabic/English)
- **`src/whatsapp.js`** - Change WhatsApp number (`WA_NUMBER`)
- **`src/theme.js`** - Modify colors and design tokens
- **`src/firebase.js`** - Firebase config and Firestore helpers

### Entry Points
- **`src/main.jsx`** - React root, renders `<App />`
- **`src/App.jsx`** - Main app logic, theme provider, admin toggle
- **`index.html`** - HTML shell, loads Google Fonts

### Admin
- **`src/components/AdminPanel.jsx`** - Change `ADMIN_PWD` constant for security
- Access via `?admin=true` query parameter or ⚙️ icon in navbar
