import type { ThemePreset } from '../schema/theme'

export const notebook = {
  name: 'notebook',
  title: 'Notebook',
  source: 'tweakcn',
  fonts: ['Architects Daughter', 'Fira Code'],
  typography: {
    'font-sans':
      '"Architects Daughter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif': 'Georgia, ui-serif, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"Fira Code", "Courier New", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    'letter-spacing': '0.5px',
  },
  light: {
    primary: {
      primary: 'oklch(0.4891 0 0)',
      'primary-foreground': 'oklch(0.9551 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.9006 0 0)',
      'secondary-foreground': 'oklch(0.3485 0 0)',
    },
    accent: {
      accent: 'oklch(0.9354 0.0456 94.8549)',
      'accent-foreground': 'oklch(0.4015 0.0436 37.9587)',
    },
    base: {
      background: 'oklch(0.9821 0 0)',
      foreground: 'oklch(0.3485 0 0)',
    },
    card: {
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.3485 0 0)',
    },
    popover: {
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.3485 0 0)',
    },
    muted: {
      muted: 'oklch(0.9158 0 0)',
      'muted-foreground': 'oklch(0.4313 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.6627 0.0978 20.0041)',
    },
    'border-input': {
      border: 'oklch(0.5538 0.0025 17.232)',
      input: 'oklch(1 0 0)',
      ring: 'oklch(0.7058 0 0)',
    },
    chart: {
      'chart-1': 'oklch(0.3211 0 0)',
      'chart-2': 'oklch(0.4495 0 0)',
      'chart-3': 'oklch(0.5693 0 0)',
      'chart-4': 'oklch(0.683 0 0)',
      'chart-5': 'oklch(0.7921 0 0)',
    },
    sidebar: {
      sidebar: 'oklch(0.9551 0 0)',
      'sidebar-foreground': 'oklch(0.3485 0 0)',
      'sidebar-primary': 'oklch(0.4891 0 0)',
      'sidebar-primary-foreground': 'oklch(0.9551 0 0)',
      'sidebar-accent': 'oklch(0.9354 0.0456 94.8549)',
      'sidebar-accent-foreground': 'oklch(0.4015 0.0436 37.9587)',
      'sidebar-border': 'oklch(0.8078 0 0)',
      'sidebar-ring': 'oklch(0.7058 0 0)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.7572 0 0)',
      'primary-foreground': 'oklch(0.2891 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.4676 0 0)',
      'secondary-foreground': 'oklch(0.8078 0 0)',
    },
    accent: {
      accent: 'oklch(0.9067 0 0)',
      'accent-foreground': 'oklch(0.3211 0 0)',
    },
    base: {
      background: 'oklch(0.2891 0 0)',
      foreground: 'oklch(0.8945 0 0)',
    },
    card: {
      card: 'oklch(0.3211 0 0)',
      'card-foreground': 'oklch(0.8945 0 0)',
    },
    popover: {
      popover: 'oklch(0.3211 0 0)',
      'popover-foreground': 'oklch(0.8945 0 0)',
    },
    muted: {
      muted: 'oklch(0.3904 0 0)',
      'muted-foreground': 'oklch(0.7058 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.7915 0.0491 18.241)',
    },
    'border-input': {
      border: 'oklch(0.4276 0 0)',
      input: 'oklch(0.3211 0 0)',
      ring: 'oklch(0.8078 0 0)',
    },
    chart: {
      'chart-1': 'oklch(0.9521 0 0)',
      'chart-2': 'oklch(0.8576 0 0)',
      'chart-3': 'oklch(0.7572 0 0)',
      'chart-4': 'oklch(0.6534 0 0)',
      'chart-5': 'oklch(0.5452 0 0)',
    },
    sidebar: {
      sidebar: 'oklch(0.2478 0 0)',
      'sidebar-foreground': 'oklch(0.8945 0 0)',
      'sidebar-primary': 'oklch(0.7572 0 0)',
      'sidebar-primary-foreground': 'oklch(0.2478 0 0)',
      'sidebar-accent': 'oklch(0.9067 0 0)',
      'sidebar-accent-foreground': 'oklch(0.3211 0 0)',
      'sidebar-border': 'oklch(0.4276 0 0)',
      'sidebar-ring': 'oklch(0.8078 0 0)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
