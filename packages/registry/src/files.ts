import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import type { RegistryFile } from './manifest'

export interface PlannedFile {
  path: string
  content: string
  status: 'create' | 'unchanged' | 'conflict'
  current?: string
}

export function targetPath(workspace: string, target: string | undefined) {
  if (!target?.startsWith('~/'))
    throw new Error(`Invalid registry target: ${target ?? 'missing'}`)
  return resolve(workspace, target.slice(2))
}

export async function planFiles(
  workspace: string,
  files: RegistryFile[],
): Promise<PlannedFile[]> {
  return Promise.all(
    files.map(async (file) => {
      const path = targetPath(workspace, file.target)
      if (!existsSync(path))
        return { path, content: file.content, status: 'create' as const }
      const current = await readFile(path, 'utf8')
      return {
        path,
        content: file.content,
        current,
        status: current === file.content ? 'unchanged' : 'conflict',
      }
    }),
  )
}

/**
 * Creates the missing files. A file that differs is kept unless confirm
 * approves overwriting it; without confirm, every one is kept.
 */
export async function writeFiles(
  planned: PlannedFile[],
  confirm?: (path: string) => Promise<boolean>,
) {
  const written: string[] = []
  const preserved: string[] = []
  for (const file of planned) {
    if (file.status === 'unchanged') continue
    if (file.status === 'conflict' && !(await confirm?.(file.path))) {
      preserved.push(file.path)
      continue
    }
    await mkdir(dirname(file.path), { recursive: true })
    await writeFile(file.path, file.content)
    written.push(file.path)
  }
  return { written, preserved }
}

/** Line diff from before to after, with context lines around each change. */
export function diffLines(before: string, after: string, context = 2) {
  const a = before.split('\n')
  const b = after.split('\n')
  const common = Array.from(
    { length: a.length + 1 },
    () => new Uint32Array(b.length + 1),
  )
  const at = (i: number, j: number) => common[i]?.[j] ?? 0
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      (common[i] as Uint32Array)[j] =
        a[i] === b[j]
          ? at(i + 1, j + 1) + 1
          : Math.max(at(i + 1, j), at(i, j + 1))
  const lines: string[] = []
  let i = 0
  let j = 0
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      lines.push(` ${a[i++]}`)
      j++
    } else if (j >= b.length || (i < a.length && at(i + 1, j) >= at(i, j + 1)))
      lines.push(`-${a[i++]}`)
    else lines.push(`+${b[j++]}`)
  }
  const changed = lines.map((line) => !line.startsWith(' '))
  const output: string[] = []
  let skipped = false
  lines.forEach((line, index) => {
    const near = changed
      .slice(Math.max(0, index - context), index + context + 1)
      .some(Boolean)
    if (near) {
      if (skipped && output.length) output.push('@@')
      output.push(line)
      skipped = false
    } else skipped = true
  })
  return output.join('\n')
}
