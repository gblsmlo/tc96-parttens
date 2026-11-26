import type { ThemePreset } from '../schema/theme'

export const mochaMousse = {
  name: 'mocha-mousse',
  title: 'Mocha Mousse',
  source: 'tweakcn',
  fonts: ['DM Sans'],
  typography: {
    'font-sans':
      '"DM Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif': 'Georgia, ui-serif, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      'Menlo, ui-monospace, SFMono-Regular, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.5rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.6083 0.0623 44.3588)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.7473 0.0387 80.5476)',
      'secondary-foreground': 'oklch(1 0 0)',
    },
    accent: {
      accent: 'oklch(0.8502 0.0389 49.0874)',
      'accent-foreground': 'oklch(0.4063 0.0255 40.3627)',
    },
    base: {
      background: 'oklch(0.9529 0.0146 102.4597)',
      foreground: 'oklch(0.4063 0.0255 40.3627)',
    },
    card: {
      card: 'oklch(0.9529 0.0146 102.4597)',
      'card-foreground': 'oklch(0.4063 0.0255 40.3627)',
    },
    popover: {
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.4063 0.0255 40.3627)',
    },
    muted: {
      muted: 'oklch(0.8502 0.0389 49.0874)',
      'muted-foreground': 'oklch(0.5416 0.0512 37.2132)',
    },
    destructive: {
      destructive: 'oklch(0.2225 0.0098 52.9636)',
    },
    'border-input': {
      border: 'oklch(0.7473 0.0387 80.5476)',
      input: 'oklch(0.7473 0.0387 80.5476)',
      ring: 'oklch(0.6083 0.0623 44.3588)',
    },
    chart: {
      'chart-1': 'oklch(0.6083 0.0623 44.3588)',
      'chart-2': 'oklch(0.5416 0.0512 37.2132)',
      'chart-3': 'oklch(0.7272 0.0539 52.332)',
      'chart-4': 'oklch(0.7473 0.0387 80.5476)',
      'chart-5': 'oklch(0.644 0.0405 52.3917)',
    },
    sidebar: {
      sidebar: 'oklch(0.8903 0.0278 49.5658)',
      'sidebar-foreground': 'oklch(0.4063 0.0255 40.3627)',
      'sidebar-primary': 'oklch(0.6083 0.0623 44.3588)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.7272 0.0539 52.332)',
      'sidebar-accent-foreground': 'oklch(1 0 0)',
      'sidebar-border': 'oklch(0.644 0.0405 52.3917)',
      'sidebar-ring': 'oklch(0.6083 0.0623 44.3588)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.7272 0.0539 52.332)',
      'primary-foreground': 'oklch(0.2721 0.0141 48.1783)',
    },
    secondary: {
      secondary: 'oklch(0.5416 0.0512 37.2132)',
      'secondary-foreground': 'oklch(0.9529 0.0146 102.4597)',
    },
    accent: {
      accent: 'oklch(0.7473 0.0387 80.5476)',
      'accent-foreground': 'oklch(0.2721 0.0141 48.1783)',
    },
    base: {
      background: 'oklch(0.2721 0.0141 48.1783)',
      foreground: 'oklch(0.9529 0.0146 102.4597)',
    },
    card: {
      card: 'oklch(0.3291 0.0156 50.8936)',
      'card-foreground': 'oklch(0.9529 0.0146 102.4597)',
    },
    popover: {
      popover: 'oklch(0.3291 0.0156 50.8936)',
      'popover-foreground': 'oklch(0.9529 0.0146 102.4597)',
    },
    muted: {
      muted: 'oklch(0.4063 0.0255 40.3627)',
      'muted-foreground': 'oklch(0.7575 0.038 50.861)',
    },
    destructive: {
      destructive: 'oklch(0.6875 0.142 21.4566)',
    },
    'border-input': {
      border: 'oklch(0.4063 0.0255 40.3627)',
      input: 'oklch(0.4063 0.0255 40.3627)',
      ring: 'oklch(0.7272 0.0539 52.332)',
    },
    chart: {
      'chart-1': 'oklch(0.7272 0.0539 52.332)',
      'chart-2': 'oklch(0.7473 0.0387 80.5476)',
      'chart-3': 'oklch(0.6083 0.0623 44.3588)',
      'chart-4': 'oklch(0.5416 0.0512 37.2132)',
      'chart-5': 'oklch(0.644 0.0405 52.3917)',
    },
    sidebar: {
      sidebar: 'oklch(0.2225 0.0098 52.9636)',
      'sidebar-foreground': 'oklch(0.9529 0.0146 102.4597)',
      'sidebar-primary': 'oklch(0.7272 0.0539 52.332)',
      'sidebar-primary-foreground': 'oklch(0.2225 0.0098 52.9636)',
      'sidebar-accent': 'oklch(0.7473 0.0387 80.5476)',
      'sidebar-accent-foreground': 'oklch(0.2225 0.0098 52.9636)',
      'sidebar-border': 'oklch(0.4063 0.0255 40.3627)',
      'sidebar-ring': 'oklch(0.7272 0.0539 52.332)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
