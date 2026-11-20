import { describe, expect, test } from 'bun:test'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { compareTokens, sourceClassStrings } from './ui-tokens'

const ui = join(import.meta.dir, '..', 'packages', 'ui', 'src')

const components = [
  { name: 'alert', source: 'alert/alert.tsx', tokens: 'alert/TOKENS.md' },
  { name: 'menu', source: 'menu/menu.tsx', tokens: 'menu/TOKENS.md' },
  { name: 'badge', source: 'badge/badge.tsx', tokens: 'badge/TOKENS.md' },
]

describe.each(components)('$name TOKENS.md', ({ source, tokens }) => {
  const load = async () => ({
    markdown: await readFile(join(ui, tokens), 'utf8'),
    tsx: await readFile(join(ui, source), 'utf8'),
  })

  test('holds exactly the classes of the component', async () => {
    const { markdown, tsx } = await load()
    expect(compareTokens(markdown, tsx)).toEqual([])
  })

  test('fails when a class is added to the source only', async () => {
    const { markdown, tsx } = await load()
    const [first] = sourceClassStrings(tsx)
    if (!first) throw new Error('no class string found')
    const changed = tsx.replace(`"${first}"`, `"${first} tracking-tight"`)
    expect(compareTokens(markdown, changed)).not.toEqual([])
  })

  test('fails when a class is removed from TOKENS.md only', async () => {
    const { markdown, tsx } = await load()
    const parts = markdown.indexOf('## Parts')
    const row = markdown.slice(parts).match(/^\| `[^`]+` \| `(\S+) /m)
    if (!row?.[1]) throw new Error('no table row found')
    const changed =
      markdown.slice(0, parts) +
      markdown.slice(parts).replace(`\`${row[1]} `, '`')
    expect(compareTokens(changed, tsx)).not.toEqual([])
  })
})
