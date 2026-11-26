import type { ThemePreset } from '../schema/theme'

export const cyberpunk = {
  name: 'cyberpunk',
  title: 'Cyberpunk',
  source: 'tweakcn',
  fonts: ['Outfit', 'Fira Code'],
  typography: {
    'font-sans':
      'Outfit, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-mono':
      '"Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.5rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.6726 0.2904 341.4084)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.9595 0.02 286.0164)',
      'secondary-foreground': 'oklch(0.1649 0.0352 281.8285)',
    },
    accent: {
      accent: 'oklch(0.8903 0.1739 171.269)',
      'accent-foreground': 'oklch(0.1649 0.0352 281.8285)',
    },
    base: {
      background: 'oklch(0.9816 0.0017 247.839)',
      foreground: 'oklch(0.1649 0.0352 281.8285)',
    },
    card: {
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.1649 0.0352 281.8285)',
    },
    popover: {
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.1649 0.0352 281.8285)',
    },
    muted: {
      muted: 'oklch(0.9595 0.02 286.0164)',
      'muted-foreground': 'oklch(0.1649 0.0352 281.8285)',
    },
    destructive: {
      destructive: 'oklch(0.6535 0.2348 34.037)',
    },
    'border-input': {
      border: 'oklch(0.9205 0.0086 225.0878)',
      input: 'oklch(0.9205 0.0086 225.0878)',
      ring: 'oklch(0.6726 0.2904 341.4084)',
    },
    chart: {
      'chart-1': 'oklch(0.6726 0.2904 341.4084)',
      'chart-2': 'oklch(0.5488 0.2944 299.0954)',
      'chart-3': 'oklch(0.8442 0.1457 209.2851)',
      'chart-4': 'oklch(0.8903 0.1739 171.269)',
      'chart-5': 'oklch(0.9168 0.1915 101.407)',
    },
    sidebar: {
      sidebar: 'oklch(0.9595 0.02 286.0164)',
      'sidebar-foreground': 'oklch(0.1649 0.0352 281.8285)',
      'sidebar-primary': 'oklch(0.6726 0.2904 341.4084)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.8903 0.1739 171.269)',
      'sidebar-accent-foreground': 'oklch(0.1649 0.0352 281.8285)',
      'sidebar-border': 'oklch(0.9205 0.0086 225.0878)',
      'sidebar-ring': 'oklch(0.6726 0.2904 341.4084)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.6726 0.2904 341.4084)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.2542 0.0611 281.1423)',
      'secondary-foreground': 'oklch(0.9513 0.0074 260.7315)',
    },
    accent: {
      accent: 'oklch(0.8903 0.1739 171.269)',
      'accent-foreground': 'oklch(0.1649 0.0352 281.8285)',
    },
    base: {
      background: 'oklch(0.1649 0.0352 281.8285)',
      foreground: 'oklch(0.9513 0.0074 260.7315)',
    },
    card: {
      card: 'oklch(0.2542 0.0611 281.1423)',
      'card-foreground': 'oklch(0.9513 0.0074 260.7315)',
    },
    popover: {
      popover: 'oklch(0.2542 0.0611 281.1423)',
      'popover-foreground': 'oklch(0.9513 0.0074 260.7315)',
    },
    muted: {
      muted: 'oklch(0.2123 0.0522 280.9917)',
      'muted-foreground': 'oklch(0.6245 0.05 278.1046)',
    },
    destructive: {
      destructive: 'oklch(0.6535 0.2348 34.037)',
    },
    'border-input': {
      border: 'oklch(0.3279 0.0832 280.789)',
      input: 'oklch(0.3279 0.0832 280.789)',
      ring: 'oklch(0.6726 0.2904 341.4084)',
    },
    chart: {
      'chart-1': 'oklch(0.6726 0.2904 341.4084)',
      'chart-2': 'oklch(0.5488 0.2944 299.0954)',
      'chart-3': 'oklch(0.8442 0.1457 209.2851)',
      'chart-4': 'oklch(0.8903 0.1739 171.269)',
      'chart-5': 'oklch(0.9168 0.1915 101.407)',
    },
    sidebar: {
      sidebar: 'oklch(0.1649 0.0352 281.8285)',
      'sidebar-foreground': 'oklch(0.9513 0.0074 260.7315)',
      'sidebar-primary': 'oklch(0.6726 0.2904 341.4084)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.8903 0.1739 171.269)',
      'sidebar-accent-foreground': 'oklch(0.1649 0.0352 281.8285)',
      'sidebar-border': 'oklch(0.3279 0.0832 280.789)',
      'sidebar-ring': 'oklch(0.6726 0.2904 341.4084)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
