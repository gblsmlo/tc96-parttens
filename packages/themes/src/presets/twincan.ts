import type { ThemePreset } from '../schema/theme'

export const twincan = {
  name: 'twincan',
  title: 'Twincan',
  source: 'tc96',
  typography: {
    'font-sans':
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    'font-serif': 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    'font-mono':
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    'font-heading': 'var(--font-sans)',
  },
  other: {
    radius: '0.625rem',
  },
  light: {
    primary: {
      primary: 'var(--color-stone-800)',
      'primary-foreground': 'var(--color-stone-50)',
    },
    secondary: {
      secondary: '--alpha(var(--color-black) / 4%)',
      'secondary-foreground': 'var(--color-stone-800)',
    },
    accent: {
      accent: '--alpha(var(--color-black) / 4%)',
      'accent-foreground': 'var(--color-stone-800)',
    },
    base: {
      background: 'var(--color-stone-50)',
      foreground: 'var(--color-stone-800)',
      'shadow-color': 'var(--color-stone-950)',
    },
    card: {
      card: 'var(--color-white)',
      'card-foreground': 'var(--color-stone-800)',
      'card-shadow':
        '0 1px 2px 0 color-mix(in oklab, var(--shadow-color) 4%, transparent), 0 1px 4px -1px color-mix(in oklab, var(--shadow-color) 5%, transparent)',
    },
    popover: {
      popover: 'var(--color-white)',
      'popover-foreground': 'var(--color-stone-800)',
      'popover-shadow':
        '0 2px 4px -1px color-mix(in oklab, var(--shadow-color) 6%, transparent), 0 12px 24px -6px color-mix(in oklab, var(--shadow-color) 16%, transparent)',
    },
    muted: {
      muted: '--alpha(var(--color-black) / 4%)',
      'muted-foreground':
        'color-mix(in srgb, var(--color-stone-500) 90%, var(--color-black))',
    },
    destructive: {
      destructive: 'var(--color-red-600)',
      'destructive-foreground': 'var(--color-red-700)',
    },
    'border-input': {
      border: '--alpha(var(--color-black) / 8%)',
      input: '--alpha(var(--color-black) / 10%)',
      ring: 'var(--color-neutral-500)',
      'input-shadow':
        '0 1px 2px 0 color-mix(in oklab, var(--shadow-color) 4%, transparent), 0 1px 4px -1px color-mix(in oklab, var(--shadow-color) 5%, transparent)',
    },
    chart: {
      'chart-1': 'var(--color-orange-600)',
      'chart-2': 'var(--color-teal-600)',
      'chart-3': 'var(--color-cyan-900)',
      'chart-4': 'var(--color-amber-400)',
      'chart-5': 'var(--color-amber-500)',
      'chart-shadow':
        '0 1px 2px 0 color-mix(in oklab, var(--shadow-color) 4%, transparent), 0 1px 4px -1px color-mix(in oklab, var(--shadow-color) 5%, transparent)',
    },
    sidebar: {
      sidebar: 'var(--color-stone-50)',
      'sidebar-foreground':
        'color-mix(in srgb, var(--color-stone-800) 64%, var(--sidebar))',
      'sidebar-primary': 'var(--color-stone-800)',
      'sidebar-primary-foreground': 'var(--color-stone-50)',
      'sidebar-accent': '--alpha(var(--color-black) / 4%)',
      'sidebar-accent-foreground': 'var(--color-stone-800)',
      'sidebar-border': '--alpha(var(--color-black) / 6%)',
      'sidebar-ring': 'var(--color-stone-400)',
      'sidebar-shadow':
        '0 1px 2px 0 color-mix(in oklab, var(--shadow-color) 6%, transparent), 0 2px 6px -1px color-mix(in oklab, var(--shadow-color) 8%, transparent)',
    },
    status: {
      info: 'var(--color-blue-500)',
      'info-foreground': 'var(--color-blue-700)',
      success: 'var(--color-emerald-500)',
      'success-foreground': 'var(--color-emerald-700)',
      warning: 'var(--color-amber-500)',
      'warning-foreground': 'var(--color-amber-700)',
      purple: 'var(--color-violet-500)',
      'purple-foreground': 'var(--color-violet-700)',
      teal: 'var(--color-teal-500)',
      'teal-foreground': 'var(--color-teal-600)',
      'switch-track': '--alpha(var(--color-black) / 45%)',
      code: 'var(--color-white)',
      'code-foreground': 'var(--foreground)',
      'code-highlight': '--alpha(var(--color-black) / 4%)',
    },
  },
  dark: {
    primary: {
      primary: 'var(--color-stone-100)',
      'primary-foreground': 'var(--color-stone-800)',
    },
    secondary: {
      secondary: '--alpha(var(--color-white) / 4%)',
      'secondary-foreground': 'var(--color-stone-100)',
    },
    accent: {
      accent: '--alpha(var(--color-white) / 4%)',
      'accent-foreground': 'var(--color-stone-100)',
    },
    base: {
      background: 'var(--color-stone-900)',
      foreground: 'var(--color-stone-100)',
      'shadow-color': 'var(--color-black)',
    },
    card: {
      card: 'color-mix(in srgb, var(--background) 98%, var(--color-white))',
      'card-foreground': 'var(--color-stone-100)',
      'card-shadow':
        '0 1px 2px 0 color-mix(in oklab, var(--shadow-color) 25%, transparent), 0 2px 8px -2px color-mix(in oklab, var(--shadow-color) 25%, transparent)',
    },
    popover: {
      popover: 'color-mix(in srgb, var(--background) 98%, var(--color-white))',
      'popover-foreground': 'var(--color-stone-100)',
      'popover-shadow':
        '0 2px 6px -2px color-mix(in oklab, var(--shadow-color) 25%, transparent), 0 12px 24px -6px color-mix(in oklab, var(--shadow-color) 40%, transparent)',
    },
    muted: {
      muted: '--alpha(var(--color-white) / 4%)',
      'muted-foreground':
        'color-mix(in srgb, var(--color-stone-500) 80%, var(--color-white))',
    },
    destructive: {
      destructive: 'var(--color-red-600)',
      'destructive-foreground': 'var(--color-red-400)',
    },
    'border-input': {
      border: '--alpha(var(--color-white) / 6%)',
      input: '--alpha(var(--color-white) / 8%)',
      ring: 'var(--color-neutral-500)',
      'input-shadow':
        '0 1px 2px 0 color-mix(in oklab, var(--shadow-color) 25%, transparent), 0 2px 8px -2px color-mix(in oklab, var(--shadow-color) 25%, transparent)',
    },
    chart: {
      'chart-1': 'var(--color-blue-700)',
      'chart-2': 'var(--color-emerald-500)',
      'chart-3': 'var(--color-amber-500)',
      'chart-4': 'var(--color-purple-500)',
      'chart-5': 'var(--color-rose-500)',
      'chart-shadow':
        '0 1px 2px 0 color-mix(in oklab, var(--shadow-color) 25%, transparent), 0 2px 8px -2px color-mix(in oklab, var(--shadow-color) 25%, transparent)',
    },
    sidebar: {
      sidebar: 'var(--color-stone-950)',
      'sidebar-foreground': 'var(--color-stone-100)',
      'sidebar-primary': 'var(--color-stone-100)',
      'sidebar-primary-foreground': 'var(--color-stone-800)',
      'sidebar-accent': 'var(--color-stone-900)',
      'sidebar-accent-foreground': 'var(--color-stone-100)',
      'sidebar-border': '--alpha(var(--color-white) / 5%)',
      'sidebar-ring': 'var(--color-stone-400)',
      'sidebar-shadow':
        '0 1px 2px 0 color-mix(in oklab, var(--shadow-color) 40%, transparent), 0 4px 12px -2px color-mix(in oklab, var(--shadow-color) 40%, transparent)',
    },
    status: {
      info: 'var(--color-blue-500)',
      'info-foreground': 'var(--color-blue-400)',
      success: 'var(--color-emerald-500)',
      'success-foreground': 'var(--color-emerald-400)',
      warning: 'var(--color-amber-500)',
      'warning-foreground': 'var(--color-amber-400)',
      purple: 'var(--color-violet-500)',
      'purple-foreground': 'var(--color-violet-400)',
      teal: 'var(--color-teal-500)',
      'teal-foreground': 'var(--color-teal-500)',
      'switch-track': '--alpha(var(--color-white) / 38%)',
      code: 'color-mix(in srgb, var(--background) 98%, var(--color-white))',
      'code-foreground': 'var(--foreground)',
      'code-highlight': '--alpha(var(--color-white) / 4%)',
    },
  },
} satisfies ThemePreset
