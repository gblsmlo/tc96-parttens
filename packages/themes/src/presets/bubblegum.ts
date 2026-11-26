import type { ThemePreset } from '../schema/theme'

export const bubblegum = {
  name: 'bubblegum',
  title: 'Bubblegum',
  source: 'tweakcn',
  fonts: ['Poppins', 'Lora', 'Fira Code'],
  typography: {
    'font-sans':
      'Poppins, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif':
      'Lora, ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      '"Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  },
  other: {
    radius: '0.4rem',
  },
  light: {
    primary: {
      primary: 'oklch(0.6209 0.1801 348.1385)',
      'primary-foreground': 'oklch(1 0 0)',
    },
    secondary: {
      secondary: 'oklch(0.8095 0.0694 198.1863)',
      'secondary-foreground': 'oklch(0.3211 0 0)',
    },
    accent: {
      accent: 'oklch(0.9195 0.0801 87.667)',
      'accent-foreground': 'oklch(0.3211 0 0)',
    },
    base: {
      background: 'oklch(0.9399 0.0203 345.6985)',
      foreground: 'oklch(0.4712 0 0)',
    },
    card: {
      card: 'oklch(0.9498 0.05 86.8891)',
      'card-foreground': 'oklch(0.4712 0 0)',
    },
    popover: {
      popover: 'oklch(1 0 0)',
      'popover-foreground': 'oklch(0.4712 0 0)',
    },
    muted: {
      muted: 'oklch(0.88 0.0504 212.0952)',
      'muted-foreground': 'oklch(0.5795 0 0)',
    },
    destructive: {
      destructive: 'oklch(0.7091 0.1697 21.9551)',
    },
    'border-input': {
      border: 'oklch(0.6209 0.1801 348.1385)',
      input: 'oklch(0.9189 0 0)',
      ring: 'oklch(0.7002 0.1597 350.7532)',
    },
    chart: {
      'chart-1': 'oklch(0.7002 0.1597 350.7532)',
      'chart-2': 'oklch(0.8189 0.0799 212.0892)',
      'chart-3': 'oklch(0.9195 0.0801 87.667)',
      'chart-4': 'oklch(0.7998 0.111 348.1791)',
      'chart-5': 'oklch(0.6197 0.1899 353.9091)',
    },
    sidebar: {
      sidebar: 'oklch(0.914 0.0424 343.0913)',
      'sidebar-foreground': 'oklch(0.3211 0 0)',
      'sidebar-primary': 'oklch(0.6559 0.2118 354.3084)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.8228 0.1095 346.0184)',
      'sidebar-accent-foreground': 'oklch(0.3211 0 0)',
      'sidebar-border': 'oklch(0.9464 0.0327 307.1745)',
      'sidebar-ring': 'oklch(0.6559 0.2118 354.3084)',
    },
    status: {
      code: 'var(--card)',
    },
  },
  dark: {
    primary: {
      primary: 'oklch(0.9195 0.0801 87.667)',
      'primary-foreground': 'oklch(0.2497 0.0305 234.1628)',
    },
    secondary: {
      secondary: 'oklch(0.7794 0.0803 4.133)',
      'secondary-foreground': 'oklch(0.2497 0.0305 234.1628)',
    },
    accent: {
      accent: 'oklch(0.6699 0.0988 356.9762)',
      'accent-foreground': 'oklch(0.9306 0.0197 349.0785)',
    },
    base: {
      background: 'oklch(0.2497 0.0305 234.1628)',
      foreground: 'oklch(0.9306 0.0197 349.0785)',
    },
    card: {
      card: 'oklch(0.2902 0.0299 233.5352)',
      'card-foreground': 'oklch(0.9306 0.0197 349.0785)',
    },
    popover: {
      popover: 'oklch(0.2902 0.0299 233.5352)',
      'popover-foreground': 'oklch(0.9306 0.0197 349.0785)',
    },
    muted: {
      muted: 'oklch(0.2713 0.0086 255.578)',
      'muted-foreground': 'oklch(0.7794 0.0803 4.133)',
    },
    destructive: {
      destructive: 'oklch(0.6702 0.1806 350.3599)',
    },
    'border-input': {
      border: 'oklch(0.3907 0.0399 242.2181)',
      input: 'oklch(0.3093 0.0305 232.0027)',
      ring: 'oklch(0.6998 0.0896 201.8672)',
    },
    chart: {
      'chart-1': 'oklch(0.6998 0.0896 201.8672)',
      'chart-2': 'oklch(0.7794 0.0803 4.133)',
      'chart-3': 'oklch(0.6699 0.0988 356.9762)',
      'chart-4': 'oklch(0.4408 0.0702 217.0848)',
      'chart-5': 'oklch(0.2713 0.0086 255.578)',
    },
    sidebar: {
      sidebar: 'oklch(0.2303 0.027 235.9743)',
      'sidebar-foreground': 'oklch(0.967 0.0029 264.5419)',
      'sidebar-primary': 'oklch(0.6559 0.2118 354.3084)',
      'sidebar-primary-foreground': 'oklch(1 0 0)',
      'sidebar-accent': 'oklch(0.8228 0.1095 346.0184)',
      'sidebar-accent-foreground': 'oklch(0.2781 0.0296 256.848)',
      'sidebar-border': 'oklch(0.3729 0.0306 259.7328)',
      'sidebar-ring': 'oklch(0.6559 0.2118 354.3084)',
    },
    status: {
      code: 'var(--card)',
    },
  },
} satisfies ThemePreset
