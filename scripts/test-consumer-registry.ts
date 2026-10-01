import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { createConsumer, json, pack, run, saveReport } from './consumer'

const cli = await pack(resolve('dist/cli'))
const root = await createConsumer('consumer-registry', {
  'tc96-parttens': `file:${cli}`,
})
const aliases = {
  ui: '@consumer/visual',
  utils: '@consumer/helpers',
  elements: '@consumer/atoms',
  patterns: '@consumer/patterns',
}
const paths = {
  ui: 'packages/visual/src',
  utils: 'packages/helpers/src',
  elements: 'packages/atoms/src',
  patterns: 'packages/patterns/src',
}
const tsconfig = JSON.parse(await readFile(join(root, 'tsconfig.json'), 'utf8'))
tsconfig.compilerOptions.paths = Object.fromEntries(
  (Object.keys(aliases) as (keyof typeof aliases)[]).flatMap((name) => [
    [aliases[name], [`./${paths[name]}/index.ts`]],
    [`${aliases[name]}/*`, [`./${paths[name]}/*`]],
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
    lib: '@consumer/helpers',
    hooks: '@consumer/patterns/hooks',
    ...aliases,
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
  aliases,
  paths,
})
