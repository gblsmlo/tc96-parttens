import type { ThemePreset } from '../schema/theme'

export const boldTech = {
  name: 'bold-tech',
  title: 'Bold Tech',
  source: 'tweakcn',
  fonts: ['Roboto', 'Playfair Display', 'Fira Code'],
  typography: {
    'font-sans':
      'Roboto, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif':
      '"Playfair Display", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  light: {
    primary: {
      primary: 'oklch(0.6056 0.2189 292.7172)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.9618 0.0202 295.1913)',
      'secondary-foreground': 'oklch(0.4568 0.2146 277.0229)',
    },
    accent: {
      accent: 'oklch(0.9319 0.0316 255.5855)',
      'accent-foreground': 'oklch(0.4244 0.1809 265.6377)',
    },
    base: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.3588 0.1354 278.6973)',
    },
    card: {
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.3588 0.1354 278.6973)',
    },
    popover: {
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.3588 0.1354 278.6973)',
    },
    muted: {
      muted: 'oklch(0.9691 0.0161 293.7558)',
      'muted-foreground': 'oklch(0.5413 0.2466 293.009)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.9299 0.0334 272.7879)',
      input: 'oklch(0.9299 0.0334 272.7879)',
      ring: 'oklch(0.6056 0.2189 292.7172)',
    },
    chart: {
      'chart-1': 'oklch(0.6056 0.2189 292.7172)',
      'chart-2': 'oklch(0.5413 0.2466 293.009)',
      'chart-3': 'oklch(0.4907 0.2412 292.5809)',
      'chart-4': 'oklch(0.432 0.2106 292.7591)',
      'chart-5': 'oklch(0.3796 0.1783 293.7446)',
    },
    sidebar: {
      sidebar: 'oklch(0.9691 0.0161 293.7558)',
      'sidebar-foreground': 'oklch(0.3588 0.1354 278.6973)',
      'sidebar-primary': 'oklch(0.6056 0.2189 292.7172)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.9319 0.0316 255.5855)',
      'sidebar-accent-foreground': 'oklch(0.4244 0.1809 265.6377)',
      'sidebar-border': 'oklch(0.9299 0.0334 272.7879)',
      'sidebar-ring': 'oklch(0.6056 0.2189 292.7172)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.6056 0.2189 292.7172)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.2573 0.0861 281.2883)',
      'secondary-foreground': 'oklch(0.9299 0.0334 272.7879)',
    },
    accent: {
      accent: 'oklch(0.4568 0.2146 277.0229)',
      'accent-foreground': 'oklch(0.9299 0.0334 272.7879)',
    },
    base: {
      background: 'oklch(0.2077 0.0398 265.7549)',
      foreground: 'oklch(0.9299 0.0334 272.7879)',
    },
    card: {
      card: 'oklch(0.2573 0.0861 281.2883)',
      'card-foreground': 'oklch(0.9299 0.0334 272.7879)',
    },
    popover: {
      popover: 'oklch(0.2573 0.0861 281.2883)',
      'popover-foreground': 'oklch(0.9299 0.0334 272.7879)',
    },
    muted: {
      muted: 'oklch(0.2329 0.0919 279.1398)',
      'muted-foreground': 'oklch(0.8112 0.1013 293.5712)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.2827 0.1351 291.0894)',
      input: 'oklch(0.2827 0.1351 291.0894)',
      ring: 'oklch(0.6056 0.2189 292.7172)',
    },
    chart: {
      'chart-1': 'oklch(0.709 0.1592 293.5412)',
      'chart-2': 'oklch(0.6056 0.2189 292.7172)',
      'chart-3': 'oklch(0.5413 0.2466 293.009)',
      'chart-4': 'oklch(0.4907 0.2412 292.5809)',
      'chart-5': 'oklch(0.432 0.2106 292.7591)',
    },
    sidebar: {
      sidebar: 'oklch(0.2077 0.0398 265.7549)',
      'sidebar-foreground': 'oklch(0.9299 0.0334 272.7879)',
      'sidebar-primary': 'oklch(0.6056 0.2189 292.7172)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.4568 0.2146 277.0229)',
      'sidebar-accent-foreground': 'oklch(0.9299 0.0334 272.7879)',
      'sidebar-border': 'oklch(0.2827 0.1351 291.0894)',
      'sidebar-ring': 'oklch(0.6056 0.2189 292.7172)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
