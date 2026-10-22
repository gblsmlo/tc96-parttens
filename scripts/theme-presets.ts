export const tweakcnRegistry = 'https://tweakcn.com/r/themes/registry.json'

type Tokens = Record<string, string>

export type TweakcnItem = {
  name: string
  title?: string
  cssVars: { theme?: Tokens; light: Tokens; dark: Tokens }
}

export type ThemePreset = {
  value: string
  title: string
  source: 'tc96' | 'coss' | 'tweakcn'
  fontsHref?: string
}

export const basePresets: ThemePreset[] = [
  { value: 'default', title: 'Default', source: 'tc96' },
  { value: 'stone', title: 'Stone', source: 'coss' },
  { value: 'neutral', title: 'Neutral', source: 'coss' },
  { value: 'slate', title: 'Slate', source: 'coss' },
  { value: 'zinc', title: 'Zinc', source: 'coss' },
]

const colorTokens = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
] as const

// COSS reads tokens tweakcn does not export, and gives destructive-foreground
// another meaning: destructive text on a surface, not text on the destructive
// fill, so tweakcn's value is dropped. These keep the default theme's values.
const cossTokens: Record<'light' | 'dark', Tokens> = {
  light: {
    'destructive-foreground': 'var(--color-red-700)',
    info: 'var(--color-blue-500)',
    'info-foreground': 'var(--color-blue-700)',
    success: 'var(--color-emerald-500)',
    'success-foreground': 'var(--color-emerald-700)',
    warning: 'var(--color-amber-500)',
    'warning-foreground': 'var(--color-amber-700)',
    'switch-track': '--alpha(var(--color-black) / 45%)',
    code: 'var(--card)',
    'code-foreground': 'var(--foreground)',
    'code-highlight': '--alpha(var(--color-black) / 4%)',
  },
  dark: {
    'destructive-foreground': 'var(--color-red-400)',
    info: 'var(--color-blue-500)',
    'info-foreground': 'var(--color-blue-400)',
    success: 'var(--color-emerald-500)',
    'success-foreground': 'var(--color-emerald-400)',
    warning: 'var(--color-amber-500)',
    'warning-foreground': 'var(--color-amber-400)',
    'switch-track': '--alpha(var(--color-white) / 38%)',
    code: 'var(--card)',
    'code-foreground': 'var(--foreground)',
    'code-highlight': '--alpha(var(--color-white) / 4%)',
  },
}

const fallbackStacks: Record<string, string[]> = {
  'sans-serif': [
    'ui-sans-serif',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'sans-serif',
  ],
  serif: [
    'ui-serif',
    'Georgia',
    'Cambria',
    'Times New Roman',
    'Times',
    'serif',
  ],
  monospace: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'monospace',
  ],
}

const localFamilies = new Set([
  ...Object.values(fallbackStacks).flat(),
  'Arial',
  'Courier New',
  'Helvetica Neue',
])

const unquotedFamily = /^-?[A-Za-z][\w-]*$/

const familiesOf = (value: string) =>
  value
    .split(',')
    .map((family) => family.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)

/**
 * Normalizes a tweakcn font stack: quotes multi-word names, which tweakcn
 * leaves bare (`Source Serif 4` is not valid CSS unquoted), and puts the
 * default theme's stack before the generic family, so a font that did not load
 * falls back to the same system font as the default theme.
 */
export function fontStack(value: string): string {
  const families = familiesOf(value)
  const index = families.findIndex((family) => family in fallbackStacks)
  const generic = index === -1 ? 'sans-serif' : (families[index] as string)
  const head = index === -1 ? families : families.slice(0, index)
  const tail = index === -1 ? [] : families.slice(index + 1)
  const stack = [
    ...new Set([...head, ...(fallbackStacks[generic] as string[]), ...tail]),
  ]
  return stack
    .map((family) => (unquotedFamily.test(family) ? family : `"${family}"`))
    .join(', ')
}

/** The Google Fonts stylesheet for the given families, regular to bold. */
export function googleFontsHref(families: string[]): string {
  const query = families
    .map(
      (family) =>
        `family=${encodeURIComponent(family).replaceAll('%20', '+')}:wght@400;500;600;700`,
    )
    .join('&')
  return `https://fonts.googleapis.com/css2?${query}&display=swap`
}

/** The web fonts a preset names first in its sans, serif and mono stacks. */
export function webFonts(tokens: Tokens): string[] {
  const fonts = ['font-sans', 'font-serif', 'font-mono']
    .map((token) => familiesOf(tokens[token] ?? '')[0])
    .filter((family): family is string => Boolean(family))
    .filter((family) => !localFamilies.has(family))
  return [...new Set(fonts)]
}

const zeroSpacing = new Set(['0', '0em', '0rem', '0px', 'normal'])

const selector = (name: string) =>
  `:root[data-theme-preset="${name}"],\n[data-theme-preset="${name}"]`

const darkSelector = (name: string) =>
  `.dark[data-theme-preset="${name}"],\n.dark [data-theme-preset="${name}"]`

const declarations = (entries: [string, string][]) =>
  entries.map(([property, value]) => `  ${property}: ${value};`).join('\n')

const modeTokens = (tokens: Tokens, mode: 'light' | 'dark', name: string) => {
  const entries: [string, string][] = colorTokens.map((token) => {
    const value = tokens[token]
    if (!value) throw new Error(`${name} has no ${mode} ${token}`)
    return [`--${token}`, value]
  })
  const extra = Object.entries(cossTokens[mode]).map(
    ([token, value]): [string, string] => [`--${token}`, value],
  )
  return [...entries, ...extra]
}

/**
 * The shared tokens of a preset. Fonts and radius come from `cssVars.theme`,
 * which tweakcn writes once for both modes; a few presets carry a different,
 * stale font in their light tokens.
 */
export function sharedTokens({ cssVars }: TweakcnItem): Tokens {
  return { ...cssVars.light, ...cssVars.theme }
}

/** The light and dark rules of one tweakcn preset. */
export function presetCss(item: TweakcnItem): string {
  const { name, cssVars } = item
  const { light, dark } = cssVars
  const shared = sharedTokens(item)
  const letterSpacing = light['letter-spacing'] ?? '0em'
  const base: [string, string][] = [
    ['--radius', shared.radius ?? '0.625rem'],
    ['--font-sans', fontStack(shared['font-sans'] ?? 'sans-serif')],
    ['--font-serif', fontStack(shared['font-serif'] ?? 'serif')],
    ['--font-mono', fontStack(shared['font-mono'] ?? 'monospace')],
    ['--font-heading', 'var(--font-sans)'],
    ['font-family', 'var(--font-sans)'],
    ...(zeroSpacing.has(letterSpacing)
      ? []
      : [['letter-spacing', letterSpacing] as [string, string]]),
  ]
  return [
    `${selector(name)} {\n${declarations([...base, ...modeTokens(light, 'light', name)])}\n}`,
    `${darkSelector(name)} {\n${declarations(modeTokens(dark, 'dark', name))}\n}`,
  ].join('\n\n')
}

/** The preset list the Storybook toolbar and a consumer's switcher read. */
export function presetsModule(presets: ThemePreset[]): string {
  return `export type ThemePreset = {
  value: string
  title: string
  source: 'tc96' | 'coss' | 'tweakcn'
  fontsHref?: string
}

export const themePresets: ThemePreset[] = ${JSON.stringify(presets, null, 2)}
`
}
