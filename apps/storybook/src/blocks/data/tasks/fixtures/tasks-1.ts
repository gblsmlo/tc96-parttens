import type {
  TasksOption,
  TasksPerson,
  TasksTag,
  TasksTask,
} from '@tc96/ui/blocks/data/tasks/tasks-1'

export const kinds: TasksOption[] = [
  { id: 'website', label: 'Website redesign' },
  { id: 'mobile', label: 'Mobile app 2.0' },
  { id: 'billing', label: 'Billing migration' },
  { id: 'onboarding', label: 'Customer onboarding' },
]

export const people: TasksPerson[] = [
  { id: 'ana', label: 'Ana Ferraz' },
  { id: 'bruno', label: 'Bruno Lacerda' },
  { id: 'carla', label: 'Carla Mendes' },
  { id: 'diego', label: 'Diego Sato' },
  { id: 'elisa', label: 'Elisa Prado' },
]

export const tags: TasksTag[] = [
  { id: 'bug', label: 'Bug', tone: 'danger' },
  { id: 'design', label: 'Design', tone: 'success' },
  { id: 'backend', label: 'Backend', tone: 'info' },
  { id: 'docs', label: 'Docs', tone: 'neutral' },
]

export const tasks: TasksTask[] = [
  {
    assigneeIds: ['ana', 'carla'],
    creatorId: 'ana',

    dueAt: '2026-11-20',
    id: 'task-101',
    overdue: true,
    priority: 'urgent',
    kindId: 'billing',
    status: 'in-progress',
    tagIds: ['backend', 'bug'],
    title: 'Fix duplicate charges on annual plans',
    updatedAt: '2026-11-25T13:42:00.000Z',
  },
  {
    assigneeIds: ['bruno'],
    creatorId: 'bruno',

    dueAt: '2026-11-28',
    id: 'task-102',
    priority: 'high',
    kindId: 'website',
    status: 'todo',
    tagIds: ['design'],
    title: 'Redesign the pricing page hero',
    updatedAt: '2026-11-25T11:05:00.000Z',
  },
  {
    assigneeIds: ['diego'],
    creatorId: 'carla',

    dueAt: '2026-12-02',
    id: 'task-103',
    priority: 'medium',
    kindId: 'mobile',
    status: 'in-progress',
    tagIds: [],
    title: 'Add offline mode to the task list',
    updatedAt: '2026-11-24T18:20:00.000Z',
  },
  {
    assigneeIds: [],
    creatorId: 'diego',

    dueAt: null,
    id: 'task-104',
    priority: null,
    kindId: null,
    status: 'todo',
    tagIds: ['docs'],
    title: 'Write the API rate limit guide',
    updatedAt: '2026-11-24T09:12:00.000Z',
  },
  {
    assigneeIds: ['elisa', 'ana'],
    creatorId: 'elisa',

    dueAt: '2026-11-22',
    id: 'task-105',
    priority: 'low',
    kindId: 'onboarding',
    status: 'done',
    tagIds: [],
    title: 'Record the welcome walkthrough video',
    updatedAt: '2026-11-23T16:48:00.000Z',
  },
  {
    assigneeIds: ['carla'],
    creatorId: 'ana',

    dueAt: '2026-11-21',
    id: 'task-106',
    overdue: true,
    priority: 'high',
    kindId: 'billing',
    status: 'todo',
    tagIds: ['backend'],
    title: 'Migrate invoices to the new ledger',
    updatedAt: '2026-11-23T10:30:00.000Z',
  },
  {
    assigneeIds: ['bruno', 'diego', 'elisa'],
    creatorId: 'bruno',

    dueAt: '2026-12-05',
    id: 'task-107',
    priority: 'medium',
    kindId: 'website',
    status: 'in-progress',
    tagIds: ['design', 'docs'],
    title: 'Update the design tokens documentation',
    updatedAt: '2026-11-22T14:15:00.000Z',
  },
  {
    assigneeIds: ['ana'],
    creatorId: 'carla',

    dueAt: '2026-11-15',
    id: 'task-108',
    priority: 'medium',
    kindId: 'mobile',
    status: 'done',
    tagIds: [],
    title: 'Prototype the tablet layout',
    updatedAt: '2026-11-21T08:00:00.000Z',
  },
  {
    assigneeIds: ['diego'],
    creatorId: 'diego',

    dueAt: '2026-11-27',
    id: 'task-109',
    priority: 'urgent',
    kindId: 'mobile',
    status: 'todo',
    tagIds: ['bug'],
    title: 'Crash when opening a shared link',
    updatedAt: '2026-11-21T07:35:00.000Z',
  },
  {
    assigneeIds: ['elisa'],
    creatorId: 'elisa',

    dueAt: '2026-12-10',
    id: 'task-110',
    priority: 'low',
    kindId: 'onboarding',
    status: 'todo',
    tagIds: [],
    title: 'Translate the onboarding checklist',
    updatedAt: '2026-11-20T17:22:00.000Z',
  },
  {
    assigneeIds: ['bruno'],
    creatorId: 'ana',

    dueAt: '2026-11-18',
    id: 'task-111',
    priority: 'high',
    kindId: 'website',
    status: 'done',
    tagIds: [],
    title: 'Ship the new blog template',
    updatedAt: '2026-11-19T12:40:00.000Z',
  },
  {
    assigneeIds: ['carla', 'elisa'],
    creatorId: 'bruno',

    dueAt: '2026-12-01',
    id: 'task-112',
    priority: 'medium',
    kindId: 'billing',
    status: 'in-progress',
    tagIds: ['backend'],
    title: 'Reconcile failed payment webhooks',
    updatedAt: '2026-11-19T09:05:00.000Z',
  },
]

export interface Tasks1Page {
  items: TasksTask[]
  total: number
}

export const pageSize = 6
