# Tech Stack

## Build System
- **Vite 5** - Fast build tool and dev server
- **React 18** - UI framework
- **PostCSS + Autoprefixer** - CSS processing

## Core Dependencies
- `react` + `react-dom` - UI library
- `firebase` - Firestore for content persistence
- `@imagekit/react` + `imagekitio-react` - Image optimization and delivery
- `tailwindcss` - Utility-first CSS framework (configured but minimal usage)

## Styling Approach
**Inline CSS with theme system** - Primary styling method
- CSS variables defined in `theme.js` (light/dark modes)
- Inline styles in components using theme context
- Tailwind configured but used sparingly
- Custom CSS animations defined inline with `<style>` tags

## Key Libraries
- **Google Fonts**: Cairo (Arabic), Inter (English)
- **IntersectionObserver API**: Scroll-triggered animations
- **WhatsApp API**: `wa.me/{number}?text=...` for lead generation

## Common Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
```

### Production
```bash
npm run build        # Build for production (outputs to /dist)
npm run preview      # Preview production build locally
```

### Deployment
The build outputs static files to `/dist` that can be deployed to:
- Netlify (drag & drop)
- Vercel (`vercel --prod`)
- GitHub Pages
- cPanel/FTP (upload dist contents)

## Configuration Files
- `vite.config.js` - Vite + React plugin setup
- `tailwind.config.js` - Tailwind with custom brand color variables
- `postcss.config.js` - PostCSS with Tailwind and Autoprefixer
- `firebase.js` - Firebase/Firestore initialization

## Environment Notes
- No `.env` files - Firebase config is public (client-side only)
- Admin password hardcoded in `AdminPanel.jsx` (change before production)
- WhatsApp number configured in `whatsapp.js`
