import { mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createConsumer, json, run, saveReport, snapshot } from './consumer'

// A consumer whose components.json defines only the shadcn aliases: the CLI
// derives elements, helpers and patterns from ui, finds components.json from a
// nested directory without --cwd, and installs patterns that compile. A
// tsconfig without the derived alias paths fails with the line to add.
const consumer = await createConsumer('consumer-minimal')
const componentsPath = join(consumer.root, 'components.json')
const components = JSON.parse(await readFile(componentsPath, 'utf8'))
const aliases = { ...components.aliases }
for (const name of ['elements', 'helpers', 'patterns']) delete aliases[name]
await json(componentsPath, { ...components, aliases })

const cli = join(consumer.root, 'node_modules/@tc96/parttens/cli.js')
const tsc = join(consumer.root, 'node_modules/.bin/tsc')
const nested = join(consumer.root, 'src/nested/deeper')
await mkdir(nested, { recursive: true })

const tsconfigPath = join(consumer.root, 'tsconfig.json')
const tsconfig = JSON.parse(await readFile(tsconfigPath, 'utf8'))
const paths = { ...tsconfig.compilerOptions.paths }
delete paths['@acme/patterns/*']
await json(tsconfigPath, {
  ...tsconfig,
  compilerOptions: { ...tsconfig.compilerOptions, paths },
})
let failure = ''
try {
  run(['node', cli, 'add', 'properties', '--yes'], nested, true)
} catch (error) {
  failure = String(error)
}
const suggestion = '"@acme/patterns/*": ["./packages/patterns/src/*"]'
if (!failure.includes(suggestion))
  throw new Error(`Expected the missing path error to suggest ${suggestion}`)
await json(tsconfigPath, tsconfig)

const before = await snapshot(consumer.root, consumer.ui)
run(['node', cli, 'add', 'collection-views', 'properties', '--yes'], nested)
const after = await snapshot(consumer.root, consumer.ui)
for (const [file, hash] of Object.entries(before))
  if (after[file] !== hash)
    throw new Error(`The CLI changed ${file} in the consumer UI`)
await readFile(join(consumer.root, consumer.patterns, 'index.ts'), 'utf8')
run([tsc, '--noEmit'], consumer.root)
await saveReport('consumer-minimal', {
  passed: true,
  derivedFrom: aliases.ui,
  ranFrom: 'src/nested/deeper',
  patternsPath: consumer.patterns,
  missingPathSuggestion: suggestion,
})
