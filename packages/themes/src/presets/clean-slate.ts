import type { ThemePreset } from '../schema/theme'

export const cleanSlate = {
  name: 'clean-slate',
  title: 'Clean Slate',
  source: 'tweakcn',
  fonts: ['Inter', 'Merriweather', 'JetBrains Mono'],
  typography: {
    'font-sans':
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif':
      'Merriweather, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.5rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.5854 0.2041 277.1173)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.9276 0.0058 264.5313)',
      'secondary-foreground': 'oklch(0.3729 0.0306 259.7328)',
    },
    accent: {
      accent: 'oklch(0.9299 0.0334 272.7879)',
      'accent-foreground': 'oklch(0.3729 0.0306 259.7328)',
    },
    base: {
      background: 'oklch(0.9842 0.0034 247.8575)',
      foreground: 'oklch(0.2795 0.0368 260.031)',
    },
    card: {
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.2795 0.0368 260.031)',
    },
    popover: {
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.2795 0.0368 260.031)',
    },
    muted: {
      muted: 'oklch(0.967 0.0029 264.5419)',
      'muted-foreground': 'oklch(0.551 0.0234 264.3637)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.8717 0.0093 258.3382)',
      input: 'oklch(0.8717 0.0093 258.3382)',
      ring: 'oklch(0.5854 0.2041 277.1173)',
    },
    chart: {
      'chart-1': 'oklch(0.5854 0.2041 277.1173)',
      'chart-2': 'oklch(0.5106 0.2301 276.9656)',
      'chart-3': 'oklch(0.4568 0.2146 277.0229)',
      'chart-4': 'oklch(0.3984 0.1773 277.3662)',
      'chart-5': 'oklch(0.3588 0.1354 278.6973)',
    },
    sidebar: {
      sidebar: 'oklch(0.967 0.0029 264.5419)',
      'sidebar-foreground': 'oklch(0.2795 0.0368 260.031)',
      'sidebar-primary': 'oklch(0.5854 0.2041 277.1173)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.9299 0.0334 272.7879)',
      'sidebar-accent-foreground': 'oklch(0.3729 0.0306 259.7328)',
      'sidebar-border': 'oklch(0.8717 0.0093 258.3382)',
      'sidebar-ring': 'oklch(0.5854 0.2041 277.1173)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.6801 0.1583 276.9349)',
      'primary-foreground': 'oklch(0.2077 0.0398 265.7549)',
    },
    secondary: {
      secondary: 'oklch(0.3351 0.0331 260.912)',
      'secondary-foreground': 'oklch(0.8717 0.0093 258.3382)',
    },
    accent: {
      accent: 'oklch(0.3729 0.0306 259.7328)',
      'accent-foreground': 'oklch(0.8717 0.0093 258.3382)',
    },
    base: {
      background: 'oklch(0.2077 0.0398 265.7549)',
      foreground: 'oklch(0.9288 0.0126 255.5078)',
    },
    card: {
      card: 'oklch(0.2795 0.0368 260.031)',
      'card-foreground': 'oklch(0.9288 0.0126 255.5078)',
    },
    popover: {
      popover: 'oklch(0.2795 0.0368 260.031)',
      'popover-foreground': 'oklch(0.9288 0.0126 255.5078)',
    },
    muted: {
      muted: 'oklch(0.2427 0.0381 259.9437)',
      'muted-foreground': 'oklch(0.7137 0.0192 261.3246)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.4461 0.0263 256.8018)',
      input: 'oklch(0.4461 0.0263 256.8018)',
      ring: 'oklch(0.6801 0.1583 276.9349)',
    },
    chart: {
      'chart-1': 'oklch(0.6801 0.1583 276.9349)',
      'chart-2': 'oklch(0.5854 0.2041 277.1173)',
      'chart-3': 'oklch(0.5106 0.2301 276.9656)',
      'chart-4': 'oklch(0.4568 0.2146 277.0229)',
      'chart-5': 'oklch(0.3984 0.1773 277.3662)',
    },
    sidebar: {
      sidebar: 'oklch(0.2795 0.0368 260.031)',
      'sidebar-foreground': 'oklch(0.9288 0.0126 255.5078)',
      'sidebar-primary': 'oklch(0.6801 0.1583 276.9349)',
      'sidebar-primary-foreground': 'oklch(0.2077 0.0398 265.7549)',
      'sidebar-accent': 'oklch(0.3729 0.0306 259.7328)',
      'sidebar-accent-foreground': 'oklch(0.8717 0.0093 258.3382)',
      'sidebar-border': 'oklch(0.4461 0.0263 256.8018)',
      'sidebar-ring': 'oklch(0.6801 0.1583 276.9349)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
