import { expect, test } from 'bun:test'
import { claude } from '../presets/claude'
import { stone } from '../presets/stone'
import { twincan } from '../presets/twincan'
import { presetCss } from './css'
import { resolvePreset } from './resolve'
import { presetsCss, themeRegistryItem } from './themes'

test('scopes a preset to its data-theme-preset, twincan also to :root', () => {
  const css = presetsCss([twincan, stone], twincan)
  expect(css).toStartWith(':root,\n[data-theme-preset="twincan"] {')
  expect(css).toContain('.dark,\n.dark [data-theme-preset="twincan"] {')
  expect(css).toContain(
    ':root[data-theme-preset="stone"],\n[data-theme-preset="stone"] {',
  )
  expect(css).toContain(
    '.dark[data-theme-preset="stone"],\n.dark [data-theme-preset="stone"] {',
  )
})

test('fills the tokens a preset leaves out from the base', () => {
  const resolved = resolvePreset(claude, twincan)
  expect(resolved.light.status.info).toBe(twincan.light.status?.info)
  expect(resolved.light.status.code).toBe('var(--card)')
  expect(resolved.dark.destructive['destructive-foreground']).toBe(
    'var(--color-red-400)',
  )
  expect(resolved.typography['font-heading']).toBe('var(--font-sans)')
})

test('writes letter-spacing as a property only when it is not zero', () => {
  const spaced = { ...claude, typography: { 'letter-spacing': '0.025em' } }
  expect(presetCss(resolvePreset(spaced, twincan), 'root')).toContain(
    '  letter-spacing: 0.025em;',
  )
  const zero = { ...claude, typography: { 'letter-spacing': '0em' } }
  expect(presetCss(resolvePreset(zero, twincan), 'root')).not.toContain(
    'letter-spacing',
  )
})

test('installs a preset as the only theme, under :root and .dark', () => {
  const item = themeRegistryItem(claude, twincan)
  expect(item.css).toContain(
    '@theme inline {\n  --color-primary: var(--primary);',
  )
  expect(item.css).toContain('\n:root {\n  --radius: 0.5rem;')
  expect(item.css).toContain('\n.dark {\n')
  expect(item.css).toContain('  --info: var(--color-blue-500);')
  expect(item.css).not.toContain('data-theme-preset')
  expect(item.css).not.toContain('--color-switch-track')
})

test('installs the surface shadows as tokens, not as Tailwind theme values', () => {
  const item = themeRegistryItem(claude, twincan)
  expect(item.css).not.toContain('--shadow-card')
  expect(item.css).toContain('  --shadow-color: var(--color-stone-950);')
  expect(item.css).toContain('  --shadow-color: var(--color-black);')
  expect(item.css).toMatch(/--card-shadow: [^;]*var\(--shadow-color\)/)
})
