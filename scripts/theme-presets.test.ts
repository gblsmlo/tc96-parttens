import { expect, test } from 'bun:test'
import {
  fontStack,
  googleFontsHref,
  presetCss,
  type TweakcnItem,
  webFonts,
} from './theme-presets'

const colors = Object.fromEntries(
  [
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
    'destructive-foreground',
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
  ].map((token) => [token, 'oklch(0.5 0 0)']),
)

const item: TweakcnItem = {
  name: 'paper',
  title: 'Paper',
  cssVars: {
    theme: {
      'font-sans': 'Inter, sans-serif',
      'font-serif': 'Source Serif 4, serif',
      'font-mono': 'monospace',
      radius: '0.25rem',
    },
    light: {
      ...colors,
      'destructive-foreground': 'oklch(1 0 0)',
      'font-sans': 'Montserrat, sans-serif',
      radius: '0.25rem',
      'letter-spacing': '0.025em',
    },
    dark: { ...colors, 'letter-spacing': '0.025em' },
  },
}

test('quotes multi-word families and falls back to the default stack', () => {
  expect(fontStack('Source Serif 4, serif')).toBe(
    '"Source Serif 4", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  )
  expect(fontStack('"Oxanium", sans-serif')).toBe(
    'Oxanium, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  )
  expect(fontStack('monospace')).toBe(
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  )
})

test('lists only the first family of each stack that is not a system font', () => {
  expect(
    webFonts({
      'font-sans': 'Inter, sans-serif',
      'font-serif': 'Georgia, serif',
      'font-mono': 'Inter, monospace',
    }),
  ).toEqual(['Inter'])
  expect(googleFontsHref(['Source Serif 4'])).toBe(
    'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500;600;700&display=swap',
  )
})

test('writes a preset with shared fonts and COSS tokens', () => {
  const css = presetCss(item)
  expect(css).toStartWith(
    ':root[data-theme-preset="paper"],\n[data-theme-preset="paper"] {',
  )
  expect(css).toContain(
    '.dark[data-theme-preset="paper"],\n.dark [data-theme-preset="paper"] {',
  )
  expect(css).toContain('  --font-sans: Inter, ui-sans-serif')
  expect(css).not.toContain('Montserrat')
  expect(css).toContain('  --radius: 0.25rem;')
  expect(css).toContain('  letter-spacing: 0.025em;')
  expect(css).not.toContain('oklch(1 0 0)')
  expect(css).toContain('  --destructive-foreground: var(--color-red-700);')
  expect(css).toContain('  --destructive-foreground: var(--color-red-400);')
  expect(css).toContain('  --switch-track: --alpha(var(--color-black) / 45%);')
})

test('rejects a preset missing a color token', () => {
  const { ring: _, ...light } = colors
  expect(() =>
    presetCss({ ...item, cssVars: { ...item.cssVars, light } }),
  ).toThrow('paper has no light ring')
})
