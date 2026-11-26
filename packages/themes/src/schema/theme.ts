import type {
  ColorGroup,
  colorGroups,
  surfaceShadows,
  TypographyToken,
} from './tokens'

type Group<G extends ColorGroup> = Record<
  (typeof colorGroups)[G][number],
  string
>

type Shadow<G extends keyof typeof surfaceShadows> = Partial<
  Record<(typeof surfaceShadows)[G], string>
>

export type ThemeColors = {
  primary: Group<'primary'>
  secondary: Group<'secondary'>
  accent: Group<'accent'>
  base: Group<'base'> & Partial<Record<'shadow-color', string>>
  card: Group<'card'> & Shadow<'card'>
  popover: Group<'popover'> & Shadow<'popover'>
  muted: Group<'muted'>
  destructive: Pick<Group<'destructive'>, 'destructive'> &
    Partial<Pick<Group<'destructive'>, 'destructive-foreground'>>
  'border-input': Group<'border-input'> & Shadow<'border-input'>
  chart: Group<'chart'> & Shadow<'chart'>
  sidebar: Group<'sidebar'> & Shadow<'sidebar'>
  status?: Partial<Group<'status'>>
}

export type ThemeTypography = Partial<Record<TypographyToken, string>>

export type ThemeOther = { radius?: string }

export type ThemeSource = 'tc96' | 'tweakcn'

export type ThemePreset = {
  name: string
  title: string
  source: ThemeSource
  fonts?: string[]
  typography?: ThemeTypography
  other?: ThemeOther
  light: ThemeColors
  dark: ThemeColors
}

export type ResolvedThemePreset = Omit<
  ThemePreset,
  'typography' | 'other' | 'light' | 'dark'
> & {
  typography: ThemeTypography
  other: ThemeOther
  light: Required<ThemeColors>
  dark: Required<ThemeColors>
}
