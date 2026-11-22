import type { CollectionDefinition } from '@tc96/parttens'
import { initialTasks } from '../../fixtures/tasks'

export interface SampleRecord {
  group: string
  id: string
  title: string
}

export const sampleRecords: readonly SampleRecord[] = [
  { group: 'todo', id: 'record-1', title: 'Primeiro registro' },
  { group: 'todo', id: 'record-2', title: 'Segundo registro' },
  { group: 'doing', id: 'record-3', title: 'Terceiro registro' },
]

export const sampleCollection = (
  records: readonly SampleRecord[],
): CollectionDefinition<SampleRecord> => ({
  getKey: (record) => record.id,
  getLabel: (record) => record.title,
  groupings: [
    {
      getGroupId: (record) => record.group,
      id: 'status',
      label: 'Status',
      options: [
        { id: 'todo', label: 'A fazer' },
        { id: 'doing', label: 'Em andamento' },
        { id: 'done', label: 'Concluído' },
      ],
    },
  ],
  records,
})

export const tasksWithoutInProgress = initialTasks.filter(
  (task) => task.status !== 'in-progress',
)
