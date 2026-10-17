import { readFile } from 'node:fs/promises'

const dryRun = process.argv.includes('--dry-run')

function read(command: string[]) {
  const result = Bun.spawnSync(command)
  if (result.exitCode !== 0)
    throw new Error(
      `${command.join(' ')} failed: ${result.stderr.toString().trim()}`,
    )
  return result.stdout.toString().trim()
}

async function packageVersion() {
  const source = await readFile(
    'packages/registry/src/build-registry.ts',
    'utf8',
  )
  const match = source.match(
    /name: '@tc96\/parttens',\s*version: '(\d+\.\d+\.\d+)'/,
  )
  if (!match?.[1])
    throw new Error('Could not read the version from build-registry.ts')
  return match[1]
}

try {
  const version = await packageVersion()
  const tag = `v${version}`

  if (read(['git', 'branch', '--show-current']) !== 'main')
    throw new Error('Run the release from the main branch')
  if (read(['git', 'status', '--porcelain', '--untracked-files=no']))
    throw new Error('The working tree has uncommitted changes')

  read(['git', 'fetch', 'origin', 'main'])
  if (
    read(['git', 'rev-parse', 'HEAD']) !==
    read(['git', 'rev-parse', 'origin/main'])
  )
    throw new Error('main is not in sync with origin/main')
  if (read(['git', 'ls-remote', '--tags', 'origin', tag]))
    throw new Error(`The tag ${tag} already exists on origin`)

  const published = Bun.spawnSync([
    'npm',
    'view',
    `@tc96/parttens@${version}`,
    'version',
  ])
  if (published.stdout.toString().trim())
    throw new Error(`@tc96/parttens@${version} is already on npm`)

  const command = [
    'gh',
    'release',
    'create',
    tag,
    '--target',
    'main',
    '--generate-notes',
    '--latest',
    '--title',
    tag,
  ]
  console.log(command.join(' '))
  if (!dryRun) {
    const result = Bun.spawnSync(command, {
      stdout: 'inherit',
      stderr: 'inherit',
    })
    process.exit(result.exitCode)
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
