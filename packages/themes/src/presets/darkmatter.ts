import type { ThemePreset } from '../schema/theme'

export const darkmatter = {
  name: 'darkmatter',
  title: 'Darkmatter',
  source: 'tweakcn',
  fonts: ['Geist Mono', 'JetBrains Mono'],
  typography: {
    'font-sans':
      '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    'font-mono':
      '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.75rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.6716 0.1368 48.513)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.536 0.0398 196.028)',
      'secondary-foreground': 'oklch(1 0 0)',
    },
    accent: {
      accent: 'oklch(0.9491 0 0)',
      'accent-foreground': 'oklch(0.2101 0.0318 264.6645)',
    },
    base: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.2101 0.0318 264.6645)',
    },
    card: {
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.2101 0.0318 264.6645)',
    },
    popover: {
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.2101 0.0318 264.6645)',
    },
    muted: {
      muted: 'oklch(0.967 0.0029 264.5419)',
      'muted-foreground': 'oklch(0.551 0.0234 264.3637)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.9276 0.0058 264.5313)',
      input: 'oklch(0.9276 0.0058 264.5313)',
      ring: 'oklch(0.6716 0.1368 48.513)',
    },
    chart: {
      'chart-1': 'oklch(0.594 0.0443 196.0233)',
      'chart-2': 'oklch(0.7214 0.1337 49.9802)',
      'chart-3': 'oklch(0.8721 0.0864 68.5474)',
      'chart-4': 'oklch(0.6268 0 0)',
      'chart-5': 'oklch(0.683 0 0)',
    },
    sidebar: {
      sidebar: 'oklch(0.967 0.0029 264.5419)',
      'sidebar-foreground': 'oklch(0.2101 0.0318 264.6645)',
      'sidebar-primary': 'oklch(0.6716 0.1368 48.513)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(1 0 0)',
      'sidebar-accent-foreground': 'oklch(0.2101 0.0318 264.6645)',
      'sidebar-border': 'oklch(0.9276 0.0058 264.5313)',
      'sidebar-ring': 'oklch(0.6716 0.1368 48.513)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.7214 0.1337 49.9802)',
      'primary-foreground': 'oklch(0.1797 0.0043 308.1928)',
    },
    secondary: {
      secondary: 'oklch(0.594 0.0443 196.0233)',
      'secondary-foreground': 'oklch(0.1797 0.0043 308.1928)',
    },
    accent: {
      accent: 'oklch(0.3211 0 0)',
      'accent-foreground': 'oklch(0.8109 0 0)',
    },
    base: {
      background: 'oklch(0.1797 0.0043 308.1928)',
      foreground: 'oklch(0.8109 0 0)',
    },
    card: {
      card: 'oklch(0.1822 0 0)',
      'card-foreground': 'oklch(0.8109 0 0)',
    },
    popover: {
      popover: 'oklch(0.1797 0.0043 308.1928)',
      'popover-foreground': 'oklch(0.8109 0 0)',
    },
    muted: {
      muted: 'oklch(0.252 0 0)',
      'muted-foreground': 'oklch(0.6268 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.594 0.0443 196.0233)',
    },
    'border-input': {
      border: 'oklch(0.252 0 0)',
      input: 'oklch(0.252 0 0)',
      ring: 'oklch(0.7214 0.1337 49.9802)',
    },
    chart: {
      'chart-1': 'oklch(0.594 0.0443 196.0233)',
      'chart-2': 'oklch(0.7214 0.1337 49.9802)',
      'chart-3': 'oklch(0.8721 0.0864 68.5474)',
      'chart-4': 'oklch(0.6268 0 0)',
      'chart-5': 'oklch(0.683 0 0)',
    },
    sidebar: {
      sidebar: 'oklch(0.1822 0 0)',
      'sidebar-foreground': 'oklch(0.8109 0 0)',
      'sidebar-primary': 'oklch(0.7214 0.1337 49.9802)',
      'sidebar-primary-foreground': 'oklch(0.1797 0.0043 308.1928)',
      'sidebar-accent': 'oklch(0.3211 0 0)',
      'sidebar-accent-foreground': 'oklch(0.8109 0 0)',
      'sidebar-border': 'oklch(0.252 0 0)',
      'sidebar-ring': 'oklch(0.7214 0.1337 49.9802)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
