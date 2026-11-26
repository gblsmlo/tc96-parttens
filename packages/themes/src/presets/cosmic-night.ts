import type { ThemePreset } from '../schema/theme'

export const cosmicNight = {
  name: 'cosmic-night',
  title: 'Cosmic Night',
  source: 'tweakcn',
  fonts: ['Inter', 'JetBrains Mono'],
  typography: {
    'font-sans':
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif': 'Georgia, ui-serif, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.5rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.5417 0.179 288.0332)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.9174 0.0435 292.6901)',
      'secondary-foreground': 'oklch(0.4143 0.1039 288.1742)',
    },
    accent: {
      accent: 'oklch(0.9221 0.0373 262.141)',
      'accent-foreground': 'oklch(0.3015 0.0572 282.4176)',
    },
    base: {
      background: 'oklch(0.973 0.0133 286.1503)',
      foreground: 'oklch(0.3015 0.0572 282.4176)',
    },
    card: {
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.3015 0.0572 282.4176)',
    },
    popover: {
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.3015 0.0572 282.4176)',
    },
    muted: {
      muted: 'oklch(0.958 0.0133 286.1454)',
      'muted-foreground': 'oklch(0.5426 0.0465 284.7435)',
    },
    destructive: {
      destructive: 'oklch(0.6861 0.2061 14.9941)',
    },
    'border-input': {
      border: 'oklch(0.9115 0.0216 285.9625)',
      input: 'oklch(0.9115 0.0216 285.9625)',
      ring: 'oklch(0.5417 0.179 288.0332)',
    },
    chart: {
      'chart-1': 'oklch(0.5417 0.179 288.0332)',
      'chart-2': 'oklch(0.7042 0.1602 288.988)',
      'chart-3': 'oklch(0.5679 0.2113 276.7065)',
      'chart-4': 'oklch(0.6356 0.1922 281.8054)',
      'chart-5': 'oklch(0.4509 0.1758 279.3838)',
    },
    sidebar: {
      sidebar: 'oklch(0.958 0.0133 286.1454)',
      'sidebar-foreground': 'oklch(0.3015 0.0572 282.4176)',
      'sidebar-primary': 'oklch(0.5417 0.179 288.0332)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.9221 0.0373 262.141)',
      'sidebar-accent-foreground': 'oklch(0.3015 0.0572 282.4176)',
      'sidebar-border': 'oklch(0.9115 0.0216 285.9625)',
      'sidebar-ring': 'oklch(0.5417 0.179 288.0332)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.7162 0.1597 290.3962)',
      'primary-foreground': 'oklch(0.1743 0.0227 283.7998)',
    },
    secondary: {
      secondary: 'oklch(0.3139 0.0736 283.4591)',
      'secondary-foreground': 'oklch(0.8367 0.0849 285.9111)',
    },
    accent: {
      accent: 'oklch(0.3354 0.0828 280.9705)',
      'accent-foreground': 'oklch(0.9185 0.0257 285.8834)',
    },
    base: {
      background: 'oklch(0.1743 0.0227 283.7998)',
      foreground: 'oklch(0.9185 0.0257 285.8834)',
    },
    card: {
      card: 'oklch(0.2284 0.0384 282.9324)',
      'card-foreground': 'oklch(0.9185 0.0257 285.8834)',
    },
    popover: {
      popover: 'oklch(0.2284 0.0384 282.9324)',
      'popover-foreground': 'oklch(0.9185 0.0257 285.8834)',
    },
    muted: {
      muted: 'oklch(0.271 0.0621 281.4377)',
      'muted-foreground': 'oklch(0.7166 0.0462 285.1741)',
    },
    destructive: {
      destructive: 'oklch(0.6861 0.2061 14.9941)',
    },
    'border-input': {
      border: 'oklch(0.3261 0.0597 282.5832)',
      input: 'oklch(0.3261 0.0597 282.5832)',
      ring: 'oklch(0.7162 0.1597 290.3962)',
    },
    chart: {
      'chart-1': 'oklch(0.7162 0.1597 290.3962)',
      'chart-2': 'oklch(0.6382 0.1047 274.9117)',
      'chart-3': 'oklch(0.7482 0.1235 244.7492)',
      'chart-4': 'oklch(0.7124 0.0977 186.6761)',
      'chart-5': 'oklch(0.7546 0.1831 346.8124)',
    },
    sidebar: {
      sidebar: 'oklch(0.2284 0.0384 282.9324)',
      'sidebar-foreground': 'oklch(0.9185 0.0257 285.8834)',
      'sidebar-primary': 'oklch(0.7162 0.1597 290.3962)',
      'sidebar-primary-foreground': 'oklch(0.1743 0.0227 283.7998)',
      'sidebar-accent': 'oklch(0.3354 0.0828 280.9705)',
      'sidebar-accent-foreground': 'oklch(0.9185 0.0257 285.8834)',
      'sidebar-border': 'oklch(0.3261 0.0597 282.5832)',
      'sidebar-ring': 'oklch(0.7162 0.1597 290.3962)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
