import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { aggregateBarrel, writeBarrel } from './barrel'
import { checkCompatibility } from './check-compatibility'
import { findProjectRoot, readInstallConfig } from './config'
import {
  combineItems,
  omitInstalled,
  patternNames,
  prepareItem,
  type RegistryItem,
  selectPatterns,
} from './manifest'

const help = `tc96-parttens add <patterns...> [--cwd path] [--dry-run] [--diff] [--view] [--force]\nPatterns: ${patternNames.join(' ')}\nReads aliases ui and utils from the nearest components.json, searching from --cwd up to the filesystem root. elements, helpers and patterns default to the ui alias's siblings (@acme/ui gives @acme/elements) unless set.\nInstalls from @coss only the COSS components missing from the ui alias.\nStops before installing when the patterns do not type-check against your components, in a dry run too; --force installs anyway.\nExisting files are preserved unless you approve shadcn's overwrite prompt.\nWrites index.ts at the patterns path, exporting every installed pattern.\n`
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
  let force = false
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
    else if (argument === '--force') force = true
    else if (['--dry-run', '--diff', '--view', '--yes'].includes(argument))
      flags.push(argument)
    else if (argument.startsWith('-'))
      throw new Error(`Unsupported option: ${argument}`)
    else names.push(argument)
  }
  cwd = findProjectRoot(cwd)
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
  const workspace = await realpath(cwd)
  const item = omitInstalled(
    prepareItem(combineItems(items), configuration),
    (component) =>
      existsSync(join(workspace, configuration.paths.ui, `${component}.tsx`)),
  )
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
  // The barrel exports what is installed after this run: earlier patterns on
  // disk plus the files about to be written.
  const barrelPath = join(workspace, configuration.paths.patterns, 'index.ts')
  const targets = new Set(
    item.files.map((file) => targetPath(workspace, file.target)),
  )
  const aggregate = JSON.parse(
    await readFile(join(registryDirectory, 'aggregate.json'), 'utf8'),
  ) as { content: string }
  const barrel = aggregateBarrel(aggregate.content, (specifier) =>
    ['.ts', '.tsx'].some((extension) => {
      const file = resolve(dirname(barrelPath), specifier + extension)
      return targets.has(file) || existsSync(file)
    }),
  )
  const preview = flags.some((flag) =>
    ['--dry-run', '--diff', '--view'].includes(flag),
  )
  const before = await checkCompatibility(workspace, item)
  console.log(
    `Compatibility: ${before.status}. ${before.existingFiles.length} existing files; no automatic overwrite.`,
  )
  const hidden = new Set([...before.pending, ...before.deferred])
  for (const diagnostic of before.diagnostics
    .filter((line) => !hidden.has(line))
    .slice(0, 12))
    console.log(diagnostic)
  if (before.pending.length)
    console.log(
      `${before.pending.length} dependencies are not installed yet, so ${before.deferred.length} diagnostics about them were hidden; their types are checked after installation:\n${before.pending.map((line) => `  ${line.split(' ')[0]}`).join('\n')}`,
    )
  else if (before.deferred.length)
    console.log(
      `${before.deferred.length} diagnostics about modules that are not installed yet were hidden; they are checked after installation.`,
    )
  if (before.status === 'incompatible') {
    if (!force)
      throw new Error(
        'The patterns do not type-check against your components, so nothing was installed. Fix the diagnostics above or pass --force to install anyway.',
      )
    console.warn('Incompatible, installing anyway because of --force.')
  }
  console.log(
    item.registryDependencies?.length
      ? `Missing COSS components, installed by shadcn: ${item.registryDependencies.join(', ')}.`
      : 'Every COSS component the patterns use is already installed; keeping yours.',
  )
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
    if (preview)
      console.log(
        `${relative(workspace, barrelPath)}, written after installation unless the consumer wrote that file:\n${barrel}`,
      )
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
      const barrelFile = relative(workspace, barrelPath)
      console.log(
        (await writeBarrel(barrelPath, barrel)) === 'preserved'
          ? `${barrelFile} was not generated by tc96-parttens and was preserved; export the installed patterns from it yourself.`
          : `${barrelFile} exports the installed patterns.`,
      )
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
