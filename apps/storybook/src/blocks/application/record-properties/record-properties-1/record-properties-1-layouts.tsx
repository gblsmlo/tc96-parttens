import { CalendarCheckIcon } from '@phosphor-icons/react'
import {
  createRecordProperties1Catalog,
  RecordProperties1,
  type RecordProperties1Item,
} from '@tc96/ui/blocks/application/record-properties/record-properties-1'
import type { PropertyOption } from '@tc96/ui/patterns/properties/core'
import { DateProperty } from '@tc96/ui/patterns/properties/display/date/date-property'
import {
  PersonProperty,
  type PersonPropertyOption,
} from '@tc96/ui/patterns/properties/display/person/person-property'
import { SelectProperty } from '@tc96/ui/patterns/properties/display/select/select-property'
import { TagsProperty } from '@tc96/ui/patterns/properties/display/tags/tags-property'
import {
  type PriorityLevel,
  priorityMeta,
  type WorkflowStatus,
  workflowStatusMeta,
} from '@tc96/ui/property-meta'
import { useState } from 'react'

const catalog = createRecordProperties1Catalog({
  createdAt: 'Criado em',
  dueDate: 'Prazo',
  owner: 'Responsável',
  priority: 'Prioridade',
  status: 'Status',
  tags: 'Tags',
  type: 'Tipo',
})

const statusOptions: readonly PropertyOption<WorkflowStatus>[] = (
  [
    ['todo', 'A fazer'],
    ['in-progress', 'Em andamento'],
    ['done', 'Concluído'],
  ] as const
).map(([value, label]) => ({ ...workflowStatusMeta[value], label, value }))

const priorityOptions: readonly PropertyOption<PriorityLevel>[] = (
  [
    ['urgent', 'Urgente'],
    ['high', 'Alta'],
    ['medium', 'Média'],
    ['low', 'Baixa'],
  ] as const
).map(([value, label]) => ({ ...priorityMeta[value], label, value }))

const typeOptions: readonly PropertyOption[] = [
  { label: 'Análise', value: 'analysis' },
  { label: 'Desenvolvimento', value: 'development' },
  { label: 'Revisão', value: 'review' },
]

const people: readonly PersonPropertyOption[] = [
  { fallback: 'M', label: 'Manager Acme', value: 'manager' },
  { fallback: 'AS', label: 'Ana Souza', value: 'ana' },
  { fallback: 'BL', label: 'Bruno Lima', value: 'bruno' },
]

const tagOptions: readonly PropertyOption[] = [
  { label: 'Cliente', value: 'client' },
  { label: 'Interno', value: 'internal' },
  { label: 'Urgente', value: 'urgent' },
]

const tagsLabels = {
  count: (count: number) => `${count} ${count === 1 ? 'Tag' : 'Tags'}`,
}

export interface TaskPropertiesProps {
  customProperty?: boolean
  iconlessKeys?: readonly string[]
  pendingKeys?: readonly string[]
  showLabelIcons?: boolean
}

const labels = {
  loadingValue: (label: string) => `Carregando ${label}`,
}

export function TaskProperties({
  customProperty = false,
  iconlessKeys = ['status', 'priority'],
  pendingKeys = [],
  showLabelIcons = true,
}: Readonly<TaskPropertiesProps>) {
  const [status, setStatus] = useState<string | null>('in-progress')
  const [priority, setPriority] = useState<string | null>('high')
  const [type, setType] = useState<string | null>('analysis')
  const [owner, setOwner] = useState<string | null>('manager')
  const [tags, setTags] = useState<readonly string[]>(['client'])
  const [reviewDate, setReviewDate] = useState<string | null>(null)

  const iconless = (key: string) => ({
    ...(iconlessKeys.includes(key) ? { icon: null } : {}),
    pending: pendingKeys.includes(key),
  })

  const items: RecordProperties1Item[] = [
    {
      catalogKey: 'status',
      id: 'status',
      ...iconless('status'),
      render: () => (
        <SelectProperty
          ariaLabel="Status"
          onValueChange={setStatus}
          options={statusOptions}
          value={status}
          variant="plain"
        />
      ),
    },
    {
      catalogKey: 'priority',
      id: 'priority',
      ...iconless('priority'),
      render: () => (
        <SelectProperty
          ariaLabel="Prioridade"
          onValueChange={setPriority}
          options={priorityOptions}
          value={priority}
          variant="plain"
        />
      ),
    },
    {
      catalogKey: 'type',
      id: 'type',
      ...iconless('type'),
      render: () => (
        <SelectProperty
          ariaLabel="Tipo"
          onValueChange={setType}
          options={typeOptions}
          value={type}
          variant="plain"
        />
      ),
    },
    {
      catalogKey: 'owner',
      id: 'owner',
      ...iconless('owner'),
      render: () => (
        <PersonProperty
          ariaLabel="Responsável"
          dropdownPlacement={{ align: 'start' }}
          onValueChange={setOwner}
          options={people}
          value={owner}
          variant="plain"
        />
      ),
    },
    {
      catalogKey: 'tags',
      id: 'tags',
      ...iconless('tags'),
      render: () => (
        <TagsProperty
          ariaLabel="Tags"
          display="count"
          labels={tagsLabels}
          onValueChange={setTags}
          options={tagOptions}
          value={tags}
          variant="plain"
        />
      ),
    },
  ]

  if (customProperty) {
    items.push({
      icon: CalendarCheckIcon,
      id: 'review-date',
      label: 'Revisão',
      render: () => (
        <DateProperty
          ariaLabel="Revisão"
          locale="pt-BR"
          onValueChange={setReviewDate}
          value={reviewDate}
          variant="plain"
        />
      ),
    })
  }

  return (
    <RecordProperties1
      ariaLabel="Propriedades da tarefa"
      catalog={catalog}
      items={items}
      labels={labels}
      showLabelIcons={showLabelIcons}
    />
  )
}
