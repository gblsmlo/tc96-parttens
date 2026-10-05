import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { patternNames } from './manifest'

test('help lists every pattern', () => {
  const result = spawnSync(
    process.execPath,
    [join(import.meta.dir, 'cli.ts'), '--help'],
    { encoding: 'utf8' },
  )
  expect(result.status).toBe(0)
  expect(result.stdout).toContain(`Patterns: ${patternNames.join(' ')}\n`)
})

const registryDirectory = join(
  import.meta.dir,
  '..',
  'fixtures',
  'cli-incompatible',
)

async function consumer() {
  const root = await mkdtemp(join(tmpdir(), 'tc96-cli-'))
  await mkdir(join(root, 'src/ui'), { recursive: true })
  await writeFile(
    join(root, 'src/ui/button.ts'),
    'export function Button(props: { variant: "outline" }) { return props }',
  )
  await writeFile(
    join(root, 'components.json'),
    JSON.stringify({
      aliases: { ui: '@consumer/ui', utils: '@consumer/utils' },
    }),
  )
  await writeFile(
    join(root, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        module: 'ESNext',
        moduleResolution: 'Bundler',
        strict: true,
        paths: {
          '@consumer/ui/*': ['./src/ui/*'],
          '@consumer/utils/*': ['./src/utils/*'],
          '@consumer/elements/*': ['./src/elements/*'],
          '@consumer/helpers/*': ['./src/helpers/*'],
          '@consumer/patterns/*': ['./src/patterns/*'],
        },
      },
    }),
  )
  return root
}

function add(root: string, ...flags: string[]) {
  return spawnSync(
    process.execPath,
    [
      join(import.meta.dir, 'cli.ts'),
      'add',
      'checklist',
      '--cwd',
      root,
      '--registry-dir',
      registryDirectory,
      ...flags,
    ],
    { encoding: 'utf8' },
  )
}

test.each([[[]], [['--dry-run']]])(
  'stops before installing when the patterns are incompatible (%p)',
  async (flags) => {
    const root = await consumer()
    try {
      const result = add(root, ...flags)
      expect(result.status).toBe(1)
      expect(result.stdout).toContain('Compatibility: incompatible')
      expect(result.stderr).toContain('--force')
      expect(existsSync(join(root, 'src/patterns'))).toBe(false)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  },
)

test('--force goes past an incompatible check', async () => {
  const root = await consumer()
  try {
    const result = add(root, '--dry-run', '--force')
    expect(result.stdout).toContain('Compatibility: incompatible')
    expect(result.stderr).toContain('installing anyway')
    expect(result.stderr).not.toContain('nothing was installed')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
