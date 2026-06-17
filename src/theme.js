import { createContext, useContext } from 'react'

export const THEMES = {
  light: {
    bg: '#f8fafc',
    bgCard: '#ffffff',
    bgNav: 'rgba(255,255,255,0.88)',
    bgSection: '#f1f5f9',
    bgHero: 'linear-gradient(135deg,#0a0a0a 0%,#1a1200 50%,#0a0a0a 100%)',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#e2e8f0',
    accent: '#B8860B',
    accentLight: '#fef9e7',
    accentText: '#92650a',
    green: '#10b981',
    shadow: '0 20px 60px rgba(0,0,0,0.08)',
    shadowSm: '0 4px 16px rgba(0,0,0,0.06)',
  },
  dark: {
    bg: '#020617',
    bgCard: '#0f172a',
    bgNav: 'rgba(2,6,23,0.9)',
    bgSection: '#0f172a',
    bgHero: 'linear-gradient(135deg,#0a0a0a 0%,#1a1200 50%,#0a0a0a 100%)',
    text: '#f1f5f9',
    textMuted: '#94a3b8',
    border: '#1e293b',
    accent: '#D4A017',
    accentLight: '#2a2000',
    accentText: '#f5c842',
    green: '#34d399',
    shadow: '0 20px 60px rgba(0,0,0,0.5)',
    shadowSm: '0 4px 16px rgba(0,0,0,0.35)',
  },
}

export const ThemeCtx = createContext(THEMES.light)
export const useTheme = () => useContext(ThemeCtx)
