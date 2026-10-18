import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import type { CossRegistryItem } from '../packages/registry/src/coss'

export {
  type CossRegistryItem,
  fetchItem,
  normalizeImports,
} from '../packages/registry/src/coss'

export const registry = 'https://coss.com/ui/r'
export const lockPath = 'packages/ui/coss.lock.json'
export const sourceDirectory = 'packages/ui/src'

export interface CossLockItem {
  url: string
  /** sha256 of the file contents published by the registry, in path order. */
  upstream: string
  /** sha256 of the files written to packages/ui, after import normalization. */
  file: string
  /** Paths under packages/ui/src, when the item is not a single `<name>.tsx`. */
  paths?: string[]
}

export interface CossLock {
  registry: string
  items: Record<string, CossLockItem>
}

export interface CossItemFile {
  /** Path under packages/ui/src. */
  path: string
  content: string
}

export function sha256(content: string) {
  return `sha256-${createHash('sha256').update(content).digest('hex')}`
}

/** One hash for an item's files, equal to the file's own hash for one file. */
export function contentHash(contents: string[]) {
  return sha256(contents.join('\0'))
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

export function lockedPaths(name: string, locked: CossLockItem) {
  return locked.paths ?? [`${name}.tsx`]
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
