import type { ThemePreset } from '../schema/theme'

export const quantumRose = {
  name: 'quantum-rose',
  title: 'Quantum Rose',
  source: 'tweakcn',
  fonts: ['Quicksand', 'Playfair Display', 'Space Mono'],
  typography: {
    'font-sans':
      'Quicksand, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif':
      '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"Space Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.5rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.6002 0.2414 0.1348)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.923 0.0701 326.1273)',
      'secondary-foreground': 'oklch(0.4426 0.1653 352.3762)',
    },
    accent: {
      accent: 'oklch(0.8766 0.0828 344.8849)',
      'accent-foreground': 'oklch(0.4426 0.1653 352.3762)',
    },
    base: {
      background: 'oklch(0.9692 0.0192 343.9344)',
      foreground: 'oklch(0.4426 0.1653 352.3762)',
    },
    card: {
      card: 'oklch(0.9837 0.0107 339.3288)',
      'card-foreground': 'oklch(0.4426 0.1653 352.3762)',
    },
    popover: {
      popover: 'oklch(0.9837 0.0107 339.3288)',
      'popover-foreground': 'oklch(0.4426 0.1653 352.3762)',
    },
    muted: {
      muted: 'oklch(0.9429 0.0363 344.2604)',
      'muted-foreground': 'oklch(0.574 0.1732 352.0544)',
    },
    destructive: {
      destructive: 'oklch(0.5831 0.1911 6.341)',
    },
    'border-input': {
      border: 'oklch(0.8881 0.0747 344.3866)',
      input: 'oklch(0.923 0.0701 326.1273)',
      ring: 'oklch(0.6002 0.2414 0.1348)',
    },
    chart: {
      'chart-1': 'oklch(0.6002 0.2414 0.1348)',
      'chart-2': 'oklch(0.5979 0.175 345.0378)',
      'chart-3': 'oklch(0.6009 0.1243 311.7958)',
      'chart-4': 'oklch(0.5849 0.1178 283.2937)',
      'chart-5': 'oklch(0.6479 0.1871 267.9684)',
    },
    sidebar: {
      sidebar: 'oklch(0.9629 0.0227 345.7485)',
      'sidebar-foreground': 'oklch(0.4426 0.1653 352.3762)',
      'sidebar-primary': 'oklch(0.6002 0.2414 0.1348)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.8766 0.0828 344.8849)',
      'sidebar-accent-foreground': 'oklch(0.4426 0.1653 352.3762)',
      'sidebar-border': 'oklch(0.9311 0.0448 343.3135)',
      'sidebar-ring': 'oklch(0.6002 0.2414 0.1348)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.7543 0.2319 332.0212)',
      'primary-foreground': 'oklch(0.1608 0.0493 327.5673)',
    },
    secondary: {
      secondary: 'oklch(0.3184 0.0915 319.6465)',
      'secondary-foreground': 'oklch(0.8624 0.1307 326.6356)',
    },
    accent: {
      accent: 'oklch(0.3558 0.1201 325.7655)',
      'accent-foreground': 'oklch(0.8624 0.1307 326.6356)',
    },
    base: {
      background: 'oklch(0.1808 0.0535 313.7159)',
      foreground: 'oklch(0.8624 0.1307 326.6356)',
    },
    card: {
      card: 'oklch(0.2398 0.0661 313.2337)',
      'card-foreground': 'oklch(0.8624 0.1307 326.6356)',
    },
    popover: {
      popover: 'oklch(0.2398 0.0661 313.2337)',
      'popover-foreground': 'oklch(0.8624 0.1307 326.6356)',
    },
    muted: {
      muted: 'oklch(0.2701 0.077 312.3525)',
      'muted-foreground': 'oklch(0.7116 0.1623 327.1132)',
    },
    destructive: {
      destructive: 'oklch(0.6539 0.2441 7.174)',
    },
    'border-input': {
      border: 'oklch(0.328 0.1202 313.5393)',
      input: 'oklch(0.3184 0.0915 319.6465)',
      ring: 'oklch(0.7543 0.2319 332.0212)',
    },
    chart: {
      'chart-1': 'oklch(0.7543 0.2319 332.0212)',
      'chart-2': 'oklch(0.6508 0.2159 317.6331)',
      'chart-3': 'oklch(0.6249 0.2233 292.7656)',
      'chart-4': 'oklch(0.6067 0.1649 278.7172)',
      'chart-5': 'oklch(0.6235 0.2019 268.0521)',
    },
    sidebar: {
      sidebar: 'oklch(0.1941 0.0504 311.3983)',
      'sidebar-foreground': 'oklch(0.8624 0.1307 326.6356)',
      'sidebar-primary': 'oklch(0.7543 0.2319 332.0212)',
      'sidebar-primary-foreground': 'oklch(0.1608 0.0493 327.5673)',
      'sidebar-accent': 'oklch(0.3558 0.1201 325.7655)',
      'sidebar-accent-foreground': 'oklch(0.8624 0.1307 326.6356)',
      'sidebar-border': 'oklch(0.328 0.1202 313.5393)',
      'sidebar-ring': 'oklch(0.7543 0.2319 332.0212)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
