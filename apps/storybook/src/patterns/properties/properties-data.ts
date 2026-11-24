import {
  CellSignalHighIcon,
  CellSignalLowIcon,
  CellSignalMediumIcon,
  CheckCircleIcon,
  CircleIcon,
  ProhibitIcon,
  RadioButtonIcon,
} from '@phosphor-icons/react'
import type {
  PersonPropertyOption,
  SelectPropertyOption,
  TagsPropertyOption,
} from '@tc96/parttens'

export const statusOptions: readonly SelectPropertyOption[] = [
  { icon: CircleIcon, label: 'To do', tone: 'neutral', value: 'todo' },
  {
    icon: RadioButtonIcon,
    label: 'In progress',
    tone: 'info',
    value: 'inProgress',
  },
  { icon: CheckCircleIcon, label: 'Done', tone: 'success', value: 'done' },
  {
    icon: ProhibitIcon,
    label: 'Canceled',
    tone: 'neutral',
    value: 'canceled',
  },
]

export const priorityOptions: readonly SelectPropertyOption[] = [
  { icon: CellSignalHighIcon, label: 'High', tone: 'danger', value: 'high' },
  {
    icon: CellSignalMediumIcon,
    label: 'Medium',
    tone: 'warning',
    value: 'medium',
  },
  { icon: CellSignalLowIcon, label: 'Low', tone: 'neutral', value: 'low' },
]

export const people: readonly PersonPropertyOption[] = [
  { label: 'Bruno Lima', value: 'person-1' },
  { label: 'Ana Souza', value: 'person-2' },
]

export const tagOptions: readonly TagsPropertyOption[] = [
  { label: 'Documents', value: 'documents' },
  { label: 'Follow-up', value: 'return' },
]

export const taskItemIds = [
  'status',
  'priority',
  'assignee',
  'dueDate',
  'tags',
] as const

export type TaskItemId = (typeof taskItemIds)[number]
