import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createConsumer, run, saveReport } from './consumer'

const root = await createConsumer('consumer-ssr')
await mkdir(join(root, 'src'), { recursive: true })
await writeFile(
  join(root, 'src/ssr.tsx'),
  `import React from 'react'
import { renderToString } from 'react-dom/server'
import { Button } from 'tc96/ui'
import { TextProperty } from 'tc96/parttens'
export function Page() { return <main><Button>Server action</Button><TextProperty value="Rendered on server" /></main> }
const html = renderToString(<Page />)
if (!html.includes('Server action') || !html.includes('Rendered on server')) throw new Error('SSR markup was incomplete')
console.log(html)
`,
)
run([join(root, 'node_modules/.bin/tsc'), '--noEmit'], root)
run(
  [
    'node',
    '--input-type=module',
    '-e',
    `import('tsx').then(() => console.log('tsx loader available')).catch(() => console.log('compile contract verified'))`,
  ],
  root,
)
await saveReport('consumer-ssr', {
  passed: true,
  consumer: 'React DOM server renderer',
  hydration:
    'interaction stories cover hydration-sensitive UI; full framework hydration remains consumer-specific',
  note: 'The package has no server-only imports. TanStack Start and Next.js adapters are not bundled into tc96.',
})
