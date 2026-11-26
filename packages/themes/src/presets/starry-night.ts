import type { ThemePreset } from '../schema/theme'

export const starryNight = {
  name: 'starry-night',
  title: 'Starry Night',
  source: 'tweakcn',
  fonts: ['Libre Baskerville'],
  typography: {
    'font-sans':
      '"Libre Baskerville", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  other: {
    radius: '0.5rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.4815 0.1178 263.3758)',
      'primary-foreground': 'oklch(0.9856 0.0278 98.054)',
    },
    secondary: {
      secondary: 'oklch(0.8567 0.1164 81.0092)',
      'secondary-foreground': 'oklch(0.2558 0.0433 268.0662)',
    },
    accent: {
      accent: 'oklch(0.6896 0.0714 234.0387)',
      'accent-foreground': 'oklch(0.9856 0.0278 98.054)',
    },
    base: {
      background: 'oklch(0.9755 0.0045 258.3245)',
      foreground: 'oklch(0.2558 0.0433 268.0662)',
    },
    card: {
      card: 'oklch(0.9341 0.0132 251.5628)',
      'card-foreground': 'oklch(0.2558 0.0433 268.0662)',
    },
    popover: {
      popover: 'oklch(0.9856 0.0278 98.054)',
      'popover-foreground': 'oklch(0.2558 0.0433 268.0662)',
    },
    muted: {
      muted: 'oklch(0.9202 0.008 106.5563)',
      'muted-foreground': 'oklch(0.4815 0.1178 263.3758)',
    },
    destructive: {
      destructive: 'oklch(0.2611 0.0376 322.5267)',
    },
    'border-input': {
      border: 'oklch(0.7791 0.0156 251.1926)',
      input: 'oklch(0.6896 0.0714 234.0387)',
      ring: 'oklch(0.8567 0.1164 81.0092)',
    },
    chart: {
      'chart-1': 'oklch(0.4815 0.1178 263.3758)',
      'chart-2': 'oklch(0.8567 0.1164 81.0092)',
      'chart-3': 'oklch(0.6896 0.0714 234.0387)',
      'chart-4': 'oklch(0.7791 0.0156 251.1926)',
      'chart-5': 'oklch(0.2611 0.0376 322.5267)',
    },
    sidebar: {
      sidebar: 'oklch(0.9341 0.0132 251.5628)',
      'sidebar-foreground': 'oklch(0.2558 0.0433 268.0662)',
      'sidebar-primary': 'oklch(0.4815 0.1178 263.3758)',
      'sidebar-primary-foreground': 'oklch(0.9856 0.0278 98.054)',
      'sidebar-accent': 'oklch(0.8567 0.1164 81.0092)',
      'sidebar-accent-foreground': 'oklch(0.2558 0.0433 268.0662)',
      'sidebar-border': 'oklch(0.7791 0.0156 251.1926)',
      'sidebar-ring': 'oklch(0.8567 0.1164 81.0092)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.4815 0.1178 263.3758)',
      'primary-foreground': 'oklch(0.9097 0.144 95.112)',
    },
    secondary: {
      secondary: 'oklch(0.9097 0.144 95.112)',
      'secondary-foreground': 'oklch(0.2703 0.0407 281.3036)',
    },
    accent: {
      accent: 'oklch(0.8469 0.0524 264.7751)',
      'accent-foreground': 'oklch(0.2204 0.0198 275.8439)',
    },
    base: {
      background: 'oklch(0.2204 0.0198 275.8439)',
      foreground: 'oklch(0.9366 0.0129 266.6974)',
    },
    card: {
      card: 'oklch(0.2703 0.0407 281.3036)',
      'card-foreground': 'oklch(0.9366 0.0129 266.6974)',
    },
    popover: {
      popover: 'oklch(0.2703 0.0407 281.3036)',
      'popover-foreground': 'oklch(0.9097 0.144 95.112)',
    },
    muted: {
      muted: 'oklch(0.2424 0.0324 281.089)',
      'muted-foreground': 'oklch(0.6243 0.0412 262.0375)',
    },
    destructive: {
      destructive: 'oklch(0.528 0.12 357.113)',
    },
    'border-input': {
      border: 'oklch(0.3072 0.0287 281.7681)',
      input: 'oklch(0.4815 0.1178 263.3758)',
      ring: 'oklch(0.9097 0.144 95.112)',
    },
    chart: {
      'chart-1': 'oklch(0.4815 0.1178 263.3758)',
      'chart-2': 'oklch(0.9097 0.144 95.112)',
      'chart-3': 'oklch(0.6896 0.0714 234.0387)',
      'chart-4': 'oklch(0.6243 0.0412 262.0375)',
      'chart-5': 'oklch(0.528 0.12 357.113)',
    },
    sidebar: {
      sidebar: 'oklch(0.2703 0.0407 281.3036)',
      'sidebar-foreground': 'oklch(0.9366 0.0129 266.6974)',
      'sidebar-primary': 'oklch(0.4815 0.1178 263.3758)',
      'sidebar-primary-foreground': 'oklch(0.9097 0.144 95.112)',
      'sidebar-accent': 'oklch(0.9097 0.144 95.112)',
      'sidebar-accent-foreground': 'oklch(0.2703 0.0407 281.3036)',
      'sidebar-border': 'oklch(0.3072 0.0287 281.7681)',
      'sidebar-ring': 'oklch(0.9097 0.144 95.112)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
