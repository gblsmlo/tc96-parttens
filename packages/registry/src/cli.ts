import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { checkCompatibility } from './check-compatibility'
import { readInstallConfig } from './config'
import {
  combineItems,
  prepareItem,
  type RegistryItem,
  selectPatterns,
} from './manifest'

const help = `tc96-parttens add <patterns...> [--cwd path] [--dry-run] [--diff] [--view]\nPatterns: collection-views properties detail-sheet editable\nReads aliases ui, utils, elements and patterns from components.json.\nExisting files are preserved unless you approve shadcn's overwrite prompt.\n`
function targetPath(workspace: string, target: string | undefined) {
  if (!target?.startsWith('~/'))
    throw new Error(`Invalid registry target: ${target ?? 'missing'}`)
  return resolve(workspace, target.slice(2))
}
async function main() {
  const args = process.argv.slice(2)
  if (!args.length || args.includes('--help') || args.includes('-h')) {
    console.log(help)
    return
  }
  if (args.shift() !== 'add') throw new Error(help)
  let cwd = process.cwd()
  let registryDirectory = join(
    dirname(fileURLToPath(import.meta.url)),
    'registry',
  )
  const names: string[] = []
  const flags: string[] = []
  let preserveExisting = !process.stdin.isTTY
  for (let i = 0; i < args.length; i++) {
    const argument = args[i]
    if (!argument) throw new Error('Missing argument')
    if (['--cwd', '--registry-dir'].includes(argument)) {
      const value = args[++i]
      if (!value || value.startsWith('--'))
        throw new Error(`Missing value for ${argument}`)
      if (argument === '--cwd') cwd = resolve(value)
      else registryDirectory = resolve(value)
    } else if (argument === '--preserve-existing') preserveExisting = true
    else if (['--dry-run', '--diff', '--view', '--yes'].includes(argument))
      flags.push(argument)
    else if (argument.startsWith('-'))
      throw new Error(`Unsupported option: ${argument}`)
    else names.push(argument)
  }
  const selected = selectPatterns(names)
  const configuration = await readInstallConfig(cwd)
  const items = await Promise.all(
    selected.map(
      async (name) =>
        JSON.parse(
          await readFile(join(registryDirectory, `${name}.json`), 'utf8'),
        ) as RegistryItem,
    ),
  )
  const item = prepareItem(combineItems(items), configuration)
  const workspace = await realpath(cwd)
  for (const file of item.files) {
    let ancestor = targetPath(workspace, file.target)
    while (!existsSync(ancestor)) ancestor = dirname(ancestor)
    const location = relative(workspace, await realpath(ancestor))
    if (
      location.startsWith('..') ||
      resolve(workspace, location) === dirname(workspace)
    )
      throw new Error(`Target escapes the consumer workspace: ${file.target}`)
  }
  const preview = flags.some((flag) =>
    ['--dry-run', '--diff', '--view'].includes(flag),
  )
  const before = await checkCompatibility(workspace, item)
  console.log(
    `Compatibility: ${before.status}. ${before.existingFiles.length} existing files; no automatic overwrite.`,
  )
  for (const diagnostic of before.diagnostics.slice(0, 12))
    console.log(diagnostic)
  const temporary = await mkdtemp(join(tmpdir(), 'tc96-registry-'))
  try {
    const manifest = join(temporary, 'selected.json')
    const installation =
      preserveExisting && !preview
        ? {
            ...item,
            files: item.files.filter(
              (file) => !existsSync(targetPath(workspace, file.target)),
            ),
          }
        : item
    if (installation.files.length === 0 && !preview) {
      console.log('All selected files already exist; preserving them.')
    }
    await writeFile(manifest, JSON.stringify(installation, null, 2))
    const require = createRequire(import.meta.url)
    const shadcn = require.resolve('shadcn')
    const result = spawnSync(
      process.execPath,
      [shadcn, 'add', manifest, '--cwd', workspace, ...flags],
      { stdio: 'inherit' },
    )
    if (result.status !== 0)
      throw new Error(
        `shadcn installation failed (${result.status ?? result.signal}).`,
      )
    if (!preview) {
      const missing = item.files.filter(
        (file) => !existsSync(targetPath(workspace, file.target)),
      )
      if (missing.length)
        throw new Error(
          `Installation incomplete: ${missing.map((file) => file.target).join(', ')}`,
        )
      const after = await checkCompatibility(workspace, item, true)
      console.log(`Installed TypeScript compatibility: ${after.status}.`)
      if (after.status !== 'compatible') {
        for (const diagnostic of after.diagnostics.slice(0, 20))
          console.error(diagnostic)
        throw new Error(
          'Installation requires consumer fixes; see diagnostics above. Preserved files were not overwritten automatically.',
        )
      }
      console.log(
        `Installed: ${selected.join(', ')}. Visual and behavioral compatibility still require consumer validation.`,
      )
    }
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
