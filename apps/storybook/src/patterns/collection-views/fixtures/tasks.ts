import type {
  CalendarEventChipTone,
  CollectionDefinition,
  SelectPropertyOption,
} from '@tc96/parttens'
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CircleIcon,
  EyeIcon,
  SignalHighIcon,
  SignalLowIcon,
  SignalMediumIcon,
  TriangleAlertIcon,
} from 'lucide-react'

export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'

export interface Task {
  assigneeId: string
  description: string
  end: string | null
  estimate: number
  id: string
  isAllDay?: boolean
  priority: TaskPriority
  start: string
  status: TaskStatus
  title: string
}

export interface Person {
  id: string
  initials: string
  name: string
}

export const TIME_ZONE = 'America/Sao_Paulo'
export const ANCHOR = new Date('2026-10-14T15:00:00.000Z')
export const NOW = new Date('2026-10-14T16:30:00.000Z')

export const people: readonly Person[] = [
  { id: 'ana', initials: 'AS', name: 'Ana Souza' },
  { id: 'bruno', initials: 'BL', name: 'Bruno Lima' },
  { id: 'carla', initials: 'CM', name: 'Carla Mendes' },
  { id: 'diego', initials: 'DR', name: 'Diego Rocha' },
]

export const peopleById = new Map(people.map((person) => [person.id, person]))

export const statusOptions = [
  {
    icon: CircleDashedIcon,
    label: 'Backlog',
    tone: 'neutral',
    value: 'backlog',
  },
  { icon: CircleIcon, label: 'A fazer', tone: 'neutral', value: 'todo' },
  {
    icon: CircleDotIcon,
    label: 'Em andamento',
    tone: 'info',
    value: 'in-progress',
  },
  { icon: EyeIcon, label: 'Em revisão', tone: 'warning', value: 'review' },
  { icon: CircleCheckIcon, label: 'Concluída', tone: 'success', value: 'done' },
] as const satisfies readonly (SelectPropertyOption & { value: TaskStatus })[]

export const priorityOptions = [
  {
    icon: TriangleAlertIcon,
    label: 'Urgente',
    tone: 'danger',
    value: 'urgent',
  },
  { icon: SignalHighIcon, label: 'Alta', tone: 'warning', value: 'high' },
  { icon: SignalMediumIcon, label: 'Média', tone: 'info', value: 'medium' },
  { icon: SignalLowIcon, label: 'Baixa', tone: 'neutral', value: 'low' },
] as const satisfies readonly (SelectPropertyOption & {
  value: TaskPriority
})[]

export const isStatus = (value: string): value is TaskStatus =>
  statusOptions.some((option) => option.value === value)

export const isPriority = (value: string): value is TaskPriority =>
  priorityOptions.some((option) => option.value === value)

