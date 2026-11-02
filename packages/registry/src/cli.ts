import { existsSync } from 'node:fs'
import { readFile, realpath } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'
import { aggregateBarrel, writeBarrel } from './barrel'
import { checkCompatibility } from './check-compatibility'
import { findProjectRoot, readInstallConfig, readStylesheet } from './config'
import {
  componentFiles,
  cossInstalledPaths,
  loadUiItem,
  missingTheme,
  resolveItems,
} from './coss'
import {
  dependencyTarget,
  detectPackageManager,
  installCommand,
  installDependencies,
  missingDependencies,
} from './dependencies'
import { diffLines, planFiles, targetPath, writeFiles } from './files'
import {
  combineItems,
  isTemplate,
  omitInstalled,
  patternNames,
  prepareItem,
  type RegistryItem,
  selectItems,
  templateNames,
} from './manifest'

const help = `tc96-parttens add <patterns or templates...> [--cwd path] [--dry-run] [--diff] [--view] [--yes] [--force]\nPatterns: ${patternNames.join(' ')}\nTemplates: ${templateNames.join(' ')}\nReads aliases ui and utils from the nearest components.json, searching from --cwd up to the filesystem root. elements, helpers, patterns and templates replace the last segment of the ui alias (@acme/ui/components gives @acme/ui/patterns, @acme/ui gives @acme/patterns) unless set; the templates path is needed only to install a template.\nInstalls only the ui components missing from the ui alias, from this package. Their theme tokens are listed, never written to your CSS.\nStops before installing when the patterns do not type-check against your components, in a dry run too; --force installs anyway.\nExisting files that differ are preserved; in a terminal the CLI asks before overwriting each one, unless --yes.\nInstalls the missing npm dependencies with the package manager of your lockfile, into the workspace package that holds the patterns path.\n--dry-run lists what would change, --view prints the new files and --diff the changes to existing ones; none of them writes.\nWrites index.ts at the patterns path, exporting every installed pattern.\n`
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
  const flags = new Set<string>()
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
    } else if (argument === '--force') force = true
    else if (
      [
        '--dry-run',
        '--diff',
        '--view',
        '--yes',
        '--preserve-existing',
      ].includes(argument)
    )
      flags.add(argument)
    else if (argument.startsWith('-'))
      throw new Error(`Unsupported option: ${argument}`)
    else names.push(argument)
  }
  cwd = findProjectRoot(cwd)
  const selected = selectItems(names)
  const configuration = await readInstallConfig(cwd, {
    templates: selected.some(isTemplate),
  })
  const stylesheetPath = await readStylesheet(cwd)
  const items = await Promise.all(
    selected.map(
      async (name) =>
        JSON.parse(
          await readFile(join(registryDirectory, `${name}.json`), 'utf8'),
        ) as RegistryItem,
    ),
  )
  const workspace = await realpath(cwd)
  const show = (path: string) => relative(workspace, path)
  // COSS utils is the consumer's cn, reached through aliases.utils.
  const installed = (component: string) =>
    component === 'utils' ||
    cossInstalledPaths(component).some((path) =>
      existsSync(join(workspace, configuration.paths.ui, path)),
    )
  const patterns = omitInstalled(
    prepareItem(combineItems(items), configuration),
    installed,
  )
  const components = await resolveItems(
    patterns.registryDependencies ?? [],
    (name) => loadUiItem(registryDirectory, name),
    installed,
  )
  const item: RegistryItem = {
    ...patterns,
    files: [
      ...components.flatMap((component) =>
        componentFiles(
          component,
          configuration.aliases,
          configuration.paths.ui,
        ),
      ),
      ...patterns.files,
    ],
    dependencies: [
      ...patterns.dependencies,
      ...components.flatMap((component) => component.dependencies ?? []),
    ],
  }
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
  // A template that uses no pattern leaves the patterns barrel alone.
  const withPatterns = item.files.some(({ path }) =>
    path.startsWith('parttens/'),
  )
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
  const preview = ['--dry-run', '--diff', '--view'].some((flag) =>
    flags.has(flag),
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
    components.length
      ? `Missing ui components, installed from this package: ${components.map((component) => component.name).join(', ')}.`
      : 'Every ui component the patterns use is already installed; keeping yours.',
  )
  const stylesheet =
    stylesheetPath && existsSync(join(workspace, stylesheetPath))
      ? await readFile(join(workspace, stylesheetPath), 'utf8')
      : undefined
  const theme = missingTheme(components, stylesheet)
  if (theme.length)
    console.warn(
      `${
        stylesheet
          ? `${stylesheetPath} does not define`
          : 'components.json names no readable tailwind.css to check for'
      } theme tokens these ui components use. tc96 does not edit your CSS; add the ones you need:\n${theme
        .map(({ item, rules }) => `${item}:\n${rules.join('\n')}`)
        .join('\n')}`,
    )
  const planned = await planFiles(workspace, item.files)
  const target = dependencyTarget(workspace, configuration.paths.patterns)
  const dependencies = missingDependencies(workspace, item.dependencies, target)
  if (preview) {
    const labels = {
      create: 'create',
      unchanged: 'unchanged',
      conflict: 'exists and differs, preserved unless you approve',
    }
    for (const file of planned)
      console.log(`${labels[file.status]}: ${show(file.path)}`)
    if (flags.has('--view'))
      for (const file of planned.filter(({ status }) => status !== 'unchanged'))
        console.log(`--- ${show(file.path)}\n${file.content}`)
    if (flags.has('--diff'))
      for (const file of planned.filter(({ status }) => status === 'conflict'))
        console.log(
          `--- ${show(file.path)}\n${diffLines(file.current ?? '', file.content)}`,
        )
    console.log(
      dependencies.length
        ? `Dependencies to install: ${installCommand(workspace, detectPackageManager(workspace), dependencies, target).join(' ')}`
        : 'Every npm dependency is already installed.',
    )
    if (withPatterns)
      console.log(
        `${show(barrelPath)}, written after installation unless the consumer wrote that file:\n${barrel}`,
      )
    return
  }
  const terminal =
    process.stdin.isTTY &&
    !flags.has('--yes') &&
    !flags.has('--preserve-existing')
      ? createInterface({ input: process.stdin, output: process.stdout })
      : undefined
  const result = await writeFiles(
    planned,
    terminal &&
      (async (path) =>
        /^y(es)?$/i.test(
          (
            await terminal.question(
              `${show(path)} differs from the registry. Overwrite it? (y/N) `,
            )
          ).trim(),
        )),
  ).finally(() => terminal?.close())
  console.log(`Wrote ${result.written.length} files.`)
  if (result.preserved.length)
    console.log(
      `Preserved ${result.preserved.length} existing files that differ from the registry:\n${result.preserved.map((path) => `  ${show(path)}`).join('\n')}`,
    )
  if (dependencies.length) installDependencies(workspace, dependencies, target)
  const after = await checkCompatibility(workspace, item, true)
  console.log(`Installed TypeScript compatibility: ${after.status}.`)
  if (after.status !== 'compatible') {
    for (const diagnostic of after.diagnostics.slice(0, 20))
      console.error(diagnostic)
    throw new Error(
      'Installation requires consumer fixes; see diagnostics above. Preserved files were not overwritten automatically.',
    )
  }
  if (withPatterns)
    console.log(
      (await writeBarrel(barrelPath, barrel)) === 'preserved'
        ? `${show(barrelPath)} was not generated by tc96-parttens and was preserved; export the installed patterns from it yourself.`
        : `${show(barrelPath)} exports the installed patterns.`,
    )
  console.log(
    `Installed: ${selected.join(', ')}. Visual and behavioral compatibility still require consumer validation.`,
  )
}
main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
