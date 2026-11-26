import type { ThemePreset } from '../schema/theme'

export const oceanBreeze = {
  name: 'ocean-breeze',
  title: 'Ocean Breeze',
  source: 'tweakcn',
  fonts: ['DM Sans', 'Lora', 'IBM Plex Mono'],
  typography: {
    'font-sans':
      '"DM Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif':
      'Lora, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.5rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.7227 0.192 149.5793)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.9514 0.025 236.8242)',
      'secondary-foreground': 'oklch(0.4461 0.0263 256.8018)',
    },
    accent: {
      accent: 'oklch(0.9505 0.0507 163.0508)',
      'accent-foreground': 'oklch(0.3729 0.0306 259.7328)',
    },
    base: {
      background: 'oklch(0.9751 0.0127 244.2507)',
      foreground: 'oklch(0.3729 0.0306 259.7328)',
    },
    card: {
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.3729 0.0306 259.7328)',
    },
    popover: {
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.3729 0.0306 259.7328)',
    },
    muted: {
      muted: 'oklch(0.967 0.0029 264.5419)',
      'muted-foreground': 'oklch(0.551 0.0234 264.3637)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.9276 0.0058 264.5313)',
      input: 'oklch(0.9276 0.0058 264.5313)',
      ring: 'oklch(0.7227 0.192 149.5793)',
    },
    chart: {
      'chart-1': 'oklch(0.7227 0.192 149.5793)',
      'chart-2': 'oklch(0.6959 0.1491 162.4796)',
      'chart-3': 'oklch(0.596 0.1274 163.2254)',
      'chart-4': 'oklch(0.5081 0.1049 165.6121)',
      'chart-5': 'oklch(0.4318 0.0865 166.9128)',
    },
    sidebar: {
      sidebar: 'oklch(0.9514 0.025 236.8242)',
      'sidebar-foreground': 'oklch(0.3729 0.0306 259.7328)',
      'sidebar-primary': 'oklch(0.7227 0.192 149.5793)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.9505 0.0507 163.0508)',
      'sidebar-accent-foreground': 'oklch(0.3729 0.0306 259.7328)',
      'sidebar-border': 'oklch(0.9276 0.0058 264.5313)',
      'sidebar-ring': 'oklch(0.7227 0.192 149.5793)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.7729 0.1535 163.2231)',
      'primary-foreground': 'oklch(0.2077 0.0398 265.7549)',
    },
    secondary: {
      secondary: 'oklch(0.3351 0.0331 260.912)',
      'secondary-foreground': 'oklch(0.7118 0.0129 286.0665)',
    },
    accent: {
      accent: 'oklch(0.3729 0.0306 259.7328)',
      'accent-foreground': 'oklch(0.7118 0.0129 286.0665)',
    },
    base: {
      background: 'oklch(0.2077 0.0398 265.7549)',
      foreground: 'oklch(0.8717 0.0093 258.3382)',
    },
    card: {
      card: 'oklch(0.2795 0.0368 260.031)',
      'card-foreground': 'oklch(0.8717 0.0093 258.3382)',
    },
    popover: {
      popover: 'oklch(0.2795 0.0368 260.031)',
      'popover-foreground': 'oklch(0.8717 0.0093 258.3382)',
    },
    muted: {
      muted: 'oklch(0.2463 0.0275 259.9628)',
      'muted-foreground': 'oklch(0.551 0.0234 264.3637)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.4461 0.0263 256.8018)',
      input: 'oklch(0.4461 0.0263 256.8018)',
      ring: 'oklch(0.7729 0.1535 163.2231)',
    },
    chart: {
      'chart-1': 'oklch(0.7729 0.1535 163.2231)',
      'chart-2': 'oklch(0.7845 0.1325 181.912)',
      'chart-3': 'oklch(0.7227 0.192 149.5793)',
      'chart-4': 'oklch(0.6959 0.1491 162.4796)',
      'chart-5': 'oklch(0.596 0.1274 163.2254)',
    },
    sidebar: {
      sidebar: 'oklch(0.2795 0.0368 260.031)',
      'sidebar-foreground': 'oklch(0.8717 0.0093 258.3382)',
      'sidebar-primary': 'oklch(0.7729 0.1535 163.2231)',
      'sidebar-primary-foreground': 'oklch(0.2077 0.0398 265.7549)',
      'sidebar-accent': 'oklch(0.3729 0.0306 259.7328)',
      'sidebar-accent-foreground': 'oklch(0.7118 0.0129 286.0665)',
      'sidebar-border': 'oklch(0.4461 0.0263 256.8018)',
      'sidebar-ring': 'oklch(0.7729 0.1535 163.2231)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
