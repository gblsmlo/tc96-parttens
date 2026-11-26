import type { ThemePreset } from '../schema/theme'

export const zinc = {
  name: 'zinc',
  title: 'Zinc',
  source: 'tc96',
  light: {
    primary: {
      primary: 'var(--color-zinc-800)',
      'primary-foreground': 'var(--color-zinc-50)',
    },
    secondary: {
      secondary: '--alpha(var(--color-black) / 4%)',
      'secondary-foreground': 'var(--color-zinc-800)',
    },
    accent: {
      accent: '--alpha(var(--color-black) / 4%)',
      'accent-foreground': 'var(--color-zinc-800)',
    },
    base: {
      background: 'var(--color-white)',
      foreground: 'var(--color-zinc-800)',
    },
    card: {
      card: 'var(--color-white)',
      'card-foreground': 'var(--color-zinc-800)',
    },
    popover: {
      popover: 'var(--color-white)',
      'popover-foreground': 'var(--color-zinc-800)',
    },
    muted: {
      muted: '--alpha(var(--color-black) / 4%)',
      'muted-foreground':
        'color-mix(in srgb, var(--color-zinc-500) 90%, var(--color-black))',
    },
    destructive: {
      destructive: 'var(--color-red-600)',
    },
    'border-input': {
      border: '--alpha(var(--color-black) / 8%)',
      input: '--alpha(var(--color-black) / 10%)',
      ring: 'var(--color-zinc-500)',
    },
    chart: {
      'chart-1': 'var(--color-orange-600)',
      'chart-2': 'var(--color-teal-600)',
      'chart-3': 'var(--color-cyan-900)',
      'chart-4': 'var(--color-amber-400)',
      'chart-5': 'var(--color-amber-500)',
    },
    sidebar: {
      sidebar: 'var(--color-zinc-50)',
      'sidebar-foreground':
        'color-mix(in srgb, var(--color-zinc-800) 64%, var(--sidebar))',
      'sidebar-primary': 'var(--color-zinc-800)',
      'sidebar-primary-foreground': 'var(--color-zinc-50)',
      'sidebar-accent': '--alpha(var(--color-black) / 4%)',
      'sidebar-accent-foreground': 'var(--color-zinc-800)',
      'sidebar-border': '--alpha(var(--color-black) / 6%)',
      'sidebar-ring': 'var(--color-zinc-500)',
    },
  },
  dark: {
    primary: {
      primary: 'var(--color-zinc-100)',
      'primary-foreground': 'var(--color-zinc-800)',
    },
    secondary: {
      secondary: '--alpha(var(--color-white) / 4%)',
      'secondary-foreground': 'var(--color-zinc-100)',
    },
    accent: {
      accent: '--alpha(var(--color-white) / 4%)',
      'accent-foreground': 'var(--color-zinc-100)',
    },
    base: {
      background:
        'color-mix(in srgb, var(--color-zinc-950) 95%, var(--color-white))',
      foreground: 'var(--color-zinc-100)',
    },
    card: {
      card: 'color-mix(in srgb, var(--background) 98%, var(--color-white))',
      'card-foreground': 'var(--color-zinc-100)',
    },
    popover: {
      popover: 'color-mix(in srgb, var(--background) 98%, var(--color-white))',
      'popover-foreground': 'var(--color-zinc-100)',
    },
    muted: {
      muted: '--alpha(var(--color-white) / 4%)',
      'muted-foreground':
        'color-mix(in srgb, var(--color-zinc-500) 80%, var(--color-white))',
    },
    destructive: {
      destructive: 'var(--color-red-600)',
    },
    'border-input': {
      border: '--alpha(var(--color-white) / 6%)',
      input: '--alpha(var(--color-white) / 8%)',
      ring: 'var(--color-zinc-500)',
    },
    chart: {
      'chart-1': 'var(--color-blue-700)',
      'chart-2': 'var(--color-emerald-500)',
      'chart-3': 'var(--color-amber-500)',
      'chart-4': 'var(--color-purple-500)',
      'chart-5': 'var(--color-rose-500)',
    },
    sidebar: {
      sidebar:
        'color-mix(in srgb, var(--color-zinc-950) 97%, var(--color-white))',
      'sidebar-foreground':
        'color-mix(in srgb, var(--color-zinc-100) 64%, var(--sidebar))',
      'sidebar-primary': 'var(--color-zinc-100)',
      'sidebar-primary-foreground': 'var(--color-zinc-800)',
      'sidebar-accent': '--alpha(var(--color-white) / 4%)',
      'sidebar-accent-foreground': 'var(--color-zinc-100)',
      'sidebar-border': '--alpha(var(--color-white) / 5%)',
      'sidebar-ring': 'var(--color-zinc-400)',
    },
  },
} satisfies ThemePreset
