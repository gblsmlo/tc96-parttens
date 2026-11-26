import { colorTokens } from '../schema/tokens'

const radiusScale: [string, string][] = [
  ['sm', 'calc(var(--radius) - 4px)'],
  ['md', 'calc(var(--radius) - 2px)'],
  ['lg', 'var(--radius)'],
  ['xl', 'calc(var(--radius) + 4px)'],
  ['2xl', 'calc(var(--radius) * 1.8)'],
  ['3xl', 'calc(var(--radius) * 2.2)'],
  ['4xl', 'calc(var(--radius) * 2.6)'],
]

const utilityTokens = colorTokens.filter((token) => token !== 'switch-track')

/** The `@theme inline` block that turns the theme tokens into Tailwind utilities. */
export function tailwindThemeCss(): string {
  const entries = [
    ...utilityTokens.map((token) => `  --color-${token}: var(--${token});`),
    ...radiusScale.map(([size, value]) => `  --radius-${size}: ${value};`),
  ]
  return `@theme inline {\n${entries.join('\n')}\n}`
}
