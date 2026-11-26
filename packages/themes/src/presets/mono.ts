import type { ThemePreset } from '../schema/theme'

export const mono = {
  name: 'mono',
  title: 'Mono',
  source: 'tweakcn',
  fonts: ['Geist Mono'],
  typography: {
    'font-sans':
      '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    'font-serif':
      '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    'font-mono':
      '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.5555 0 0)',
      'primary-foreground': 'oklch(0.9851 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.9702 0 0)',
      'secondary-foreground': 'oklch(0.2046 0 0)',
    },
    accent: {
      accent: 'oklch(0.9702 0 0)',
      'accent-foreground': 'oklch(0.2046 0 0)',
    },
    base: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.1448 0 0)',
    },
    card: {
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.1448 0 0)',
    },
    popover: {
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.1448 0 0)',
    },
    muted: {
      muted: 'oklch(0.9702 0 0)',
      'muted-foreground': 'oklch(0.5486 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.583 0.2387 28.4765)',
    },
    'border-input': {
      border: 'oklch(0.9219 0 0)',
      input: 'oklch(0.9219 0 0)',
      ring: 'oklch(0.709 0 0)',
    },
    chart: {
      'chart-1': 'oklch(0.5555 0 0)',
      'chart-2': 'oklch(0.5555 0 0)',
      'chart-3': 'oklch(0.5555 0 0)',
      'chart-4': 'oklch(0.5555 0 0)',
      'chart-5': 'oklch(0.5555 0 0)',
    },
    sidebar: {
      sidebar: 'oklch(0.9851 0 0)',
      'sidebar-foreground': 'oklch(0.1448 0 0)',
      'sidebar-primary': 'oklch(0.2046 0 0)',
      'sidebar-primary-foreground': 'oklch(0.9851 0 0)',
      'sidebar-accent': 'oklch(0.9702 0 0)',
      'sidebar-accent-foreground': 'oklch(0.2046 0 0)',
      'sidebar-border': 'oklch(0.9219 0 0)',
      'sidebar-ring': 'oklch(0.709 0 0)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.5555 0 0)',
      'primary-foreground': 'oklch(0.9851 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.2686 0 0)',
      'secondary-foreground': 'oklch(0.9851 0 0)',
    },
    accent: {
      accent: 'oklch(0.3715 0 0)',
      'accent-foreground': 'oklch(0.9851 0 0)',
    },
    base: {
      background: 'oklch(0.1448 0 0)',
      foreground: 'oklch(0.9851 0 0)',
    },
    card: {
      card: 'oklch(0.2134 0 0)',
      'card-foreground': 'oklch(0.9851 0 0)',
    },
    popover: {
      popover: 'oklch(0.2686 0 0)',
      'popover-foreground': 'oklch(0.9851 0 0)',
    },
    muted: {
      muted: 'oklch(0.2686 0 0)',
      'muted-foreground': 'oklch(0.709 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.7022 0.1892 22.2279)',
    },
    'border-input': {
      border: 'oklch(0.3407 0 0)',
      input: 'oklch(0.4386 0 0)',
      ring: 'oklch(0.5555 0 0)',
    },
    chart: {
      'chart-1': 'oklch(0.5555 0 0)',
      'chart-2': 'oklch(0.5555 0 0)',
      'chart-3': 'oklch(0.5555 0 0)',
      'chart-4': 'oklch(0.5555 0 0)',
      'chart-5': 'oklch(0.5555 0 0)',
    },
    sidebar: {
      sidebar: 'oklch(0.2046 0 0)',
      'sidebar-foreground': 'oklch(0.9851 0 0)',
      'sidebar-primary': 'oklch(0.9851 0 0)',
      'sidebar-primary-foreground': 'oklch(0.2046 0 0)',
      'sidebar-accent': 'oklch(0.2686 0 0)',
      'sidebar-accent-foreground': 'oklch(0.9851 0 0)',
      'sidebar-border': 'oklch(1 0 0)',
      'sidebar-ring': 'oklch(0.4386 0 0)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
