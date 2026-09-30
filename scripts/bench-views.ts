import { mkdir, writeFile } from 'node:fs/promises'
import { performance } from 'node:perf_hooks'
import { projectCollection } from '../packages/parttens/src/collection-views/shared/lib/project-collection'

const items = Array.from({ length: 10_000 }, (_, index) => ({
  id: `item-${index}`,
  status: `status-${index % 20}`,
}))
const collection = {
  items,
  getKey: (item: (typeof items)[number]) => item.id,
  getLabel: (item: (typeof items)[number]) => item.id,
  groupings: [
    {
      id: 'status',
      label: 'Status',
      options: Array.from({ length: 20 }, (_, index) => ({
        id: `status-${index}`,
        label: `Status ${index}`,
      })),
      getGroupId: (item: (typeof items)[number]) => item.status,
    },
  ],
}
const samples: number[] = []
for (let run = 0; run < 5; run++) {
  const start = performance.now()
  const groups = projectCollection(collection, 'status')
  if (groups.reduce((count, group) => count + group.count, 0) !== items.length)
    throw new Error('Projection dropped items')
  samples.push(performance.now() - start)
}
const report = {
  itemCount: items.length,
  groupCount: 20,
  runs: samples,
  minMs: Math.min(...samples),
  maxMs: Math.max(...samples),
  meanMs: samples.reduce((sum, value) => sum + value, 0) / samples.length,
}
await mkdir('.test-output', { recursive: true })
await writeFile(
  '.test-output/bench-views.json',
  `${JSON.stringify(report, null, 2)}\n`,
)
console.log(report)
