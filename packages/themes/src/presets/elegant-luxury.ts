import type { ThemePreset } from '../schema/theme'

export const elegantLuxury = {
  name: 'elegant-luxury',
  title: 'Elegant Luxury',
  source: 'tweakcn',
  fonts: ['Poppins', 'Libre Baskerville', 'IBM Plex Mono'],
  typography: {
    'font-sans':
      'Poppins, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif':
      '"Libre Baskerville", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.375rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.465 0.147 24.9381)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.9625 0.0385 89.0943)',
      'secondary-foreground': 'oklch(0.4847 0.1022 75.1153)',
    },
    accent: {
      accent: 'oklch(0.9619 0.058 95.6174)',
      'accent-foreground': 'oklch(0.3958 0.1331 25.723)',
    },
    base: {
      background: 'oklch(0.9779 0.0042 56.3756)',
      foreground: 'oklch(0.2178 0 0)',
    },
    card: {
      card: 'oklch(0.9779 0.0042 56.3756)',
      'card-foreground': 'oklch(0.2178 0 0)',
    },
    popover: {
      popover: 'oklch(0.9779 0.0042 56.3756)',
      'popover-foreground': 'oklch(0.2178 0 0)',
    },
    muted: {
      muted: 'oklch(0.9431 0.0068 53.4442)',
      'muted-foreground': 'oklch(0.4444 0.0096 73.639)',
    },
    destructive: {
      destructive: 'oklch(0.4437 0.1613 26.8994)',
    },
    'border-input': {
      border: 'oklch(0.9355 0.0324 80.9937)',
      input: 'oklch(0.9355 0.0324 80.9937)',
      ring: 'oklch(0.465 0.147 24.9381)',
    },
    chart: {
      'chart-1': 'oklch(0.5054 0.1905 27.5181)',
      'chart-2': 'oklch(0.465 0.147 24.9381)',
      'chart-3': 'oklch(0.3958 0.1331 25.723)',
      'chart-4': 'oklch(0.5553 0.1455 48.9975)',
      'chart-5': 'oklch(0.4732 0.1247 46.2007)',
    },
    sidebar: {
      sidebar: 'oklch(0.9431 0.0068 53.4442)',
      'sidebar-foreground': 'oklch(0.2178 0 0)',
      'sidebar-primary': 'oklch(0.465 0.147 24.9381)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.9619 0.058 95.6174)',
      'sidebar-accent-foreground': 'oklch(0.3958 0.1331 25.723)',
      'sidebar-border': 'oklch(0.9355 0.0324 80.9937)',
      'sidebar-ring': 'oklch(0.465 0.147 24.9381)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.5054 0.1905 27.5181)',
      'primary-foreground': 'oklch(0.9779 0.0042 56.3756)',
    },
    secondary: {
      secondary: 'oklch(0.4732 0.1247 46.2007)',
      'secondary-foreground': 'oklch(0.9619 0.058 95.6174)',
    },
    accent: {
      accent: 'oklch(0.5553 0.1455 48.9975)',
      'accent-foreground': 'oklch(0.9619 0.058 95.6174)',
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
      muted: 'oklch(0.2291 0.006 56.0708)',
      'muted-foreground': 'oklch(0.8687 0.0043 56.366)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.3741 0.0087 67.5582)',
      input: 'oklch(0.3741 0.0087 67.5582)',
      ring: 'oklch(0.5054 0.1905 27.5181)',
    },
    chart: {
      'chart-1': 'oklch(0.7106 0.1661 22.2162)',
      'chart-2': 'oklch(0.6368 0.2078 25.3313)',
      'chart-3': 'oklch(0.5771 0.2152 27.325)',
      'chart-4': 'oklch(0.8369 0.1644 84.4286)',
      'chart-5': 'oklch(0.7686 0.1647 70.0804)',
    },
    sidebar: {
      sidebar: 'oklch(0.2161 0.0061 56.0434)',
      'sidebar-foreground': 'oklch(0.9699 0.0013 106.4238)',
      'sidebar-primary': 'oklch(0.5054 0.1905 27.5181)',
      'sidebar-primary-foreground': 'oklch(0.9779 0.0042 56.3756)',
      'sidebar-accent': 'oklch(0.5553 0.1455 48.9975)',
      'sidebar-accent-foreground': 'oklch(0.9619 0.058 95.6174)',
      'sidebar-border': 'oklch(0.3741 0.0087 67.5582)',
      'sidebar-ring': 'oklch(0.5054 0.1905 27.5181)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
