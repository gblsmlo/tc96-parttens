import { expect, test } from 'bun:test'
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { blockNames, patternNames } from './manifest'

test('help lists every pattern and block', () => {
  const result = spawnSync(
    process.execPath,
    [join(import.meta.dir, 'cli.ts'), '--help'],
    { encoding: 'utf8' },
  )
  expect(result.status).toBe(0)
  expect(result.stdout).toContain(`Patterns: ${patternNames.join(' ')}\n`)
  expect(result.stdout).toContain(`Blocks: ${blockNames.join(' ')}\n`)
})

const pendingRegistryDirectory = join(
  import.meta.dir,
  '..',
  'fixtures',
  'cli-pending',
)
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

test('a dry run lists pending dependencies once instead of one error per import', async () => {
  const root = await consumer()
  try {
    await writeFile(
      join(root, 'src/ui/button.ts'),
      'export function Button(props: { variant: string }) { return props }',
    )
    const result = spawnSync(
      process.execPath,
      [
        join(import.meta.dir, 'cli.ts'),
        'add',
        'checklist',
        '--cwd',
        root,
        '--registry-dir',
        pendingRegistryDirectory,
        '--dry-run',
      ],
      { encoding: 'utf8' },
    )
    expect(result.stdout).toContain('Compatibility: inconclusive')
    expect(result.stdout).toContain('1 dependencies are not installed yet')
    expect(result.stdout).toContain('absent-package')
    expect(result.stdout).not.toContain('TS2882')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

const installRegistryDirectory = join(
  import.meta.dir,
  '..',
  'fixtures',
  'cli-install',
)
const stylesheet = ':root {\n  --destructive-foreground: red;\n}\n'

async function installConsumer() {
  const root = await consumer()
  const tsconfig = JSON.parse(
    await readFile(join(root, 'tsconfig.json'), 'utf8'),
  )
  tsconfig.compilerOptions.jsx = 'react-jsx'
  await writeFile(join(root, 'tsconfig.json'), JSON.stringify(tsconfig))
  await rm(join(root, 'src/ui/button.ts'))
  await writeFile(
    join(root, 'src/ui/button.tsx'),
    'export function Button(props: { variant: "outline" }) { return props }\n',
  )
  await writeFile(join(root, 'src/styles.css'), stylesheet)
  await writeFile(
    join(root, 'components.json'),
    JSON.stringify({
      tailwind: { css: 'src/styles.css' },
      aliases: { ui: '@consumer/ui', utils: '@consumer/utils' },
    }),
  )
  return root
}

function install(root: string, ...flags: string[]) {
  return installItem(root, 'checklist', ...flags)
}

function installItem(root: string, name: string, ...flags: string[]) {
  return spawnSync(
    process.execPath,
    [
      join(import.meta.dir, 'cli.ts'),
      'add',
      name,
      '--cwd',
      root,
      '--registry-dir',
      installRegistryDirectory,
      ...flags,
    ],
    { encoding: 'utf8' },
  )
}

test('installs the patterns and the missing ui components, leaving the CSS and components.json alone', async () => {
  const root = await installConsumer()
  try {
    const components = await readFile(join(root, 'components.json'), 'utf8')
    const result = install(root)
    expect(result.stderr).not.toContain('Error')
    expect(result.status).toBe(0)
    expect(await readFile(join(root, 'src/ui/badge.tsx'), 'utf8')).toBe(
      'import { Button } from "@consumer/ui/button"\nexport const badge = Button({ variant: "outline" })\n',
    )
    expect(
      await readFile(join(root, 'src/patterns/checklist/proof.ts'), 'utf8'),
    ).toBe(
      'import { badge } from "@consumer/ui/badge"\nexport const proof = badge\n',
    )
    expect(
      await readFile(join(root, 'src/patterns/index.ts'), 'utf8'),
    ).toContain("export * from './checklist/proof'")
    expect(result.stdout).toContain('Compatibility: compatible')
    expect(result.stdout).toContain(
      'Missing ui components, installed from this package: badge.',
    )
    expect(result.stderr).toContain(':root {\n  --info: blue;\n}')
    expect(result.stderr).toContain('.dark {\n  --info: navy;\n}')
    expect(result.stderr).not.toContain('--destructive-foreground')
    expect(await readFile(join(root, 'src/styles.css'), 'utf8')).toBe(
      stylesheet,
    )
    expect(await readFile(join(root, 'components.json'), 'utf8')).toBe(
      components,
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('preserves an existing file that differs and keeps installed components', async () => {
  const root = await installConsumer()
  const proof = join(root, 'src/patterns/checklist/proof.ts')
  try {
    expect(install(root).status).toBe(0)
    await writeFile(proof, 'export const proof = "mine"\n')
    const result = install(root)
    expect(result.status).toBe(0)
    expect(result.stdout).toContain(
      'Preserved 1 existing files that differ from the registry:\n  src/patterns/checklist/proof.ts',
    )
    expect(result.stdout).toContain(
      'Every ui component the patterns use is already installed',
    )
    expect(await readFile(proof, 'utf8')).toBe('export const proof = "mine"\n')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('a dry run lists the plan and the diff without writing', async () => {
  const root = await installConsumer()
  const proof = join(root, 'src/patterns/checklist/proof.ts')
  try {
    await mkdir(join(root, 'src/patterns/checklist'), { recursive: true })
    await writeFile(proof, 'export const proof = "mine"\n')
    const result = install(root, '--dry-run', '--diff')
    expect(result.status).toBe(0)
    expect(result.stdout).toContain('create: src/ui/badge.tsx')
    expect(result.stdout).toContain(
      'exists and differs, preserved unless you approve: src/patterns/checklist/proof.ts',
    )
    expect(result.stdout).toContain('-export const proof = "mine"')
    expect(result.stdout).toContain('+export const proof = badge')
    expect(result.stdout).toContain(
      'Every npm dependency is already installed.',
    )
    expect(existsSync(join(root, 'src/ui/badge.tsx'))).toBe(false)
    expect(await readFile(proof, 'utf8')).toBe('export const proof = "mine"\n')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('a block needs the blocks path, which patterns alone do not', async () => {
  const root = await installConsumer()
  try {
    const result = installItem(root, 'app-shell-1')
    expect(result.status).not.toBe(0)
    expect(result.stderr).toContain('"@consumer/blocks/*": ["./src/blocks/*"]')
    expect(install(root).status).toBe(0)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('installs a block with the COSS hook its components need', async () => {
  const root = await installConsumer()
  try {
    const tsconfig = JSON.parse(
      await readFile(join(root, 'tsconfig.json'), 'utf8'),
    )
    tsconfig.compilerOptions.paths['@consumer/blocks/*'] = ['./src/blocks/*']
    await writeFile(join(root, 'tsconfig.json'), JSON.stringify(tsconfig))
    const result = installItem(root, 'app-shell-1')
    expect(result.stderr).not.toContain('Error')
    expect(result.status).toBe(0)
    expect(
      await readFile(join(root, 'src/ui/hooks/use-media-query.ts'), 'utf8'),
    ).toBe('export function useMediaQuery() {\n  return true\n}\n')
    expect(await readFile(join(root, 'src/ui/sidebar.tsx'), 'utf8')).toBe(
      'import { useMediaQuery } from "@consumer/ui/hooks/use-media-query"\nexport const sidebar = useMediaQuery\n',
    )
    expect(
      await readFile(
        join(root, 'src/blocks/shell/app-shell-1/index.ts'),
        'utf8',
      ),
    ).toBe(
      'import { sidebar } from "@consumer/ui/sidebar"\nexport const AppShell1 = sidebar\n',
    )
    expect(existsSync(join(root, 'src/patterns/index.ts'))).toBe(false)
    const again = installItem(root, 'app-shell-1')
    expect(again.status).toBe(0)
    expect(again.stdout).toContain(
      'Every ui component the patterns use is already installed',
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('installs a multi-file ui item under its folder with its npm dependency', async () => {
  const root = await installConsumer()
  try {
    const result = installItem(root, 'chat-assistant', '--dry-run')
    expect(result.stderr).not.toContain('Error')
    expect(result.status).toBe(0)
    for (const file of [
      'chat/chat-bubble.tsx',
      'chat/hooks/use-chat-scroll.ts',
      'chat/lib/split-chat-message-preview.ts',
    ])
      expect(result.stdout).toContain(`create: src/ui/${file}`)
    expect(result.stdout).toContain('Missing ui components')
    expect(result.stdout).toContain('motion@14.0.0')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('a folder named after a multi-file ui item counts as installed', async () => {
  const root = await installConsumer()
  try {
    await mkdir(join(root, 'src/ui/chat'), { recursive: true })
    const result = installItem(root, 'chat-assistant', '--dry-run')
    expect(result.status).toBe(0)
    expect(result.stdout).toContain(
      'Every ui component the patterns use is already installed',
    )
    expect(result.stdout).not.toContain('create: src/ui/chat/')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

async function addPath(root: string, alias: string, directory: string) {
  const tsconfig = JSON.parse(
    await readFile(join(root, 'tsconfig.json'), 'utf8'),
  )
  tsconfig.compilerOptions.paths[`${alias}/*`] = [`./${directory}/*`]
  await writeFile(join(root, 'tsconfig.json'), JSON.stringify(tsconfig))
}

test('installs a block under aliases.templates with a deprecation warning', async () => {
  const root = await installConsumer()
  try {
    await writeFile(
      join(root, 'components.json'),
      JSON.stringify({
        tailwind: { css: 'src/styles.css' },
        aliases: {
          ui: '@consumer/ui',
          utils: '@consumer/utils',
          templates: '@consumer/shells',
        },
      }),
    )
    await addPath(root, '@consumer/shells', 'src/shells')
    const result = installItem(root, 'app-shell-1')
    expect(result.status).toBe(0)
    expect(result.stderr).toContain(
      'components.json aliases.templates is deprecated; rename it to aliases.blocks.',
    )
    expect(
      existsSync(join(root, 'src/shells/shell/app-shell-1/index.ts')),
    ).toBe(true)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('writes a block to the templates path of a tsconfig that was not renamed', async () => {
  const root = await installConsumer()
  try {
    await addPath(root, '@consumer/templates', 'src/templates')
    const result = installItem(root, 'app-shell-1')
    expect(result.status).toBe(0)
    expect(result.stderr).toContain(
      'tsconfig.json paths has "@consumer/templates/*" but no "@consumer/blocks/*"',
    )
    expect(
      await readFile(
        join(root, 'src/templates/shell/app-shell-1/index.ts'),
        'utf8',
      ),
    ).toBe(
      'import { sidebar } from "@consumer/ui/sidebar"\nexport const AppShell1 = sidebar\n',
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

const breakingRegistryDirectory = join(
  import.meta.dir,
  '..',
  'fixtures',
  'cli-breaking',
)

async function blocksConsumer() {
  const root = await installConsumer()
  await addPath(root, '@consumer/blocks', 'src/blocks')
  await mkdir(join(root, 'src/patterns/checklist'), { recursive: true })
  await writeFile(
    join(root, 'src/patterns/checklist/proof.ts'),
    'export const proof = 1\n',
  )
  await mkdir(join(root, 'src/blocks'), { recursive: true })
  await writeFile(
    join(root, 'src/blocks/uses-proof.ts'),
    "import { proof } from '@consumer/patterns/checklist/proof'\nexport const value = proof\n",
  )
  return root
}

test('updating a pattern stops when an installed block uses what it removes', async () => {
  const root = await blocksConsumer()
  try {
    const result = spawnSync(
      process.execPath,
      [
        join(import.meta.dir, 'cli.ts'),
        'add',
        'checklist',
        '--cwd',
        root,
        '--registry-dir',
        breakingRegistryDirectory,
        '--dry-run',
      ],
      { encoding: 'utf8' },
    )
    expect(result.status).toBe(1)
    expect(result.stdout).toContain(
      'Checking 1 installed block files against the updated patterns.',
    )
    expect(result.stdout).toContain('Compatibility: incompatible')
    expect(result.stdout).toContain('uses-proof.ts')
    expect(result.stderr).toContain('--force')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('a type error an installed block already had does not stop an update', async () => {
  const root = await blocksConsumer()
  try {
    await writeFile(
      join(root, 'src/blocks/broken.ts'),
      'export const broken: string = 1\n',
    )
    const result = install(root)
    expect(result.status).toBe(0)
    expect(result.stdout).toContain(
      'Checking 2 installed block files against the updated patterns.',
    )
    expect(result.stdout).toContain('Compatibility: compatible')
    expect(result.stdout).toContain(
      'Installed TypeScript compatibility: compatible.',
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('updating a pattern with no blocks directory checks only the pattern', async () => {
  const root = await installConsumer()
  try {
    const result = install(root)
    expect(result.status).toBe(0)
    expect(result.stdout).not.toContain('installed block files')
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
