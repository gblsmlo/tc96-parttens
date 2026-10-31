import { mkdir, writeFile } from 'node:fs/promises'
import { performance } from 'node:perf_hooks'
import { projectCollection } from '../packages/parttens/src/collection/shared/lib/project-collection'

const records = Array.from({ length: 10_000 }, (_, index) => ({
  id: `item-${index}`,
  status: `status-${index % 20}`,
}))
const collection = {
  records,
  getKey: (record: (typeof records)[number]) => record.id,
  getLabel: (record: (typeof records)[number]) => record.id,
  groupings: [
    {
      id: 'status',
      label: 'Status',
      options: Array.from({ length: 20 }, (_, index) => ({
        id: `status-${index}`,
        label: `Status ${index}`,
      })),
      getGroupId: (record: (typeof records)[number]) => record.status,
    },
  ],
}
const samples: number[] = []
for (let run = 0; run < 5; run++) {
  const start = performance.now()
  const groups = projectCollection(collection, 'status')
  if (
    groups.reduce((count, group) => count + group.count, 0) !== records.length
  )
    throw new Error('Projection dropped items')
  samples.push(performance.now() - start)
}
const report = {
  itemCount: records.length,
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
