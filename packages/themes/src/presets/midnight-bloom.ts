import type { ThemePreset } from '../schema/theme'

export const midnightBloom = {
  name: 'midnight-bloom',
  title: 'Midnight Bloom',
  source: 'tweakcn',
  fonts: ['Montserrat', 'Playfair Display', 'Source Code Pro'],
  typography: {
    'font-sans':
      'Montserrat, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif':
      '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.5rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.5676 0.2021 283.0838)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.8214 0.072 249.3482)',
      'secondary-foreground': 'oklch(0.3211 0 0)',
    },
    accent: {
      accent: 'oklch(0.6475 0.0642 117.426)',
      'accent-foreground': 'oklch(1 0 0)',
    },
    base: {
      background: 'oklch(0.9821 0 0)',
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
      muted: 'oklch(0.8202 0.0213 91.6163)',
      'muted-foreground': 'oklch(0.5382 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.8699 0 0)',
      input: 'oklch(0.8699 0 0)',
      ring: 'oklch(0.5676 0.2021 283.0838)',
    },
    chart: {
      'chart-1': 'oklch(0.5676 0.2021 283.0838)',
      'chart-2': 'oklch(0.5261 0.1705 314.6534)',
      'chart-3': 'oklch(0.339 0.1793 301.6848)',
      'chart-4': 'oklch(0.6746 0.1414 261.338)',
      'chart-5': 'oklch(0.588 0.0993 245.7394)',
    },
    sidebar: {
      sidebar: 'oklch(0.9821 0 0)',
      'sidebar-foreground': 'oklch(0.3211 0 0)',
      'sidebar-primary': 'oklch(0.5676 0.2021 283.0838)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.6475 0.0642 117.426)',
      'sidebar-accent-foreground': 'oklch(1 0 0)',
      'sidebar-border': 'oklch(0.8699 0 0)',
      'sidebar-ring': 'oklch(0.5676 0.2021 283.0838)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.5676 0.2021 283.0838)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.339 0.1793 301.6848)',
      'secondary-foreground': 'oklch(0.9219 0 0)',
    },
    accent: {
      accent: 'oklch(0.6746 0.1414 261.338)',
      'accent-foreground': 'oklch(0.9219 0 0)',
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
      ring: 'oklch(0.5676 0.2021 283.0838)',
    },
    chart: {
      'chart-1': 'oklch(0.5676 0.2021 283.0838)',
      'chart-2': 'oklch(0.5261 0.1705 314.6534)',
      'chart-3': 'oklch(0.339 0.1793 301.6848)',
      'chart-4': 'oklch(0.6746 0.1414 261.338)',
      'chart-5': 'oklch(0.588 0.0993 245.7394)',
    },
    sidebar: {
      sidebar: 'oklch(0.2303 0.0125 264.2926)',
      'sidebar-foreground': 'oklch(0.9219 0 0)',
      'sidebar-primary': 'oklch(0.5676 0.2021 283.0838)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.6746 0.1414 261.338)',
      'sidebar-accent-foreground': 'oklch(0.9219 0 0)',
      'sidebar-border': 'oklch(0.3867 0 0)',
      'sidebar-ring': 'oklch(0.5676 0.2021 283.0838)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
