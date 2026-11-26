import type { ThemePreset } from '../schema/theme'

export const doom64 = {
  name: 'doom-64',
  title: 'Doom 64',
  source: 'tweakcn',
  fonts: ['Oxanium', 'Source Code Pro'],
  typography: {
    'font-sans':
      'Oxanium, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-mono':
      '"Source Code Pro", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0px',
  },
  light: {
    primary: {
      primary: 'oklch(0.5016 0.1887 27.4816)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.4955 0.0896 126.1858)',
      'secondary-foreground': 'oklch(1 0 0)',
    },
    accent: {
      accent: 'oklch(0.588 0.0993 245.7394)',
      'accent-foreground': 'oklch(1 0 0)',
    },
    base: {
      background: 'oklch(0.8452 0 0)',
      foreground: 'oklch(0.2393 0 0)',
    },
    card: {
      card: 'oklch(0.7572 0 0)',
      'card-foreground': 'oklch(0.2393 0 0)',
    },
    popover: {
      popover: 'oklch(0.7572 0 0)',
      'popover-foreground': 'oklch(0.2393 0 0)',
    },
    muted: {
      muted: 'oklch(0.7826 0 0)',
      'muted-foreground': 'oklch(0.4091 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.7076 0.1975 46.4558)',
    },
    'border-input': {
      border: 'oklch(0.4313 0 0)',
      input: 'oklch(0.4313 0 0)',
      ring: 'oklch(0.5016 0.1887 27.4816)',
    },
    chart: {
      'chart-1': 'oklch(0.5016 0.1887 27.4816)',
      'chart-2': 'oklch(0.4955 0.0896 126.1858)',
      'chart-3': 'oklch(0.588 0.0993 245.7394)',
      'chart-4': 'oklch(0.7076 0.1975 46.4558)',
      'chart-5': 'oklch(0.5656 0.0431 40.4319)',
    },
    sidebar: {
      sidebar: 'oklch(0.7572 0 0)',
      'sidebar-foreground': 'oklch(0.2393 0 0)',
      'sidebar-primary': 'oklch(0.5016 0.1887 27.4816)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.588 0.0993 245.7394)',
      'sidebar-accent-foreground': 'oklch(1 0 0)',
      'sidebar-border': 'oklch(0.4313 0 0)',
      'sidebar-ring': 'oklch(0.5016 0.1887 27.4816)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.6083 0.209 27.0276)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.6423 0.1467 133.0145)',
      'secondary-foreground': 'oklch(0 0 0)',
    },
    accent: {
      accent: 'oklch(0.7482 0.1235 244.7492)',
      'accent-foreground': 'oklch(0 0 0)',
    },
    base: {
      background: 'oklch(0.2178 0 0)',
      foreground: 'oklch(0.9067 0 0)',
    },
    card: {
      card: 'oklch(0.285 0 0)',
      'card-foreground': 'oklch(0.9067 0 0)',
    },
    popover: {
      popover: 'oklch(0.285 0 0)',
      'popover-foreground': 'oklch(0.9067 0 0)',
    },
    muted: {
      muted: 'oklch(0.2645 0 0)',
      'muted-foreground': 'oklch(0.7058 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.7839 0.1719 68.0943)',
    },
    'border-input': {
      border: 'oklch(0.4091 0 0)',
      input: 'oklch(0.4091 0 0)',
      ring: 'oklch(0.6083 0.209 27.0276)',
    },
    chart: {
      'chart-1': 'oklch(0.6083 0.209 27.0276)',
      'chart-2': 'oklch(0.6423 0.1467 133.0145)',
      'chart-3': 'oklch(0.7482 0.1235 244.7492)',
      'chart-4': 'oklch(0.7839 0.1719 68.0943)',
      'chart-5': 'oklch(0.6471 0.0334 40.7963)',
    },
    sidebar: {
      sidebar: 'oklch(0.1913 0 0)',
      'sidebar-foreground': 'oklch(0.9067 0 0)',
      'sidebar-primary': 'oklch(0.6083 0.209 27.0276)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.7482 0.1235 244.7492)',
      'sidebar-accent-foreground': 'oklch(0 0 0)',
      'sidebar-border': 'oklch(0.4091 0 0)',
      'sidebar-ring': 'oklch(0.6083 0.209 27.0276)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
