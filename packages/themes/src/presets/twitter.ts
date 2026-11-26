import type { ThemePreset } from '../schema/theme'

export const twitter = {
  name: 'twitter',
  title: 'Twitter',
  source: 'tweakcn',
  fonts: ['Open Sans'],
  typography: {
    'font-sans':
      '"Open Sans", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif': 'Georgia, ui-serif, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      'Menlo, ui-monospace, SFMono-Regular, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '1.3rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.6723 0.1606 244.9955)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.1884 0.0128 248.5103)',
      'secondary-foreground': 'oklch(1 0 0)',
    },
    accent: {
      accent: 'oklch(0.9392 0.0166 250.8453)',
      'accent-foreground': 'oklch(0.6723 0.1606 244.9955)',
    },
    base: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.1884 0.0128 248.5103)',
    },
    card: {
      card: 'oklch(0.9784 0.0011 197.1387)',
      'card-foreground': 'oklch(0.1884 0.0128 248.5103)',
    },
    popover: {
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.1884 0.0128 248.5103)',
    },
    muted: {
      muted: 'oklch(0.9222 0.0013 286.3737)',
      'muted-foreground': 'oklch(0.1884 0.0128 248.5103)',
    },
    destructive: {
      destructive: 'oklch(0.6188 0.2376 25.7658)',
    },
    'border-input': {
      border: 'oklch(0.9317 0.0118 231.6594)',
      input: 'oklch(0.9809 0.0025 228.7836)',
      ring: 'oklch(0.6818 0.1584 243.354)',
    },
    chart: {
      'chart-1': 'oklch(0.6723 0.1606 244.9955)',
      'chart-2': 'oklch(0.6907 0.1554 160.3454)',
      'chart-3': 'oklch(0.8214 0.16 82.5337)',
      'chart-4': 'oklch(0.7064 0.1822 151.7125)',
      'chart-5': 'oklch(0.5919 0.2186 10.5826)',
    },
    sidebar: {
      sidebar: 'oklch(0.9784 0.0011 197.1387)',
      'sidebar-foreground': 'oklch(0.1884 0.0128 248.5103)',
      'sidebar-primary': 'oklch(0.6723 0.1606 244.9955)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.9392 0.0166 250.8453)',
      'sidebar-accent-foreground': 'oklch(0.6723 0.1606 244.9955)',
      'sidebar-border': 'oklch(0.9271 0.0101 238.5177)',
      'sidebar-ring': 'oklch(0.6818 0.1584 243.354)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.6692 0.1607 245.011)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.9622 0.0035 219.5331)',
      'secondary-foreground': 'oklch(0.1884 0.0128 248.5103)',
    },
    accent: {
      accent: 'oklch(0.1928 0.0331 242.5459)',
      'accent-foreground': 'oklch(0.6692 0.1607 245.011)',
    },
    base: {
      background: 'oklch(0 0 0)',
      foreground: 'oklch(0.9328 0.0025 228.7857)',
    },
    card: {
      card: 'oklch(0.2097 0.008 274.5332)',
      'card-foreground': 'oklch(0.8853 0 0)',
    },
    popover: {
      popover: 'oklch(0 0 0)',
      'popover-foreground': 'oklch(0.9328 0.0025 228.7857)',
    },
    muted: {
      muted: 'oklch(0.209 0 0)',
      'muted-foreground': 'oklch(0.5637 0.0078 247.9662)',
    },
    destructive: {
      destructive: 'oklch(0.6188 0.2376 25.7658)',
    },
    'border-input': {
      border: 'oklch(0.2674 0.0047 248.0045)',
      input: 'oklch(0.302 0.0288 244.8244)',
      ring: 'oklch(0.6818 0.1584 243.354)',
    },
    chart: {
      'chart-1': 'oklch(0.6723 0.1606 244.9955)',
      'chart-2': 'oklch(0.6907 0.1554 160.3454)',
      'chart-3': 'oklch(0.8214 0.16 82.5337)',
      'chart-4': 'oklch(0.7064 0.1822 151.7125)',
      'chart-5': 'oklch(0.5919 0.2186 10.5826)',
    },
    sidebar: {
      sidebar: 'oklch(0.2097 0.008 274.5332)',
      'sidebar-foreground': 'oklch(0.8853 0 0)',
      'sidebar-primary': 'oklch(0.6818 0.1584 243.354)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.1928 0.0331 242.5459)',
      'sidebar-accent-foreground': 'oklch(0.6692 0.1607 245.011)',
      'sidebar-border': 'oklch(0.3795 0.022 240.5943)',
      'sidebar-ring': 'oklch(0.6818 0.1584 243.354)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
