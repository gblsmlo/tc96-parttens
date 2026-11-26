import type { ThemePreset } from '../schema/theme'

export const northernLights = {
  name: 'northern-lights',
  title: 'Northern Lights',
  source: 'tweakcn',
  fonts: ['Plus Jakarta Sans', 'Source Serif 4', 'JetBrains Mono'],
  typography: {
    'font-sans':
      '"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif':
      '"Source Serif 4", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.5rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.6487 0.1538 150.3071)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.6746 0.1414 261.338)',
      'secondary-foreground': 'oklch(1 0 0)',
    },
    accent: {
      accent: 'oklch(0.8269 0.108 211.9627)',
      'accent-foreground': 'oklch(0.3211 0 0)',
    },
    base: {
      background: 'oklch(0.9824 0.0013 286.3757)',
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
      ring: 'oklch(0.6487 0.1538 150.3071)',
    },
    chart: {
      'chart-1': 'oklch(0.6487 0.1538 150.3071)',
      'chart-2': 'oklch(0.6746 0.1414 261.338)',
      'chart-3': 'oklch(0.8269 0.108 211.9627)',
      'chart-4': 'oklch(0.588 0.0993 245.7394)',
      'chart-5': 'oklch(0.5905 0.1608 148.2409)',
    },
    sidebar: {
      sidebar: 'oklch(0.9824 0.0013 286.3757)',
      'sidebar-foreground': 'oklch(0.3211 0 0)',
      'sidebar-primary': 'oklch(0.6487 0.1538 150.3071)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.8269 0.108 211.9627)',
      'sidebar-accent-foreground': 'oklch(0.3211 0 0)',
      'sidebar-border': 'oklch(0.8699 0 0)',
      'sidebar-ring': 'oklch(0.6487 0.1538 150.3071)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.6487 0.1538 150.3071)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.588 0.0993 245.7394)',
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
      ring: 'oklch(0.6487 0.1538 150.3071)',
    },
    chart: {
      'chart-1': 'oklch(0.6487 0.1538 150.3071)',
      'chart-2': 'oklch(0.588 0.0993 245.7394)',
      'chart-3': 'oklch(0.6746 0.1414 261.338)',
      'chart-4': 'oklch(0.8269 0.108 211.9627)',
      'chart-5': 'oklch(0.5905 0.1608 148.2409)',
    },
    sidebar: {
      sidebar: 'oklch(0.2303 0.0125 264.2926)',
      'sidebar-foreground': 'oklch(0.9219 0 0)',
      'sidebar-primary': 'oklch(0.6487 0.1538 150.3071)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.6746 0.1414 261.338)',
      'sidebar-accent-foreground': 'oklch(0.9219 0 0)',
      'sidebar-border': 'oklch(0.3867 0 0)',
      'sidebar-ring': 'oklch(0.6487 0.1538 150.3071)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
