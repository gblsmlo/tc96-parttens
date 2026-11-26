import type { ThemePreset } from '../schema/theme'

export const sageGarden = {
  name: 'sage-garden',
  title: 'Sage Garden',
  source: 'tweakcn',
  fonts: ['Antic', 'JetBrains Mono'],
  typography: {
    'font-sans':
      'Antic, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif':
      'Signifier, Georgia, ui-serif, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"JetBrains Mono", "Courier New", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.35rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.6333 0.0309 154.9039)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.8596 0.0291 119.9919)',
      'secondary-foreground': 'oklch(0.2417 0.0298 269.8827)',
    },
    accent: {
      accent: 'oklch(0.8242 0.0221 136.6092)',
      'accent-foreground': 'oklch(0.2417 0.0298 269.8827)',
    },
    base: {
      background: 'oklch(0.9761 0.0041 91.4461)',
      foreground: 'oklch(0.2417 0.0298 269.8827)',
    },
    card: {
      card: 'oklch(1 0 0)',
      'card-foreground': 'oklch(0.2417 0.0298 269.8827)',
    },
    popover: {
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.2417 0.0298 269.8827)',
    },
    muted: {
      muted: 'oklch(0.9251 0.0071 88.645)',
      'muted-foreground': 'oklch(0.551 0.0234 264.3637)',
    },
    destructive: {
      destructive: 'oklch(0.5624 0.1743 26.1433)',
    },
    'border-input': {
      border: 'oklch(0.9251 0.0071 88.645)',
      input: 'oklch(1 0 0)',
      ring: 'oklch(0.6333 0.0309 154.9039)',
    },
    chart: {
      'chart-1': 'oklch(0.6333 0.0309 154.9039)',
      'chart-2': 'oklch(0.7209 0.0489 120.9474)',
      'chart-3': 'oklch(0.6744 0.0427 136.011)',
      'chart-4': 'oklch(0.551 0.0234 264.3637)',
      'chart-5': 'oklch(0.9251 0.0071 88.645)',
    },
    sidebar: {
      sidebar: 'oklch(0.9845 0.0026 106.4477)',
      'sidebar-foreground': 'oklch(0.2417 0.0298 269.8827)',
      'sidebar-primary': 'oklch(0.6333 0.0309 154.9039)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.9251 0.0071 88.645)',
      'sidebar-accent-foreground': 'oklch(0.2417 0.0298 269.8827)',
      'sidebar-border': 'oklch(0.9251 0.0071 88.645)',
      'sidebar-ring': 'oklch(0.6333 0.0309 154.9039)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.6333 0.0309 154.9039)',
      'primary-foreground': 'oklch(0 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.2178 0 0)',
      'secondary-foreground': 'oklch(0.9702 0 0)',
    },
    accent: {
      accent: 'oklch(0.3709 0.0248 153.9823)',
      'accent-foreground': 'oklch(0.9702 0 0)',
    },
    base: {
      background: 'oklch(0.1448 0 0)',
      foreground: 'oklch(0.9702 0 0)',
    },
    card: {
      card: 'oklch(0.1822 0 0)',
      'card-foreground': 'oklch(0.9702 0 0)',
    },
    popover: {
      popover: 'oklch(0.1822 0 0)',
      'popover-foreground': 'oklch(0.9702 0 0)',
    },
    muted: {
      muted: 'oklch(0.2178 0 0)',
      'muted-foreground': 'oklch(0.7058 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.6368 0.2078 25.3313)',
    },
    'border-input': {
      border: 'oklch(0.285 0 0)',
      input: 'oklch(0.1822 0 0)',
      ring: 'oklch(0.6333 0.0309 154.9039)',
    },
    chart: {
      'chart-1': 'oklch(0.6333 0.0309 154.9039)',
      'chart-2': 'oklch(0.7209 0.0489 120.9474)',
      'chart-3': 'oklch(0.6744 0.0427 136.011)',
      'chart-4': 'oklch(0.551 0.0234 264.3637)',
      'chart-5': 'oklch(0.5096 0.0289 152.346)',
    },
    sidebar: {
      sidebar: 'oklch(0.1684 0 0)',
      'sidebar-foreground': 'oklch(0.9702 0 0)',
      'sidebar-primary': 'oklch(0.6333 0.0309 154.9039)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.2178 0 0)',
      'sidebar-accent-foreground': 'oklch(0.9702 0 0)',
      'sidebar-border': 'oklch(0.285 0 0)',
      'sidebar-ring': 'oklch(0.6333 0.0309 154.9039)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
