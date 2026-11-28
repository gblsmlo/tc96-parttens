import type {
  PropertyOption,
  PropertyVariant,
} from '@tc96/ui/patterns/properties/core'
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
import { type ReactNode, useEffect, useState } from 'react'

export const taskCatalogLabels = {
  createdAt: 'Criado em',
  dueDate: 'Prazo',
  owner: 'Responsável',
  priority: 'Prioridade',
  status: 'Status',
  tags: 'Tags',
  type: 'Tipo',
}

export const taskPropertiesLabels = {
  loadingValue: (label: string) => `Carregando ${label}`,
}

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

export type TaskPropertyKey = 'owner' | 'priority' | 'status' | 'tags' | 'type'

export interface TaskPropertyItem {
  catalogKey: TaskPropertyKey
  id: TaskPropertyKey
  pending: boolean
  render: () => ReactNode
}

interface TaskValues {
  owner: string | null
  priority: string | null
  status: string | null
  tags: readonly string[]
  type: string | null
}

const taskValues: TaskValues = {
  owner: 'manager',
  priority: 'high',
  status: 'in-progress',
  tags: ['client'],
  type: 'analysis',
}

const TASK_RESPONSE_MS = 800

export function useTaskProperties(
  variant: PropertyVariant,
): TaskPropertyItem[] {
  const [task, setTask] = useState<TaskValues | null>(null)

  useEffect(() => {
    const response = setTimeout(() => setTask(taskValues), TASK_RESPONSE_MS)
    return () => clearTimeout(response)
  }, [])

  const change =
    <TKey extends keyof TaskValues>(key: TKey) =>
    (value: TaskValues[TKey]) =>
      setTask((current) => (current ? { ...current, [key]: value } : current))

  const row = (key: TaskPropertyKey, render: () => ReactNode) => ({
    catalogKey: key,
    id: key,
    pending: task === null,
    render,
  })

  return [
    row('status', () => (
      <SelectProperty
        ariaLabel="Status"
        onValueChange={change('status')}
        options={statusOptions}
        value={task?.status ?? null}
        variant={variant}
      />
    )),
    row('priority', () => (
      <SelectProperty
        ariaLabel="Prioridade"
        onValueChange={change('priority')}
        options={priorityOptions}
        value={task?.priority ?? null}
        variant={variant}
      />
    )),
    row('type', () => (
      <SelectProperty
        ariaLabel="Tipo"
        onValueChange={change('type')}
        options={typeOptions}
        value={task?.type ?? null}
        variant={variant}
      />
    )),
    row('owner', () => (
      <PersonProperty
        ariaLabel="Responsável"
        dropdownPlacement={{ align: 'start' }}
        onValueChange={change('owner')}
        options={people}
        value={task?.owner ?? null}
        variant={variant}
      />
    )),
    row('tags', () => (
      <TagsProperty
        ariaLabel="Tags"
        display="count"
        labels={tagsLabels}
        onValueChange={change('tags')}
        options={tagOptions}
        value={task?.tags ?? []}
        variant={variant}
      />
    )),
  ]
}
