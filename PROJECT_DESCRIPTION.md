# Hilaly Moving 🚛

Hilaly Moving is a professional, high-conversion landing page designed for a furniture moving and logistics service in Egypt. It focuses on trust, transparency, and a frictionless lead-generation process via WhatsApp.

## 🌟 Key Features

- **WhatsApp Lead Generation**: Instead of a complex backend, the site uses a custom message builder to send detailed booking requests directly to the business owner's WhatsApp.
- **Dynamic CMS Architecture**: Content is managed in a central `cms.js` file, allowing for easy updates to pricing, services, and testimonials without touching the UI components.
- **Theming System**: A robust theme provider supporting both **Light** and **Dark** modes, utilizing CSS variables for seamless transitions.
- **Scroll-Reveal Animations**: A custom `Reveal` component that triggers entrance animations as the user scrolls down the page.
- **RTL Optimized**: Fully designed for Arabic (RTL), ensuring a native experience for the primary target market.
- **Admin Mode**: A built-in (client-side) administrative interface to preview content changes in real-time.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS, PostCSS
- **Fonts**: Cairo (Google Fonts)
- **Icons/Visuals**: Emojis for lightweight loading, Unsplash for high-quality imagery.

## 📂 Project Structure

- `src/App.jsx`: Main application logic and routing (User vs Admin view).
- `src/cms.js`: The "Single Source of Truth" for all text content and site data.
- `src/theme.js`: Design tokens and theme configurations.
- `src/whatsapp.js`: Logic for formatting user input into a professional WhatsApp message.
- `src/Reveal.jsx`: Reusable animation wrapper for UI elements.
- `src/components/`: Modular UI sections (Hero, Pricing, Gallery, Booking Form, etc.).

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## ⚙️ Configuration
To change the receiving phone number for bookings, update the `WA_NUMBER` constant in `src/whatsapp.js`.
