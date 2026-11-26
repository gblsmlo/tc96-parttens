import type { ThemePreset } from '../schema/theme'

export const kodamaGrove = {
  name: 'kodama-grove',
  title: 'Kodama Grove',
  source: 'tweakcn',
  fonts: ['Merriweather', 'Source Serif 4', 'JetBrains Mono'],
  typography: {
    'font-sans':
      'Merriweather, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-serif':
      '"Source Serif 4", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.425rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.6657 0.105 118.9078)',
      'primary-foreground': 'oklch(0.9882 0.0069 88.6415)',
    },
    secondary: {
      secondary: 'oklch(0.8532 0.0631 91.1493)',
      'secondary-foreground': 'oklch(0.4265 0.031 59.2153)',
    },
    accent: {
      accent: 'oklch(0.8361 0.0713 90.3269)',
      'accent-foreground': 'oklch(0.4265 0.031 59.2153)',
    },
    base: {
      background: 'oklch(0.8798 0.0534 91.7893)',
      foreground: 'oklch(0.4265 0.031 59.2153)',
    },
    card: {
      card: 'oklch(0.8937 0.0395 87.5676)',
      'card-foreground': 'oklch(0.4265 0.031 59.2153)',
    },
    popover: {
      popover: 'oklch(0.9378 0.0331 89.8515)',
      'popover-foreground': 'oklch(0.4265 0.031 59.2153)',
    },
    muted: {
      muted: 'oklch(0.8532 0.0631 91.1493)',
      'muted-foreground': 'oklch(0.5761 0.0259 60.9323)',
    },
    destructive: {
      destructive: 'oklch(0.7136 0.0981 29.9827)',
    },
    'border-input': {
      border: 'oklch(0.6918 0.044 59.8448)',
      input: 'oklch(0.8361 0.0713 90.3269)',
      ring: 'oklch(0.735 0.0564 130.8494)',
    },
    chart: {
      'chart-1': 'oklch(0.735 0.0564 130.8494)',
      'chart-2': 'oklch(0.6762 0.0567 132.4479)',
      'chart-3': 'oklch(0.8185 0.0332 136.6539)',
      'chart-4': 'oklch(0.5929 0.0464 137.6224)',
      'chart-5': 'oklch(0.5183 0.039 137.1892)',
    },
    sidebar: {
      sidebar: 'oklch(0.8631 0.0645 90.5161)',
      'sidebar-foreground': 'oklch(0.4265 0.031 59.2153)',
      'sidebar-primary': 'oklch(0.735 0.0564 130.8494)',
      'sidebar-primary-foreground': 'oklch(0.9882 0.0069 88.6415)',
      'sidebar-accent': 'oklch(0.9225 0.0169 88.0027)',
      'sidebar-accent-foreground': 'oklch(0.4265 0.031 59.2153)',
      'sidebar-border': 'oklch(0.9073 0.017 88.0044)',
      'sidebar-ring': 'oklch(0.735 0.0564 130.8494)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.6762 0.0567 132.4479)',
      'primary-foreground': 'oklch(0.2686 0.0105 61.0213)',
    },
    secondary: {
      secondary: 'oklch(0.4448 0.0239 84.5498)',
      'secondary-foreground': 'oklch(0.9217 0.0235 82.1191)',
    },
    accent: {
      accent: 'oklch(0.654 0.0723 90.7629)',
      'accent-foreground': 'oklch(0.2686 0.0105 61.0213)',
    },
    base: {
      background: 'oklch(0.3303 0.0214 88.0737)',
      foreground: 'oklch(0.9217 0.0235 82.1191)',
    },
    card: {
      card: 'oklch(0.3583 0.0165 82.3257)',
      'card-foreground': 'oklch(0.9217 0.0235 82.1191)',
    },
    popover: {
      popover: 'oklch(0.3583 0.0165 82.3257)',
      'popover-foreground': 'oklch(0.9217 0.0235 82.1191)',
    },
    muted: {
      muted: 'oklch(0.3892 0.0197 82.7084)',
      'muted-foreground': 'oklch(0.7096 0.0171 73.6179)',
    },
    destructive: {
      destructive: 'oklch(0.6287 0.0821 31.2958)',
    },
    'border-input': {
      border: 'oklch(0.4448 0.0239 84.5498)',
      input: 'oklch(0.4448 0.0239 84.5498)',
      ring: 'oklch(0.6762 0.0567 132.4479)',
    },
    chart: {
      'chart-1': 'oklch(0.6762 0.0567 132.4479)',
      'chart-2': 'oklch(0.735 0.0564 130.8494)',
      'chart-3': 'oklch(0.5929 0.0464 137.6224)',
      'chart-4': 'oklch(0.654 0.0723 90.7629)',
      'chart-5': 'oklch(0.5183 0.039 137.1892)',
    },
    sidebar: {
      sidebar: 'oklch(0.3303 0.0214 88.0737)',
      'sidebar-foreground': 'oklch(0.9217 0.0235 82.1191)',
      'sidebar-primary': 'oklch(0.6762 0.0567 132.4479)',
      'sidebar-primary-foreground': 'oklch(0.2686 0.0105 61.0213)',
      'sidebar-accent': 'oklch(0.654 0.0723 90.7629)',
      'sidebar-accent-foreground': 'oklch(0.2686 0.0105 61.0213)',
      'sidebar-border': 'oklch(0.4448 0.0239 84.5498)',
      'sidebar-ring': 'oklch(0.6762 0.0567 132.4479)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
