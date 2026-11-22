import type {
  PersonPropertyOption,
  SelectPropertyOption,
  TagsPropertyOption,
} from '@tc96/parttens'
import {
  CircleCheckIcon,
  CircleDotIcon,
  CircleIcon,
  CircleSlashIcon,
  SignalHighIcon,
  SignalLowIcon,
  SignalMediumIcon,
} from 'lucide-react'

export const statusOptions: readonly SelectPropertyOption[] = [
  { icon: CircleIcon, label: 'To do', tone: 'neutral', value: 'todo' },
  {
    icon: CircleDotIcon,
    label: 'In progress',
    tone: 'info',
    value: 'inProgress',
  },
  { icon: CircleCheckIcon, label: 'Done', tone: 'success', value: 'done' },
  {
    icon: CircleSlashIcon,
    label: 'Canceled',
    tone: 'neutral',
    value: 'canceled',
  },
]

export const priorityOptions: readonly SelectPropertyOption[] = [
  { icon: SignalHighIcon, label: 'High', tone: 'danger', value: 'high' },
  { icon: SignalMediumIcon, label: 'Medium', tone: 'warning', value: 'medium' },
  { icon: SignalLowIcon, label: 'Low', tone: 'neutral', value: 'low' },
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
