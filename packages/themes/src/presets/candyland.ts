import type { ThemePreset } from '../schema/theme'

export const candyland = {
  name: 'candyland',
  title: 'Candyland',
  source: 'tweakcn',
  fonts: ['Poppins', 'Roboto Mono'],
  typography: {
    'font-sans':
      'Poppins, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-mono':
      '"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.5rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.8677 0.0735 7.0855)',
      'primary-foreground': 'oklch(0 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.8148 0.0819 225.7537)',
      'secondary-foreground': 'oklch(0 0 0)',
    },
    accent: {
      accent: 'oklch(0.968 0.211 109.7692)',
      'accent-foreground': 'oklch(0 0 0)',
    },
    base: {
      background: 'oklch(0.9809 0.0025 228.7836)',
      foreground: 'oklch(0.3211 0 0)',
    },
    card: {
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.3211 0 0)',
    },
    popover: {
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.3211 0 0)',
    },
    muted: {
      muted: 'oklch(0.8828 0.0285 98.1033)',
      'muted-foreground': 'oklch(0.5382 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.8699 0 0)',
      input: 'oklch(0.8699 0 0)',
      ring: 'oklch(0.8677 0.0735 7.0855)',
    },
    chart: {
      'chart-1': 'oklch(0.8677 0.0735 7.0855)',
      'chart-2': 'oklch(0.8148 0.0819 225.7537)',
      'chart-3': 'oklch(0.968 0.211 109.7692)',
      'chart-4': 'oklch(0.8027 0.1355 349.2347)',
      'chart-5': 'oklch(0.7395 0.2268 142.8504)',
    },
    sidebar: {
      sidebar: 'oklch(0.9809 0.0025 228.7836)',
      'sidebar-foreground': 'oklch(0.3211 0 0)',
      'sidebar-primary': 'oklch(0.8677 0.0735 7.0855)',
      'sidebar-primary-foreground': 'oklch(0 0 0)',
      'sidebar-accent': 'oklch(0.968 0.211 109.7692)',
      'sidebar-accent-foreground': 'oklch(0 0 0)',
      'sidebar-border': 'oklch(0.8699 0 0)',
      'sidebar-ring': 'oklch(0.8677 0.0735 7.0855)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.8027 0.1355 349.2347)',
      'primary-foreground': 'oklch(0 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.7395 0.2268 142.8504)',
      'secondary-foreground': 'oklch(0 0 0)',
    },
    accent: {
      accent: 'oklch(0.8148 0.0819 225.7537)',
      'accent-foreground': 'oklch(0 0 0)',
    },
    base: {
      background: 'oklch(0.2303 0.0125 264.2926)',
      foreground: 'oklch(0.9219 0 0)',
    },
    card: {
      card: 'oklch(0.321 0.0078 223.6661)',
      'card-foreground': 'oklch(0.9219 0 0)',
    },
    popover: {
      popover: 'oklch(0.321 0.0078 223.6661)',
      'popover-foreground': 'oklch(0.9219 0 0)',
    },
    muted: {
      muted: 'oklch(0.3867 0 0)',
      'muted-foreground': 'oklch(0.7155 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.3867 0 0)',
      input: 'oklch(0.3867 0 0)',
      ring: 'oklch(0.8027 0.1355 349.2347)',
    },
    chart: {
      'chart-1': 'oklch(0.8027 0.1355 349.2347)',
      'chart-2': 'oklch(0.7395 0.2268 142.8504)',
      'chart-3': 'oklch(0.8148 0.0819 225.7537)',
      'chart-4': 'oklch(0.968 0.211 109.7692)',
      'chart-5': 'oklch(0.8652 0.1768 90.3816)',
    },
    sidebar: {
      sidebar: 'oklch(0.2303 0.0125 264.2926)',
      'sidebar-foreground': 'oklch(0.9219 0 0)',
      'sidebar-primary': 'oklch(0.8027 0.1355 349.2347)',
      'sidebar-primary-foreground': 'oklch(0 0 0)',
      'sidebar-accent': 'oklch(0.8148 0.0819 225.7537)',
      'sidebar-accent-foreground': 'oklch(0 0 0)',
      'sidebar-border': 'oklch(0.3867 0 0)',
      'sidebar-ring': 'oklch(0.8027 0.1355 349.2347)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
