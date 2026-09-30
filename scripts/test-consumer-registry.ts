import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { defaultConfig } from '../packages/registry/src/manifest'
import { createConsumer, json, pack, run, saveReport } from './consumer'

const cli = await pack(resolve('dist/cli'))
const root = await createConsumer('consumer-registry', {
  'tc96-parttens': `file:${cli}`,
})
const config = {
  patterns: { path: 'packages/patterns/src', alias: '@consumer/patterns' },
  ui: { path: 'packages/visual/src', alias: '@consumer/visual' },
  utils: { path: 'packages/helpers/src', alias: '@consumer/helpers' },
}
await json(join(root, 'tc96.json'), config)
const tsconfig = JSON.parse(await readFile(join(root, 'tsconfig.json'), 'utf8'))
tsconfig.compilerOptions.paths = Object.fromEntries(
  Object.values(config).flatMap((destination) => [
    [destination.alias, [`./${destination.path}/index.ts`]],
    [`${destination.alias}/*`, [`./${destination.path}/*`]],
  ]),
)
tsconfig.include = ['src', 'packages']
await json(join(root, 'tsconfig.json'), tsconfig)
await mkdir(join(root, 'packages/visual/src'), { recursive: true })
await writeFile(
  join(root, 'packages/visual/src/styles.css'),
  '@import "tailwindcss";\n',
)
await json(join(root, 'components.json'), {
  $schema: 'https://ui.shadcn.com/schema.json',
  style: 'new-york',
  rsc: false,
  tsx: true,
  tailwind: {
    config: '',
    css: 'packages/visual/src/styles.css',
    baseColor: 'neutral',
    cssVariables: true,
  },
  aliases: {
    components: '@consumer/patterns',
    ui: '@consumer/visual',
    utils: '@consumer/helpers',
    lib: '@consumer/helpers',
    hooks: '@consumer/patterns/hooks',
  },
})
await mkdir(join(root, 'packages/helpers/src'), { recursive: true })
await writeFile(
  join(root, 'packages/helpers/src/index.ts'),
  `export function cn(...values: unknown[]) { return values.filter(Boolean).join(' ') }\n`,
)
const preserved = await readFile(
  join(root, 'packages/helpers/src/index.ts'),
  'utf8',
)
const command = [
  'node',
  join(root, 'node_modules/tc96-parttens/cli.js'),
  'add',
  'collection-views',
  'properties',
  'detail-sheet',
  'editable',
  '--cwd',
  root,
  '--yes',
]
run(command, root)
if (
  (await readFile(join(root, 'packages/helpers/src/index.ts'), 'utf8')) !==
  preserved
)
  throw new Error('An existing customized file was overwritten')
await writeFile(
  join(root, 'src/contract.tsx'),
  `import { ListView } from '@consumer/patterns/collection-views'; import { TextProperty } from '@consumer/patterns/properties'; export { ListView, TextProperty }`,
)
run([join(root, 'node_modules/.bin/tsc'), '--noEmit'], root)
await saveReport('consumer-registry', {
  passed: true,
  installedPatterns: 4,
  customizedFilePreserved: true,
  destinations: config,
  defaults: defaultConfig,
})
