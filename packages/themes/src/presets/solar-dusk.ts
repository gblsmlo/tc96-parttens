import type { ThemePreset } from '../schema/theme'

export const solarDusk = {
  name: 'solar-dusk',
  title: 'Solar Dusk',
  source: 'tweakcn',
  fonts: ['Oxanium', 'Merriweather', 'Fira Code'],
  typography: {
    'font-sans':
      'Oxanium, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif':
      'Merriweather, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.3rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.5553 0.1455 48.9975)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.8276 0.0752 74.44)',
      'secondary-foreground': 'oklch(0.4444 0.0096 73.639)',
    },
    accent: {
      accent: 'oklch(0.9 0.05 74.9889)',
      'accent-foreground': 'oklch(0.4444 0.0096 73.639)',
    },
    base: {
      background: 'oklch(0.9885 0.0057 84.5659)',
      foreground: 'oklch(0.366 0.0251 49.6085)',
    },
    card: {
      card: 'oklch(0.9686 0.0091 78.2818)',
      'card-foreground': 'oklch(0.366 0.0251 49.6085)',
    },
    popover: {
      popover: 'oklch(0.9686 0.0091 78.2818)',
      'popover-foreground': 'oklch(0.366 0.0251 49.6085)',
    },
    muted: {
      muted: 'oklch(0.9363 0.0218 83.2637)',
      'muted-foreground': 'oklch(0.5534 0.0116 58.0708)',
    },
    destructive: {
      destructive: 'oklch(0.4437 0.1613 26.8994)',
    },
    'border-input': {
      border: 'oklch(0.8866 0.0404 89.6994)',
      input: 'oklch(0.8866 0.0404 89.6994)',
      ring: 'oklch(0.5553 0.1455 48.9975)',
    },
    chart: {
      'chart-1': 'oklch(0.5553 0.1455 48.9975)',
      'chart-2': 'oklch(0.5534 0.0116 58.0708)',
      'chart-3': 'oklch(0.5538 0.1207 66.4416)',
      'chart-4': 'oklch(0.5534 0.0116 58.0708)',
      'chart-5': 'oklch(0.6806 0.1423 75.834)',
    },
    sidebar: {
      sidebar: 'oklch(0.9363 0.0218 83.2637)',
      'sidebar-foreground': 'oklch(0.366 0.0251 49.6085)',
      'sidebar-primary': 'oklch(0.5553 0.1455 48.9975)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.5538 0.1207 66.4416)',
      'sidebar-accent-foreground': 'oklch(1 0 0)',
      'sidebar-border': 'oklch(0.8866 0.0404 89.6994)',
      'sidebar-ring': 'oklch(0.5553 0.1455 48.9975)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.7049 0.1867 47.6044)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.4444 0.0096 73.639)',
      'secondary-foreground': 'oklch(0.9232 0.0026 48.7171)',
    },
    accent: {
      accent: 'oklch(0.3598 0.0497 229.3202)',
      'accent-foreground': 'oklch(0.9232 0.0026 48.7171)',
    },
    base: {
      background: 'oklch(0.2161 0.0061 56.0434)',
      foreground: 'oklch(0.9699 0.0013 106.4238)',
    },
    card: {
      card: 'oklch(0.2685 0.0063 34.2976)',
      'card-foreground': 'oklch(0.9699 0.0013 106.4238)',
    },
    popover: {
      popover: 'oklch(0.2685 0.0063 34.2976)',
      'popover-foreground': 'oklch(0.9699 0.0013 106.4238)',
    },
    muted: {
      muted: 'oklch(0.233 0.0073 67.4563)',
      'muted-foreground': 'oklch(0.7161 0.0091 56.259)',
    },
    destructive: {
      destructive: 'oklch(0.5771 0.2152 27.325)',
    },
    'border-input': {
      border: 'oklch(0.3741 0.0087 67.5582)',
      input: 'oklch(0.3741 0.0087 67.5582)',
      ring: 'oklch(0.7049 0.1867 47.6044)',
    },
    chart: {
      'chart-1': 'oklch(0.7049 0.1867 47.6044)',
      'chart-2': 'oklch(0.6847 0.1479 237.3225)',
      'chart-3': 'oklch(0.7952 0.1617 86.0468)',
      'chart-4': 'oklch(0.7161 0.0091 56.259)',
      'chart-5': 'oklch(0.5534 0.0116 58.0708)',
    },
    sidebar: {
      sidebar: 'oklch(0.2685 0.0063 34.2976)',
      'sidebar-foreground': 'oklch(0.9699 0.0013 106.4238)',
      'sidebar-primary': 'oklch(0.7049 0.1867 47.6044)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.6847 0.1479 237.3225)',
      'sidebar-accent-foreground': 'oklch(0.2839 0.0734 254.5378)',
      'sidebar-border': 'oklch(0.3741 0.0087 67.5582)',
      'sidebar-ring': 'oklch(0.7049 0.1867 47.6044)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
