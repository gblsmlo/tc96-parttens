import { expect, test } from 'bun:test'
import { googleFontsHref } from './google-fonts'
import { fontStack, webFonts } from './stacks'

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
    webFonts(['Inter, sans-serif', 'Georgia, serif', 'Inter, monospace']),
  ).toEqual(['Inter'])
  expect(googleFontsHref(['Source Serif 4'])).toBe(
    'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;500;600;700&display=swap',
  )
})
