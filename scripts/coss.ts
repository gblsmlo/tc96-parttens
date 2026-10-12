import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

export {
  type CossRegistryItem,
  fetchItem,
  itemContent,
  normalizeImports,
} from '../packages/registry/src/coss'

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

export function sha256(content: string) {
  return `sha256-${createHash('sha256').update(content).digest('hex')}`
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
