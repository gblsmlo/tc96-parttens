import type { SelectPropertyOption } from '@tc96/parttens'
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CircleIcon,
  CircleXIcon,
  MinusIcon,
  SignalHighIcon,
  SignalLowIcon,
  SignalMediumIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import { z } from 'zod'

export const statusOptions: SelectPropertyOption[] = [
  { icon: CircleIcon, label: 'Backlog', tone: 'neutral', value: 'backlog' },
  {
    icon: CircleDashedIcon,
    label: 'Planned',
    tone: 'neutral',
    value: 'planned',
  },
  {
    icon: CircleDotIcon,
    label: 'In progress',
    tone: 'warning',
    value: 'in-progress',
  },
  {
    icon: CircleCheckIcon,
    label: 'Completed',
    tone: 'success',
    value: 'completed',
  },
  { icon: CircleXIcon, label: 'Canceled', tone: 'danger', value: 'canceled' },
]

export const priorityOptions: SelectPropertyOption[] = [
  { icon: MinusIcon, label: 'No priority', tone: 'neutral', value: 'none' },
  { icon: TriangleAlertIcon, label: 'Urgent', tone: 'danger', value: 'urgent' },
  { icon: SignalHighIcon, label: 'High', tone: 'warning', value: 'high' },
  { icon: SignalMediumIcon, label: 'Medium', tone: 'info', value: 'medium' },
  { icon: SignalLowIcon, label: 'Low', tone: 'neutral', value: 'low' },
]

export const people = [
  { fallback: 'AS', label: 'Ana Souza', value: 'ana' },
  { fallback: 'BL', label: 'Bruno Lima', value: 'bruno' },
  { fallback: 'CM', label: 'Carla Mendes', value: 'carla' },
]

export const repos = [
  'lemind/web',
  'lemind/api',
  'lemind/docs',
  'lemind/design',
]

export const extraProperties = [
  { id: 'startDate', label: 'Start date' },
  { id: 'targetDate', label: 'Target date' },
] as const

export const projectSchema = z.object({
  description: z.string().trim(),
  lead: z.string().nullable(),
  priority: z.enum(['none', 'urgent', 'high', 'medium', 'low']),
  repos: z.array(z.string()),
  startDate: z.string().nullable(),
  status: z.enum([
    'backlog',
    'planned',
    'in-progress',
    'completed',
    'canceled',
  ]),
  targetDate: z.string().nullable(),
  title: z.string().trim().min(1),
})

export type ProjectValues = z.infer<typeof projectSchema>

export function reposLabel(selected: readonly string[]) {
  const [first] = selected
  if (!first) return 'Repos'
  const name = first.split('/')[1] ?? first
  return selected.length > 1 ? `${name} +${selected.length - 1}` : name
}
