import type { ThemePreset } from '../schema/theme'

export const pastelDreams = {
  name: 'pastel-dreams',
  title: 'Pastel Dreams',
  source: 'tweakcn',
  fonts: ['Open Sans', 'Source Serif 4', 'IBM Plex Mono'],
  typography: {
    'font-sans':
      '"Open Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif':
      '"Source Serif 4", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '1.5rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.709 0.1592 293.5412)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.9073 0.053 306.0902)',
      'secondary-foreground': 'oklch(0.4461 0.0263 256.8018)',
    },
    accent: {
      accent: 'oklch(0.9376 0.026 321.9388)',
      'accent-foreground': 'oklch(0.3729 0.0306 259.7328)',
    },
    base: {
      background: 'oklch(0.9689 0.009 314.7819)',
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
      muted: 'oklch(0.9464 0.0327 307.1745)',
      'muted-foreground': 'oklch(0.551 0.0234 264.3637)',
    },
    destructive: {
      destructive: 'oklch(0.8077 0.1035 19.5706)',
    },
    'border-input': {
      border: 'oklch(0.9073 0.053 306.0902)',
      input: 'oklch(0.9073 0.053 306.0902)',
      ring: 'oklch(0.709 0.1592 293.5412)',
    },
    chart: {
      'chart-1': 'oklch(0.709 0.1592 293.5412)',
      'chart-2': 'oklch(0.6056 0.2189 292.7172)',
      'chart-3': 'oklch(0.5413 0.2466 293.009)',
      'chart-4': 'oklch(0.4907 0.2412 292.5809)',
      'chart-5': 'oklch(0.432 0.2106 292.7591)',
    },
    sidebar: {
      sidebar: 'oklch(0.9073 0.053 306.0902)',
      'sidebar-foreground': 'oklch(0.3729 0.0306 259.7328)',
      'sidebar-primary': 'oklch(0.709 0.1592 293.5412)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.9376 0.026 321.9388)',
      'sidebar-accent-foreground': 'oklch(0.3729 0.0306 259.7328)',
      'sidebar-border': 'oklch(0.9073 0.053 306.0902)',
      'sidebar-ring': 'oklch(0.709 0.1592 293.5412)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.7874 0.1179 295.7538)',
      'primary-foreground': 'oklch(0.2161 0.0061 56.0434)',
    },
    secondary: {
      secondary: 'oklch(0.3416 0.0444 308.8496)',
      'secondary-foreground': 'oklch(0.8717 0.0093 258.3382)',
    },
    accent: {
      accent: 'oklch(0.3858 0.0509 304.6383)',
      'accent-foreground': 'oklch(0.8717 0.0093 258.3382)',
    },
    base: {
      background: 'oklch(0.2161 0.0061 56.0434)',
      foreground: 'oklch(0.9299 0.0334 272.7879)',
    },
    card: {
      card: 'oklch(0.2805 0.0309 307.2326)',
      'card-foreground': 'oklch(0.9299 0.0334 272.7879)',
    },
    popover: {
      popover: 'oklch(0.2805 0.0309 307.2326)',
      'popover-foreground': 'oklch(0.9299 0.0334 272.7879)',
    },
    muted: {
      muted: 'oklch(0.2283 0.0375 302.9006)',
      'muted-foreground': 'oklch(0.7137 0.0192 261.3246)',
    },
    destructive: {
      destructive: 'oklch(0.8077 0.1035 19.5706)',
    },
    'border-input': {
      border: 'oklch(0.3416 0.0444 308.8496)',
      input: 'oklch(0.3416 0.0444 308.8496)',
      ring: 'oklch(0.7874 0.1179 295.7538)',
    },
    chart: {
      'chart-1': 'oklch(0.7874 0.1179 295.7538)',
      'chart-2': 'oklch(0.709 0.1592 293.5412)',
      'chart-3': 'oklch(0.6056 0.2189 292.7172)',
      'chart-4': 'oklch(0.5413 0.2466 293.009)',
      'chart-5': 'oklch(0.4907 0.2412 292.5809)',
    },
    sidebar: {
      sidebar: 'oklch(0.3416 0.0444 308.8496)',
      'sidebar-foreground': 'oklch(0.9299 0.0334 272.7879)',
      'sidebar-primary': 'oklch(0.7874 0.1179 295.7538)',
      'sidebar-primary-foreground': 'oklch(0.2161 0.0061 56.0434)',
      'sidebar-accent': 'oklch(0.3858 0.0509 304.6383)',
      'sidebar-accent-foreground': 'oklch(0.8717 0.0093 258.3382)',
      'sidebar-border': 'oklch(0.3416 0.0444 308.8496)',
      'sidebar-ring': 'oklch(0.7874 0.1179 295.7538)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
