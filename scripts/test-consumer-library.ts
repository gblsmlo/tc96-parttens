import { writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { createConsumer, run, saveReport } from './consumer'

const root = await createConsumer('consumer-library')
await writeFile(
  join(root, 'src/contract.tsx'),
  `import { Button, Input } from 'tc96/ui'
import { TextProperty } from 'tc96/components'
import { ListView, Kanban } from 'tc96/blocks'
import { CollectionViewOutlet, CollectionProvider } from 'tc96/parttens'
import { cn } from 'tc96/utils'
export const contract = <div className={cn('consumer')}><Button size="sm">Save</Button><Input aria-label="Name"/><TextProperty value="Text" /></div>
export { ListView, Kanban, CollectionViewOutlet, CollectionProvider }
`,
)
run([join(root, 'node_modules/.bin/tsc'), '--noEmit'], root)
await writeFile(
  join(root, 'runtime.mjs'),
  `import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import { Button } from 'tc96/ui';
import { KanbanView } from 'tc96/parttens';
import { Kanban } from 'tc96/blocks';
if (Kanban !== KanbanView) throw new Error('Duplicated implementation');
if (!renderToString(createElement(Button, {}, 'SSR consumer')).includes('SSR consumer')) throw new Error('SSR failed');
console.log('Tarball runtime imports and shared component identity passed');`,
)
run(['node', 'runtime.mjs'], root)
await writeFile(
  join(root, 'src/utils-only.ts'),
  `import { cn } from 'tc96/utils'; console.log(cn('one', 'two'));`,
)
const { build } = await import('esbuild')
const result = await build({
  entryPoints: [join(root, 'src/utils-only.ts')],
  bundle: true,
  write: false,
  metafile: true,
  platform: 'browser',
})
if (
  Object.keys(result.metafile?.inputs).some((file) =>
    /node_modules\/react\//.test(file),
  )
)
  throw new Error('Utils brought React into its bundle')
await saveReport('consumer-library', {
  passed: true,
  tarballInstalled: true,
  publicEntries: 5,
  utilsWithoutReact: true,
  root: resolve(root),
})
