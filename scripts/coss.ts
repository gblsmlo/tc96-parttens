import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

export const registry = 'https://coss.com/ui/r'
export const lockPath = 'packages/ui/coss.lock.json'
export const sourceDirectory = 'packages/ui/src'

export interface CossLockItem {
  url: string
  /** sha256 of the file content published by the registry. */
  upstream: string
  /** sha256 of the file written to packages/ui, after import normalization. */
  file: string
}

export interface CossLock {
  registry: string
  items: Record<string, CossLockItem>
}

export interface CossRegistryItem {
  name: string
  dependencies?: string[]
  registryDependencies?: string[]
  files: { path: string; content: string }[]
}

export function sha256(content: string) {
  return `sha256-${createHash('sha256').update(content).digest('hex')}`
}

/** The only change allowed on top of COSS: its registry aliases become ours. */
export function normalizeImports(content: string) {
  return content
    .replace(
      /(["'])@\/(?:registry\/default\/)?lib\/utils\1/g,
      '$1@tc96/utils$1',
    )
    .replace(/(["'])@\/registry\/default\/ui\/([^"']+)\1/g, '$1@tc96/ui/$2$1')
}

export async function readLock(root = '.'): Promise<CossLock> {
  try {
    return JSON.parse(await readFile(`${root}/${lockPath}`, 'utf8'))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT')
      return { registry, items: {} }
    throw error
  }
}

export async function fetchItem(url: string): Promise<CossRegistryItem> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  return (await response.json()) as CossRegistryItem
}

export function itemContent(item: CossRegistryItem) {
  const [file, ...rest] = item.files
  if (
    !file ||
    rest.length ||
    file.path !== `registry/default/ui/${item.name}.tsx`
  )
    throw new Error(
      `${item.name}: expected one file at registry/default/ui/${item.name}.tsx`,
    )
  return file.content
}
