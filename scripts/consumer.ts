import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import ts from 'typescript'
import { readAliases, resolveAliasPath } from '../packages/registry/src/config'
import { readLock, sourceDirectory } from './coss'
import { files } from './files'

export const npmCache = resolve('.test-output/npm-cache')
/** Added to the consumer's button.tsx; it only renders if the patterns use it. */
export const buttonMarker = 'acme-consumer-button'

export function run(command: string[], cwd = process.cwd(), capture = false) {
  const executable = command[0]
  if (!executable) throw new Error('Command is empty')
  const result = spawnSync(executable, command.slice(1), {
    cwd,
    env: { ...process.env, CI: 'true', npm_config_cache: npmCache },
    stdio: capture ? 'pipe' : 'inherit',
    encoding: 'utf8',
  })
  if (result.status !== 0)
    throw new Error(
      `${command.join(' ')} failed (${result.status}): ${result.stderr ?? result.error ?? ''}`,
    )
  return result.stdout ?? ''
}
export async function json(path: string, value: unknown) {
  await mkdir(resolve(path, '..'), { recursive: true })
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`)
}
export async function pack(directory: string) {
  const destination = resolve('.test-output/tarballs')
  await mkdir(destination, { recursive: true })
  const result = JSON.parse(
    run(
      ['npm', 'pack', '--json', '--pack-destination', destination],
      directory,
      true,
    ),
  )
  return join(destination, result[0].filename)
}

export interface Consumer {
  root: string
  /** Directory of the consumer's COSS components, relative to root. */
  ui: string
  /** Directory the patterns alias resolves to, relative to root. */
  patterns: string
}

// Copies apps/example and installs COSS into it the way shadcn would: the
// locked snapshot in packages/ui, with imports rewritten to the consumer's
// aliases. The consumer then customizes its button with a marker class.
export async function createConsumer(name: string): Promise<Consumer> {
  const root = resolve(`.test-output/${name}`)
  await rm(root, { recursive: true, force: true })
  await cp(resolve('apps/example'), root, {
    recursive: true,
    filter: (source) => !source.includes('/node_modules'),
  })
  const aliases = readAliases(
    JSON.parse(await readFile(join(root, 'components.json'), 'utf8')),
  )
  const config = ts.readConfigFile(join(root, 'tsconfig.json'), ts.sys.readFile)
  const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
  const ui = resolveAliasPath(root, aliases.ui, options)
  const patterns = resolveAliasPath(root, aliases.patterns, options)
  for (const item of Object.keys((await readLock()).items)) {
    let content = (await readFile(`${sourceDirectory}/${item}.tsx`, 'utf8'))
      .replace(/(["'])@tc96\/ui\//g, `$1${aliases.ui}/`)
      .replace(/(["'])@tc96\/utils\1/g, `$1${aliases.utils}$1`)
    if (item === 'button') {
      const customized = content.replace(
        'cva(\n  "',
        `cva(\n  "${buttonMarker} `,
      )
      if (customized === content)
        throw new Error('Cannot find the button base classes to customize')
      content = customized
    }
    await writeFile(join(root, ui, `${item}.tsx`), content)
  }
  const manifest = JSON.parse(
    await readFile(join(root, 'package.json'), 'utf8'),
  )
  manifest.name = `tc96-${name}`
  manifest.dependencies['@tc96/parttens'] =
    `file:${await pack(resolve('dist/cli'))}`
  await json(join(root, 'package.json'), manifest)
  run(['npm', 'install', '--no-audit', '--no-fund'], root)
  return { root, ui, patterns }
}

/** Content hash of every file under a consumer directory. */
export async function snapshot(root: string, directory: string) {
  const result: Record<string, string> = {}
  for (const file of await files(join(root, directory)))
    result[relative(root, file)] = createHash('sha256')
      .update(await readFile(file))
      .digest('hex')
  return result
}

/**
 * Runs the packed CLI, then checks what a consumer install must guarantee.
 * Returns the installed pattern file count and the COSS files it added.
 */
export async function installPatterns(consumer: Consumer, patterns: string[]) {
  const before = await snapshot(consumer.root, consumer.ui)
  run(
    [
      'node',
      join(consumer.root, 'node_modules/@tc96/parttens/cli.js'),
      'add',
      ...patterns,
      '--cwd',
      consumer.root,
      '--yes',
    ],
    consumer.root,
  )
  const after = await snapshot(consumer.root, consumer.ui)
  for (const [file, hash] of Object.entries(before))
    if (after[file] !== hash)
      throw new Error(`The CLI changed ${file} in the consumer UI`)
  const installed = await files(join(consumer.root, consumer.patterns))
  for (const file of installed)
    if ((await readFile(file, 'utf8')).includes('@tc96/'))
      throw new Error(`${relative(consumer.root, file)} still imports @tc96/*`)
  run([join(consumer.root, 'node_modules/.bin/tsc'), '--noEmit'], consumer.root)
  return {
    files: installed.length,
    addedUi: Object.keys(after).filter((file) => !(file in before)),
  }
}

export async function saveReport(name: string, value: unknown) {
  await json(resolve(`.test-output/${name}.json`), value)
}
