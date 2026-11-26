import type { ThemePreset } from '../schema/theme'

export const claymorphism = {
  name: 'claymorphism',
  title: 'Claymorphism',
  source: 'tweakcn',
  fonts: ['Plus Jakarta Sans', 'Lora', 'Roboto Mono'],
  typography: {
    'font-sans':
      '"Plus Jakarta Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif':
      'Lora, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"Roboto Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '1.25rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.5854 0.2041 277.1173)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.8687 0.0043 56.366)',
      'secondary-foreground': 'oklch(0.4461 0.0263 256.8018)',
    },
    accent: {
      accent: 'oklch(0.9376 0.026 321.9388)',
      'accent-foreground': 'oklch(0.3729 0.0306 259.7328)',
    },
    base: {
      background: 'oklch(0.9232 0.0026 48.7171)',
      foreground: 'oklch(0.2795 0.0368 260.031)',
    },
    card: {
      card: 'oklch(0.9699 0.0013 106.4238)',
      'card-foreground': 'oklch(0.2795 0.0368 260.031)',
    },
    popover: {
      popover: 'oklch(0.9699 0.0013 106.4238)',
      'popover-foreground': 'oklch(0.2795 0.0368 260.031)',
    },
    muted: {
      muted: 'oklch(0.9232 0.0026 48.7171)',
      'muted-foreground': 'oklch(0.551 0.0234 264.3637)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.8687 0.0043 56.366)',
      input: 'oklch(0.8687 0.0043 56.366)',
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
      sidebar: 'oklch(0.8687 0.0043 56.366)',
      'sidebar-foreground': 'oklch(0.2795 0.0368 260.031)',
      'sidebar-primary': 'oklch(0.5854 0.2041 277.1173)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.9376 0.026 321.9388)',
      'sidebar-accent-foreground': 'oklch(0.3729 0.0306 259.7328)',
      'sidebar-border': 'oklch(0.8687 0.0043 56.366)',
      'sidebar-ring': 'oklch(0.5854 0.2041 277.1173)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.6801 0.1583 276.9349)',
      'primary-foreground': 'oklch(0.2244 0.0074 67.437)',
    },
    secondary: {
      secondary: 'oklch(0.3359 0.0077 59.4197)',
      'secondary-foreground': 'oklch(0.8717 0.0093 258.3382)',
    },
    accent: {
      accent: 'oklch(0.3896 0.0074 59.4734)',
      'accent-foreground': 'oklch(0.8717 0.0093 258.3382)',
    },
    base: {
      background: 'oklch(0.2244 0.0074 67.437)',
      foreground: 'oklch(0.9288 0.0126 255.5078)',
    },
    card: {
      card: 'oklch(0.2801 0.008 59.3379)',
      'card-foreground': 'oklch(0.9288 0.0126 255.5078)',
    },
    popover: {
      popover: 'oklch(0.2801 0.008 59.3379)',
      'popover-foreground': 'oklch(0.9288 0.0126 255.5078)',
    },
    muted: {
      muted: 'oklch(0.2287 0.0074 67.4469)',
      'muted-foreground': 'oklch(0.7137 0.0192 261.3246)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.3359 0.0077 59.4197)',
      input: 'oklch(0.3359 0.0077 59.4197)',
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
      sidebar: 'oklch(0.3359 0.0077 59.4197)',
      'sidebar-foreground': 'oklch(0.9288 0.0126 255.5078)',
      'sidebar-primary': 'oklch(0.6801 0.1583 276.9349)',
      'sidebar-primary-foreground': 'oklch(0.2244 0.0074 67.437)',
      'sidebar-accent': 'oklch(0.3896 0.0074 59.4734)',
      'sidebar-accent-foreground': 'oklch(0.8717 0.0093 258.3382)',
      'sidebar-border': 'oklch(0.3359 0.0077 59.4197)',
      'sidebar-ring': 'oklch(0.6801 0.1583 276.9349)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
