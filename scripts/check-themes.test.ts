import { expect, test } from 'bun:test'
import {
  checkCode,
  checkTheme,
  parseCss,
  type ThemeFile,
  themeContract,
} from './check-themes'

const styles = `
@theme inline {
  --color-card: var(--card);
  --color-surface: var(--surface);
  --radius-lg: var(--radius);
  --radius-card: var(--card-radius);
}

:root,
[data-theme-preset="default"] {
  --radius: 0.625rem;
  --card-radius: var(--radius);
  --background: white;
  --card: white;
  --surface: color-mix(in oklab, var(--card) 40%, transparent);
  font-family: var(--font-sans);
}

.dark,
.dark [data-theme-preset="default"] {
  --background: black;
  --card: black;
  --surface: color-mix(in oklab, var(--card) 40%, transparent);
}

@layer base {
  body {
    @apply bg-background;
  }
}
`

const theme = (...extra: string[]): ThemeFile[] => [
  { path: 'styles.css', rules: parseCss([styles, ...extra].join('\n')) },
]

test('reads the contract from @theme inline, colors apart from shared tokens', () => {
  const { color, shared } = themeContract(theme())
  expect([...color]).toEqual(['--card', '--surface'])
  expect([...shared]).toEqual(['--radius', '--card-radius'])
})

test('accepts a theme that declares the whole contract in light and dark', () => {
  expect(checkTheme(theme())).toEqual([])
})

test('accepts a scoped rule that remaps a token', () => {
  expect(
    checkTheme(theme('[data-slot="switch"] { --card: var(--surface); }')),
  ).toEqual([])
})

test('rejects selectors in @layer utilities', () => {
  expect(
    checkTheme(
      theme(`@layer utilities {
  [data-slot="card"] { border-radius: var(--card-radius); }
}`),
    ),
  ).toEqual([
    'styles.css: @layer utilities overrides utilities by source order; declare a token in :root and .dark and map it in @theme inline',
  ])
})

test('rejects @utility in the theme', () => {
  expect(
    checkTheme(theme('@utility surface { background: red; }'))[0],
  ).toContain('declares a utility')
})

test('rejects a scoped rule that sets a property or an unknown variable', () => {
  expect(
    checkTheme(
      theme('[data-slot="list-view"] { border-radius: 0; --frame: red; }'),
    ),
  ).toEqual([
    'styles.css: [data-slot="list-view"] sets border-radius; outside @layer base a theme rule only declares tokens',
    'styles.css: [data-slot="list-view"] sets --frame, which is not a theme token; a scoped rule only remaps tokens @theme inline reads',
  ])
})

test('rejects a dark block missing a color token', () => {
  const source = styles.replace(
    '  --surface: color-mix(in oklab, var(--card) 40%, transparent);\n}',
    '}',
  )
  expect(checkTheme([{ path: 'styles.css', rules: parseCss(source) }])).toEqual(
    [
      'styles.css: .dark, .dark [data-theme-preset="default"] does not declare --surface, which @theme inline reads; every dark theme block declares the whole contract',
    ],
  )
})

test('rejects a preset that misses a token the default declares', () => {
  const preset = `:root[data-theme-preset="paper"],
[data-theme-preset="paper"] {
  --radius: 0.25rem;
  --background: white;
  --card: white;
}`
  expect(checkTheme(theme(preset))).toEqual([
    'styles.css: :root[data-theme-preset="paper"], [data-theme-preset="paper"] does not declare --surface, which @theme inline reads; every light theme block declares the whole contract',
    'styles.css: :root[data-theme-preset="paper"], [data-theme-preset="paper"] does not declare --card-radius, which @theme inline reads; every light theme block declares the whole contract',
  ])
})

test('rejects a token read by a theme block that nobody declares', () => {
  expect(
    checkTheme(theme('[data-slot="alert"] { --card: var(--success); }')),
  ).toEqual([
    'styles.css: [data-slot="alert"] reads --success, which no theme block declares',
  ])
})

test('rejects code that reads a variable nobody declares or assigns', () => {
  expect(
    checkCode(theme(), [
      {
        path: 'checklist.ts',
        source: `const row = 'first:rounded-t-[calc(var(--card-surface-radius)-1px)]'
const card = 'rounded-[calc(var(--card-radius)-1px)]'
const shell = '[--shell:var(--card-radius)] p-[var(--shell)] w-(--anchor-width) gap-[var(--spacing)]'`,
      },
    ]),
  ).toEqual([
    'checklist.ts:1: reads --card-surface-radius, which no theme block declares and no code assigns',
  ])
})
