import { join } from 'node:path'
import { build } from 'esbuild'
import {
  buttonMarker,
  createConsumer,
  installPatterns,
  run,
  saveReport,
} from './consumer'

// Server rendering in the example consumer must use its own COSS button.
const consumer = await createConsumer('consumer-ssr')
await installPatterns(consumer, ['collection-views', 'properties'])
const outfile = join(consumer.root, 'dist/ssr.cjs')
await build({
  entryPoints: [join(consumer.root, 'src/ssr.tsx')],
  absWorkingDir: consumer.root,
  tsconfig: join(consumer.root, 'tsconfig.json'),
  bundle: true,
  platform: 'node',
  format: 'cjs',
  outfile,
  logLevel: 'error',
})
const html = run(['node', outfile], consumer.root, true)
for (const expected of ['Arquivar', 'Rendered on server', buttonMarker])
  if (!html.includes(expected))
    throw new Error(`Server markup is missing "${expected}"`)
await saveReport('consumer-ssr', {
  passed: true,
  patterns: ['collection-views', 'properties'],
  consumerButtonRendered: true,
})
console.log('SSR rendered the consumer button.')
