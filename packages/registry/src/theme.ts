import { existsSync, readdirSync } from 'node:fs'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type { ThemeRegistryItem } from '@tc96/themes'

export type ThemePlan = {
  themePath: string
  themeCss: string
  themeStatus: 'create' | 'unchanged' | 'conflict'
  stylesheetPath: string
  stylesheet: string
  stylesheetChanged: boolean
  replaced?: { name: string; path: string }
}

const installedImport =
  /^@import\s+["']\.\/themes\/([a-z0-9-]+)\.css["'];[^\n]*\n?/m
const tailwindImport = /^@import\s+["']tailwindcss["'][^\n]*\n/m

/** The theme the stylesheet imports from its themes folder, if any. */
export function installedTheme(stylesheet: string): string | undefined {
  return stylesheet.match(installedImport)?.[1]
}

const fontsImport = (href: string) => `@import url("${href}");\n`

/**
 * The stylesheet with only the given theme imported: the theme after the
 * Tailwind import and its web fonts first, since CSS ignores an `@import`
 * placed after other rules. The previous theme's two lines are removed.
 */
export function withTheme(
  stylesheet: string,
  theme: ThemeRegistryItem,
  previous?: ThemeRegistryItem,
): string {
  let css = stylesheet.replace(installedImport, '')
  if (previous?.fontsHref)
    css = css.replace(fontsImport(previous.fontsHref), '')
  const themeImport = `@import "./themes/${theme.name}.css";\n`
  const tailwind = css.match(tailwindImport)
  css = tailwind
    ? css.replace(tailwind[0], `${tailwind[0]}${themeImport}`)
    : `${themeImport}${css}`
  if (theme.fontsHref && !css.includes(fontsImport(theme.fontsHref)))
    css = `${fontsImport(theme.fontsHref)}${css}`
  return css
}

/** The names of the themes the registry ships. */
export function themeNames(registryDirectory: string) {
  const directory = join(registryDirectory, 'themes')
  if (!existsSync(directory)) return []
  return readdirSync(directory)
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.slice(0, -'.json'.length))
    .sort()
}

/** Reads one theme from the registry, naming the available ones when it is missing. */
export async function readTheme(registryDirectory: string, name: string) {
  const path = join(registryDirectory, 'themes', `${name}.json`)
  if (!existsSync(path))
    throw new Error(
      `Unknown theme: ${name}. Themes: ${themeNames(registryDirectory).join(' ')}`,
    )
  return JSON.parse(await readFile(path, 'utf8')) as ThemeRegistryItem
}

/** What installing the theme writes, without writing it. */
export async function planTheme(
  registryDirectory: string,
  stylesheetPath: string,
  theme: ThemeRegistryItem,
): Promise<ThemePlan> {
  const current = await readFile(stylesheetPath, 'utf8')
  const previousName = installedTheme(current)
  const previous =
    previousName && previousName !== theme.name
      ? await readTheme(registryDirectory, previousName).catch(() => undefined)
      : undefined
  const stylesheet = withTheme(current, theme, previous)
  const themesDirectory = join(dirname(stylesheetPath), 'themes')
  const themePath = join(themesDirectory, `${theme.name}.css`)
  const existing = existsSync(themePath)
    ? await readFile(themePath, 'utf8')
    : undefined
  return {
    themePath,
    themeCss: theme.css,
    themeStatus:
      existing === undefined
        ? 'create'
        : existing === theme.css
          ? 'unchanged'
          : 'conflict',
    stylesheetPath,
    stylesheet,
    stylesheetChanged: stylesheet !== current,
    ...(previousName && previousName !== theme.name
      ? {
          replaced: {
            name: previousName,
            path: join(themesDirectory, `${previousName}.css`),
          },
        }
      : {}),
  }
}

/** Writes the theme file and the stylesheet, and removes the replaced theme. */
export async function writeTheme(plan: ThemePlan) {
  await mkdir(dirname(plan.themePath), { recursive: true })
  if (plan.themeStatus !== 'unchanged')
    await writeFile(plan.themePath, plan.themeCss)
  if (plan.stylesheetChanged)
    await writeFile(plan.stylesheetPath, plan.stylesheet)
  if (plan.replaced) await rm(plan.replaced.path, { force: true })
}
