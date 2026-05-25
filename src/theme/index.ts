export const theme = {
  colors: {
    background: '#000000',
    surface: '#0A0A0A',
    surfaceElevated: '#111111',
    border: '#1A1A1A',
    borderLight: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#888888',
    textMuted: '#444444',
    accent: '#C9A96E',
    accentLight: '#E8D5B0',
    accentDim: 'rgba(201,169,110,0.15)',
    error: '#FF4444',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  typography: {
    hero: 34,
    h1: 28,
    h2: 22,
    h3: 18,
    body: 14,
    small: 12,
    tiny: 10,
  },
  borderRadius: {
    sm: 2,
    md: 4,
    lg: 8,
  },
};

export type Theme = typeof theme;
