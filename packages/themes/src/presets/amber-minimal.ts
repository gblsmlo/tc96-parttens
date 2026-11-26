import type { ThemePreset } from '../schema/theme'

export const amberMinimal = {
  name: 'amber-minimal',
  title: 'Amber Minimal',
  source: 'tweakcn',
  fonts: ['Inter', 'Source Serif 4', 'JetBrains Mono'],
  typography: {
    'font-sans':
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif':
      '"Source Serif 4", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.375rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.7686 0.1647 70.0804)',
      'primary-foreground': 'oklch(0 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.967 0.0029 264.5419)',
      'secondary-foreground': 'oklch(0.4461 0.0263 256.8018)',
    },
    accent: {
      accent: 'oklch(0.9869 0.0214 95.2774)',
      'accent-foreground': 'oklch(0.4732 0.1247 46.2007)',
    },
    base: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.2686 0 0)',
    },
    card: {
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.2686 0 0)',
    },
    popover: {
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.2686 0 0)',
    },
    muted: {
      muted: 'oklch(0.9846 0.0017 247.8389)',
      'muted-foreground': 'oklch(0.551 0.0234 264.3637)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.9276 0.0058 264.5313)',
      input: 'oklch(0.9276 0.0058 264.5313)',
      ring: 'oklch(0.7686 0.1647 70.0804)',
    },
    chart: {
      'chart-1': 'oklch(0.7686 0.1647 70.0804)',
      'chart-2': 'oklch(0.6658 0.1574 58.3183)',
      'chart-3': 'oklch(0.5553 0.1455 48.9975)',
      'chart-4': 'oklch(0.4732 0.1247 46.2007)',
      'chart-5': 'oklch(0.4137 0.1054 45.9038)',
    },
    sidebar: {
      sidebar: 'oklch(0.9846 0.0017 247.8389)',
      'sidebar-foreground': 'oklch(0.2686 0 0)',
      'sidebar-primary': 'oklch(0.7686 0.1647 70.0804)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.9869 0.0214 95.2774)',
      'sidebar-accent-foreground': 'oklch(0.4732 0.1247 46.2007)',
      'sidebar-border': 'oklch(0.9276 0.0058 264.5313)',
      'sidebar-ring': 'oklch(0.7686 0.1647 70.0804)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.7686 0.1647 70.0804)',
      'primary-foreground': 'oklch(0 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.2686 0 0)',
      'secondary-foreground': 'oklch(0.9219 0 0)',
    },
    accent: {
      accent: 'oklch(0.4732 0.1247 46.2007)',
      'accent-foreground': 'oklch(0.9243 0.1151 95.7459)',
    },
    base: {
      background: 'oklch(0.2046 0 0)',
      foreground: 'oklch(0.9219 0 0)',
    },
    card: {
      card: 'oklch(0.2686 0 0)',
      'card-foreground': 'oklch(0.9219 0 0)',
    },
    popover: {
      popover: 'oklch(0.2686 0 0)',
      'popover-foreground': 'oklch(0.9219 0 0)',
    },
    muted: {
      muted: 'oklch(0.2393 0 0)',
      'muted-foreground': 'oklch(0.7155 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.3715 0 0)',
      input: 'oklch(0.3715 0 0)',
      ring: 'oklch(0.7686 0.1647 70.0804)',
    },
    chart: {
      'chart-1': 'oklch(0.8369 0.1644 84.4286)',
      'chart-2': 'oklch(0.6658 0.1574 58.3183)',
      'chart-3': 'oklch(0.4732 0.1247 46.2007)',
      'chart-4': 'oklch(0.5553 0.1455 48.9975)',
      'chart-5': 'oklch(0.4732 0.1247 46.2007)',
    },
    sidebar: {
      sidebar: 'oklch(0.1684 0 0)',
      'sidebar-foreground': 'oklch(0.9219 0 0)',
      'sidebar-primary': 'oklch(0.7686 0.1647 70.0804)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.4732 0.1247 46.2007)',
      'sidebar-accent-foreground': 'oklch(0.9243 0.1151 95.7459)',
      'sidebar-border': 'oklch(0.3715 0 0)',
      'sidebar-ring': 'oklch(0.7686 0.1647 70.0804)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
