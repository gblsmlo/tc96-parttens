import { googleFontsHref } from '../fonts/google-fonts'
import type { ResolvedThemePreset } from '../schema/theme'
import { colorEntries } from './resolve'

export type ThemeScope = 'root' | 'preset'

const zeroSpacing = new Set(['0', '0em', '0rem', '0px', 'normal'])

const selectors = (name: string, scope: ThemeScope, isDefault: boolean) => {
  if (scope === 'root') return { light: ':root', dark: '.dark' }
  const attribute = `[data-theme-preset="${name}"]`
  return isDefault
    ? { light: `:root,\n${attribute}`, dark: `.dark,\n.dark ${attribute}` }
    : {
        light: `:root${attribute},\n${attribute}`,
        dark: `.dark${attribute},\n.dark ${attribute}`,
      }
}

const rule = (selector: string, entries: [string, string][]) =>
  `${selector} {\n${entries.map(([property, value]) => `  ${property}: ${value};`).join('\n')}\n}`

const sharedEntries = ({ typography, other }: ResolvedThemePreset) => {
  const entries: [string, string][] = []
  if (other.radius) entries.push(['--radius', other.radius])
  for (const token of [
    'font-sans',
    'font-serif',
    'font-mono',
    'font-heading',
  ] as const) {
    const value = typography[token]
    if (value) entries.push([`--${token}`, value])
  }
  entries.push(['font-family', 'var(--font-sans)'])
  const spacing = typography['letter-spacing']
  if (spacing && !zeroSpacing.has(spacing))
    entries.push(['letter-spacing', spacing])
  return entries
}

const tokenEntries = (colors: ResolvedThemePreset['light']) =>
  colorEntries(colors).map(([token, value]): [string, string] => [
    `--${token}`,
    value,
  ])

/** The light and dark rules of a preset, under `:root` or its `data-theme-preset`. */
export function presetCss(
  preset: ResolvedThemePreset,
  scope: ThemeScope,
  isDefault = false,
): string {
  const selector = selectors(preset.name, scope, isDefault)
  return [
    rule(selector.light, [
      ...sharedEntries(preset),
      ...tokenEntries(preset.light),
    ]),
    rule(selector.dark, tokenEntries(preset.dark)),
  ].join('\n\n')
}

/** The Google Fonts stylesheet a preset loads, when it names a web font. */
export function presetFontsHref({ fonts }: { fonts?: string[] }) {
  return fonts?.length ? googleFontsHref(fonts) : undefined
}
