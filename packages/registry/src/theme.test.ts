import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { ThemeRegistryItem } from '@tc96/themes'
import { installedTheme, withTheme } from './theme'

const claude: ThemeRegistryItem = {
  name: 'claude',
  title: 'Claude',
  source: 'tweakcn',
  fontsHref: 'https://fonts.googleapis.com/css2?family=Inter&display=swap',
  css: ':root {\n  --radius: 0.5rem;\n}\n',
}
const stone: ThemeRegistryItem = {
  name: 'stone',
  title: 'Stone',
  source: 'tc96',
  css: ':root {\n  --radius: 0.625rem;\n}\n',
}
const stylesheet =
  '@import "tailwindcss";\n\n@theme {\n  --font-heading: serif;\n}\n'

test('imports the theme after Tailwind and its web fonts first', () => {
  expect(withTheme(stylesheet, claude)).toBe(
    `@import url("${claude.fontsHref}");\n@import "tailwindcss";\n@import "./themes/claude.css";\n\n@theme {\n  --font-heading: serif;\n}\n`,
  )
})

test('replaces the installed theme and its web fonts', () => {
  const installed = withTheme(stylesheet, claude)
  expect(installedTheme(installed)).toBe('claude')
  const replaced = withTheme(installed, stone, claude)
  expect(replaced).toBe(
    '@import "tailwindcss";\n@import "./themes/stone.css";\n\n@theme {\n  --font-heading: serif;\n}\n',
  )
  expect(withTheme(replaced, stone)).toBe(replaced)
})

async function consumer() {
  const root = await mkdtemp(join(tmpdir(), 'tc96-theme-'))
  const registry = join(root, 'registry')
  await mkdir(join(registry, 'themes'), { recursive: true })
  for (const item of [claude, stone])
    await writeFile(
      join(registry, 'themes', `${item.name}.json`),
      JSON.stringify(item),
    )
  await mkdir(join(root, 'src'))
  await writeFile(join(root, 'src/styles.css'), stylesheet)
  await writeFile(
    join(root, 'components.json'),
    JSON.stringify({ tailwind: { css: 'src/styles.css' } }),
  )
  return { root, registry }
}

const addTheme = (root: string, registry: string, ...args: string[]) =>
  spawnSync(
    process.execPath,
    [
      join(import.meta.dir, 'cli.ts'),
      'add',
      '--cwd',
      root,
      '--registry-dir',
      registry,
      ...args,
    ],
    { encoding: 'utf8' },
  )

test('tc96 add --theme installs one theme and swaps it for another', async () => {
  const { root, registry } = await consumer()
  const refused = addTheme(root, registry, '--theme', 'claude')
  expect(refused.status).toBe(1)
  expect(refused.stderr).toContain('Pass --yes to apply.')
  expect(existsSync(join(root, 'src/themes/claude.css'))).toBe(false)

  expect(addTheme(root, registry, '--theme', 'claude', '--yes').status).toBe(0)
  expect(await readFile(join(root, 'src/themes/claude.css'), 'utf8')).toBe(
    claude.css,
  )
  expect(await readFile(join(root, 'src/styles.css'), 'utf8')).toContain(
    '@import "./themes/claude.css";',
  )

  expect(addTheme(root, registry, '--theme', 'stone', '--yes').status).toBe(0)
  expect(existsSync(join(root, 'src/themes/claude.css'))).toBe(false)
  const css = await readFile(join(root, 'src/styles.css'), 'utf8')
  expect(css).toContain('@import "./themes/stone.css";')
  expect(css).not.toContain('claude')
  expect(css).not.toContain('fonts.googleapis.com')
})

test('tc96 add --theme names the themes when one is unknown', async () => {
  const { root, registry } = await consumer()
  const result = addTheme(root, registry, '--theme', 'nope', '--dry-run')
  expect(result.stderr).toContain('Unknown theme: nope. Themes: claude stone')
})