export const initialTasks: Task[] = [
  {
    assigneeId: 'ana',
    description: 'Fluxo de cadastro com e-mail e login social no app.',
    end: '2026-10-14T19:00:00.000Z',
    estimate: 16,
    id: 'TSK-101',
    priority: 'urgent',
    start: '2026-10-14T17:00:00.000Z',
    status: 'in-progress',
    title: 'Implementar onboarding',
  },
  {
    assigneeId: 'bruno',
    description:
      'Revisar contratos dos endpoints de pagamento com o time de backend.',
    end: '2026-10-13T15:30:00.000Z',
    estimate: 4,
    id: 'TSK-102',
    priority: 'high',
    start: '2026-10-13T14:00:00.000Z',
    status: 'review',
    title: 'Revisar API de pagamentos',
  },
  {
    assigneeId: 'carla',
    description: 'Telas finais de checkout e estados de erro no Figma.',
    end: null,
    estimate: 12,
    id: 'TSK-103',
    priority: 'high',
    start: '2026-10-15T20:00:00.000Z',
    status: 'todo',
    title: 'Entregar design do checkout',
  },
  {
    assigneeId: 'diego',
    description: 'Pipeline de build para as lojas com assinatura automática.',
    end: '2026-10-12T18:00:00.000Z',
    estimate: 8,
    id: 'TSK-104',
    priority: 'medium',
    start: '2026-10-12T16:00:00.000Z',
    status: 'done',
    title: 'Configurar CI mobile',
  },
  {
    assigneeId: 'ana',
    description: 'Disparo de push transacional para pedidos e lembretes.',
    end: null,
    estimate: 10,
    id: 'TSK-105',
    priority: 'medium',
    start: '2026-10-19T21:00:00.000Z',
    status: 'backlog',
    title: 'Notificações push',
  },
  {
    assigneeId: 'bruno',
    description: 'Cobrir o fluxo de compra com testes ponta a ponta.',
    end: '2026-10-16T17:00:00.000Z',
    estimate: 6,
    id: 'TSK-106',
    priority: 'high',
    start: '2026-10-16T13:00:00.000Z',
    status: 'todo',
    title: 'Testes E2E do checkout',
  },
  {
    assigneeId: 'carla',
    description: 'Planejamento do sprint com produto e engenharia.',
    end: '2026-10-14T14:00:00.000Z',
    estimate: 2,
    id: 'TSK-107',
    priority: 'low',
    start: '2026-10-14T13:00:00.000Z',
    status: 'done',
    title: 'Planning do sprint 21',
  },
  {
    assigneeId: 'diego',
    description: 'Janela de congelamento de código antes do envio às lojas.',
    end: '2026-10-23T03:00:00.000Z',
    estimate: 0,
    id: 'TSK-108',
    isAllDay: true,
    priority: 'urgent',
    start: '2026-10-21T03:00:00.000Z',
    status: 'todo',
    title: 'Code freeze da versão 2.0',
  },
  {
    assigneeId: 'ana',
    description: 'Ajustar contraste e rótulos para leitores de tela.',
    end: null,
    estimate: 5,
    id: 'TSK-109',
    priority: 'medium',
    start: '2026-10-20T18:00:00.000Z',
    status: 'in-progress',
    title: 'Auditoria de acessibilidade',
  },
  {
    assigneeId: 'bruno',
    description: 'Eventos de funil e painel de conversão do lançamento.',
    end: null,
    estimate: 7,
    id: 'TSK-110',
    priority: 'low',
    start: '2026-10-27T20:00:00.000Z',
    status: 'backlog',
    title: 'Instrumentar analytics',
  },
  {
    assigneeId: 'carla',
    description: 'Capturas, descrição e palavras-chave para App Store e Play.',
    end: '2026-10-22T18:00:00.000Z',
    estimate: 6,
    id: 'TSK-111',
    priority: 'medium',
    start: '2026-10-22T15:00:00.000Z',
    status: 'todo',
    title: 'Material das lojas',
  },
  {
    assigneeId: 'diego',
    description: 'Corrigir quedas reportadas no Android 15.',
    end: null,
    estimate: 9,
    id: 'TSK-112',
    priority: 'urgent',
    start: '2026-10-15T15:00:00.000Z',
    status: 'in-progress',
    title: 'Crash no Android 15',
  },
  {
    assigneeId: 'ana',
    description: 'Demo da versão beta para os stakeholders.',
    end: '2026-10-28T18:00:00.000Z',
    estimate: 1,
    id: 'TSK-113',
    priority: 'high',
    start: '2026-10-28T17:00:00.000Z',
    status: 'todo',
    title: 'Demo da beta',
  },
  {
    assigneeId: 'bruno',
    description: 'Documentar decisões de arquitetura do módulo offline.',
    end: null,
    estimate: 3,
    id: 'TSK-114',
    priority: 'low',
    start: '2026-10-09T19:00:00.000Z',
    status: 'review',
    title: 'ADR do modo offline',
  },
]

export const STATUS_TONE: Record<TaskStatus, CalendarEventChipTone> = {
  backlog: 'neutral',
  done: 'success',
  'in-progress': 'primary',
  review: 'warning',
  todo: 'neutral',
}

export const groupings: CollectionDefinition<Task>['groupings'] = [
  {
    getGroupId: (task) => task.status,
    id: 'status',
    label: 'Status',
    options: statusOptions.map((option) => ({
      id: option.value,
      label: option.label,
    })),
    setGroupId: (task, groupId) =>
      groupId && isStatus(groupId) ? { ...task, status: groupId } : task,
  },
  {
    getGroupId: (task) => task.assigneeId,
    id: 'assignee',
    label: 'Responsável',
    options: people.map((person) => ({ id: person.id, label: person.name })),
    setGroupId: (task, groupId) =>
      groupId && peopleById.has(groupId)
        ? { ...task, assigneeId: groupId }
        : task,
  },
  {
    getGroupId: (task) => task.priority,
    id: 'priority',
    label: 'Prioridade',
    options: priorityOptions.map((option) => ({
      id: option.value,
      label: option.label,
    })),
    setGroupId: (task, groupId) =>
      groupId && isPriority(groupId) ? { ...task, priority: groupId } : task,
  },
]

export const createCollection = (
  items: readonly Task[],
): CollectionDefinition<Task> => ({
  getKey: (task) => task.id,
  getLabel: (task) => task.title,
  groupings,
  items,
})

export const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: TIME_ZONE,
})

export const formatMinutes = (minutes: number | null) => {
  if (minutes === null) return null
  const hours = String(Math.floor(minutes / 60)).padStart(2, '0')
  return `${hours}:${String(minutes % 60).padStart(2, '0')}`
}
