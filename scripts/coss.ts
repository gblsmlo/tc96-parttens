import { readFile } from 'node:fs/promises'
import type { CossRegistryItem } from '../packages/registry/src/coss'

export {
  type CossRegistryItem,
  normalizeImports,
} from '../packages/registry/src/coss'

export async function fetchItem(url: string) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return (await response.json()) as CossRegistryItem
}

export const registry = 'https://coss.com/ui/r'
export const manifestPath = 'packages/ui/ui.manifest.json'
export const sourceDirectory = 'packages/ui/src'
export const uiDirectories = ['components', 'hooks', 'lib'] as const

/** Where a manifest path lives in the repo: hooks/ and lib/ sit beside components/. */
export function uiSourcePath(path: string, root = sourceDirectory) {
  return /^(hooks|lib)\//.test(path)
    ? `${root}/${path}`
    : `${root}/components/${path}`
}

/** The manifest path of a repo file under one of the ui directories. */
export function manifestPathOf(file: string, root = sourceDirectory) {
  const relative = file.slice(root.length + 1)
  return relative.startsWith('components/')
    ? relative.slice('components/'.length)
    : relative
}

export interface UiManifestItem {
  origin: 'coss' | 'own'
  /** Theme tokens the item declares; the CLI lists the ones a consumer lacks. */
  cssVars?: CossRegistryItem['cssVars']
  css?: CossRegistryItem['css']
  /** Manifest paths (see uiSourcePath), when the item is not a single `<name>.tsx`. */
  paths?: string[]
}

export interface UiManifest {
  items: Record<string, UiManifestItem>
}

export interface CossItemFile {
  /** Manifest path (see uiSourcePath). */
  path: string
  content: string
}

/** Mirrors the COSS install layout: `ui/` at the root, other folders kept. */
export function itemFiles(item: CossRegistryItem): CossItemFile[] {
  if (!item.files.length) throw new Error(`${item.name}: has no files`)
  return item.files
    .map(({ path, content }) => {
      const relative = path.match(/^registry\/default\/(?:ui\/)?(.+)$/)?.[1]
      if (!relative)
        throw new Error(`${item.name}: ${path} is outside registry/default`)
      return { path: relative, content }
    })
    .sort((a, b) => a.path.localeCompare(b.path))
}

export function manifestPaths(name: string, item: UiManifestItem) {
  return item.paths ?? [`${name}.tsx`]
}

export async function readManifest(root = '.'): Promise<UiManifest> {
  try {
    return JSON.parse(await readFile(`${root}/${manifestPath}`, 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return { items: {} }
    throw error
  }
}
