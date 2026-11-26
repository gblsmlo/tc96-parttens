import type { ThemePreset } from '../schema/theme'

export const vercel = {
  name: 'vercel',
  title: 'Vercel',
  source: 'tweakcn',
  fonts: ['Geist', 'Geist Mono'],
  typography: {
    'font-sans':
      'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif': 'Georgia, ui-serif, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.5rem',
  },
  light: {
    primary: {
      primary: 'oklch(0 0 0)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.94 0 0)',
      'secondary-foreground': 'oklch(0 0 0)',
    },
    accent: {
      accent: 'oklch(0.94 0 0)',
      'accent-foreground': 'oklch(0 0 0)',
    },
    base: {
      background: 'oklch(0.99 0 0)',
      foreground: 'oklch(0 0 0)',
    },
    card: {
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0 0 0)',
    },
    popover: {
      popover: 'oklch(0.99 0 0)',
      'popover-foreground': 'oklch(0 0 0)',
    },
    muted: {
      muted: 'oklch(0.97 0 0)',
      'muted-foreground': 'oklch(0.44 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.63 0.19 23.03)',
    },
    'border-input': {
      border: 'oklch(0.92 0 0)',
      input: 'oklch(0.94 0 0)',
      ring: 'oklch(0 0 0)',
    },
    chart: {
      'chart-1': 'oklch(0.81 0.17 75.35)',
      'chart-2': 'oklch(0.55 0.22 264.53)',
      'chart-3': 'oklch(0.72 0 0)',
      'chart-4': 'oklch(0.92 0 0)',
      'chart-5': 'oklch(0.56 0 0)',
    },
    sidebar: {
      sidebar: 'oklch(0.99 0 0)',
      'sidebar-foreground': 'oklch(0 0 0)',
      'sidebar-primary': 'oklch(0 0 0)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.94 0 0)',
      'sidebar-accent-foreground': 'oklch(0 0 0)',
      'sidebar-border': 'oklch(0.94 0 0)',
      'sidebar-ring': 'oklch(0 0 0)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(1 0 0)',
      'primary-foreground': 'oklch(0 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.25 0 0)',
      'secondary-foreground': 'oklch(1 0 0)',
    },
    accent: {
      accent: 'oklch(0.32 0 0)',
      'accent-foreground': 'oklch(1 0 0)',
    },
    base: {
      background: 'oklch(0 0 0)',
      foreground: 'oklch(1 0 0)',
    },
    card: {
      card: 'oklch(0.14 0 0)',
      'card-foreground': 'oklch(1 0 0)',
    },
    popover: {
      popover: 'oklch(0.18 0 0)',
      'popover-foreground': 'oklch(1 0 0)',
    },
    muted: {
      muted: 'oklch(0.23 0 0)',
      'muted-foreground': 'oklch(0.72 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.69 0.2 23.91)',
    },
    'border-input': {
      border: 'oklch(0.26 0 0)',
      input: 'oklch(0.32 0 0)',
      ring: 'oklch(0.72 0 0)',
    },
    chart: {
      'chart-1': 'oklch(0.81 0.17 75.35)',
      'chart-2': 'oklch(0.58 0.21 260.84)',
      'chart-3': 'oklch(0.56 0 0)',
      'chart-4': 'oklch(0.44 0 0)',
      'chart-5': 'oklch(0.92 0 0)',
    },
    sidebar: {
      sidebar: 'oklch(0.18 0 0)',
      'sidebar-foreground': 'oklch(1 0 0)',
      'sidebar-primary': 'oklch(1 0 0)',
      'sidebar-primary-foreground': 'oklch(0 0 0)',
      'sidebar-accent': 'oklch(0.32 0 0)',
      'sidebar-accent-foreground': 'oklch(1 0 0)',
      'sidebar-border': 'oklch(0.32 0 0)',
      'sidebar-ring': 'oklch(0.72 0 0)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
