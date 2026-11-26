export const colorGroups = {
  primary: ['primary', 'primary-foreground'],
  secondary: ['secondary', 'secondary-foreground'],
  accent: ['accent', 'accent-foreground'],
  base: ['background', 'foreground'],
  card: ['card', 'card-foreground'],
  popover: ['popover', 'popover-foreground'],
  muted: ['muted', 'muted-foreground'],
  destructive: ['destructive', 'destructive-foreground'],
  'border-input': ['border', 'input', 'ring'],
  chart: ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'],
  sidebar: [
    'sidebar',
    'sidebar-foreground',
    'sidebar-primary',
    'sidebar-primary-foreground',
    'sidebar-accent',
    'sidebar-accent-foreground',
    'sidebar-border',
    'sidebar-ring',
  ],
  status: [
    'info',
    'info-foreground',
    'success',
    'success-foreground',
    'warning',
    'warning-foreground',
    'purple',
    'purple-foreground',
    'teal',
    'teal-foreground',
    'switch-track',
    'code',
    'code-foreground',
    'code-highlight',
  ],
} as const

export const surfaceShadows = {
  card: 'card-shadow',
  popover: 'popover-shadow',
  'border-input': 'input-shadow',
  sidebar: 'sidebar-shadow',
  chart: 'chart-shadow',
} as const

export type ShadowToken = (typeof surfaceShadows)[keyof typeof surfaceShadows]

export const shadowTokens = Object.values(surfaceShadows) as ShadowToken[]

export const typographyTokens = [
  'font-sans',
  'font-serif',
  'font-mono',
  'font-heading',
  'letter-spacing',
] as const

export const otherTokens = ['radius'] as const

export type ColorGroup = keyof typeof colorGroups
export type ColorToken = (typeof colorGroups)[ColorGroup][number]
export type TypographyToken = (typeof typographyTokens)[number]
export type OtherToken = (typeof otherTokens)[number]

export const colorGroupNames = Object.keys(colorGroups) as ColorGroup[]

export const colorTokens = colorGroupNames.flatMap(
  (group) => colorGroups[group],
) as ColorToken[]
