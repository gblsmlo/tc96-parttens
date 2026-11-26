import type { ThemePreset } from '../schema/theme'

export const retroArcade = {
  name: 'retro-arcade',
  title: 'Retro Arcade',
  source: 'tweakcn',
  fonts: ['Outfit', 'Space Mono'],
  typography: {
    'font-sans':
      'Outfit, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-mono':
      '"Space Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.25rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.5924 0.2025 355.8943)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.6437 0.1019 187.384)',
      'secondary-foreground': 'oklch(1 0 0)',
    },
    accent: {
      accent: 'oklch(0.5808 0.1732 39.5003)',
      'accent-foreground': 'oklch(1 0 0)',
    },
    base: {
      background: 'oklch(0.9735 0.0261 90.0953)',
      foreground: 'oklch(0.3092 0.0518 219.6516)',
    },
    card: {
      card: 'oklch(0.9306 0.026 92.402)',
      'card-foreground': 'oklch(0.3092 0.0518 219.6516)',
    },
    popover: {
      popover: 'oklch(0.9306 0.026 92.402)',
      'popover-foreground': 'oklch(0.3092 0.0518 219.6516)',
    },
    muted: {
      muted: 'oklch(0.6979 0.0159 196.794)',
      'muted-foreground': 'oklch(0.3092 0.0518 219.6516)',
    },
    destructive: {
      destructive: 'oklch(0.5863 0.2064 27.1172)',
    },
    'border-input': {
      border: 'oklch(0.6537 0.0197 205.2618)',
      input: 'oklch(0.6537 0.0197 205.2618)',
      ring: 'oklch(0.5924 0.2025 355.8943)',
    },
    chart: {
      'chart-1': 'oklch(0.6149 0.1394 244.9273)',
      'chart-2': 'oklch(0.6437 0.1019 187.384)',
      'chart-3': 'oklch(0.5924 0.2025 355.8943)',
      'chart-4': 'oklch(0.5808 0.1732 39.5003)',
      'chart-5': 'oklch(0.5863 0.2064 27.1172)',
    },
    sidebar: {
      sidebar: 'oklch(0.9735 0.0261 90.0953)',
      'sidebar-foreground': 'oklch(0.3092 0.0518 219.6516)',
      'sidebar-primary': 'oklch(0.5924 0.2025 355.8943)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.6437 0.1019 187.384)',
      'sidebar-accent-foreground': 'oklch(1 0 0)',
      'sidebar-border': 'oklch(0.6537 0.0197 205.2618)',
      'sidebar-ring': 'oklch(0.5924 0.2025 355.8943)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.5924 0.2025 355.8943)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.6437 0.1019 187.384)',
      'secondary-foreground': 'oklch(1 0 0)',
    },
    accent: {
      accent: 'oklch(0.5808 0.1732 39.5003)',
      'accent-foreground': 'oklch(1 0 0)',
    },
    base: {
      background: 'oklch(0.2673 0.0486 219.8169)',
      foreground: 'oklch(0.6979 0.0159 196.794)',
    },
    card: {
      card: 'oklch(0.3092 0.0518 219.6516)',
      'card-foreground': 'oklch(0.6979 0.0159 196.794)',
    },
    popover: {
      popover: 'oklch(0.3092 0.0518 219.6516)',
      'popover-foreground': 'oklch(0.6979 0.0159 196.794)',
    },
    muted: {
      muted: 'oklch(0.523 0.0283 219.1365)',
      'muted-foreground': 'oklch(0.6979 0.0159 196.794)',
    },
    destructive: {
      destructive: 'oklch(0.5863 0.2064 27.1172)',
    },
    'border-input': {
      border: 'oklch(0.523 0.0283 219.1365)',
      input: 'oklch(0.523 0.0283 219.1365)',
      ring: 'oklch(0.5924 0.2025 355.8943)',
    },
    chart: {
      'chart-1': 'oklch(0.6149 0.1394 244.9273)',
      'chart-2': 'oklch(0.6437 0.1019 187.384)',
      'chart-3': 'oklch(0.5924 0.2025 355.8943)',
      'chart-4': 'oklch(0.5808 0.1732 39.5003)',
      'chart-5': 'oklch(0.5863 0.2064 27.1172)',
    },
    sidebar: {
      sidebar: 'oklch(0.2673 0.0486 219.8169)',
      'sidebar-foreground': 'oklch(0.6979 0.0159 196.794)',
      'sidebar-primary': 'oklch(0.5924 0.2025 355.8943)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.6437 0.1019 187.384)',
      'sidebar-accent-foreground': 'oklch(1 0 0)',
      'sidebar-border': 'oklch(0.523 0.0283 219.1365)',
      'sidebar-ring': 'oklch(0.5924 0.2025 355.8943)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
