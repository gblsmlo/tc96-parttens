import type {
  Dashboard4FilterOption,
  Dashboard4Metric,
  Dashboard4Module,
  Dashboard4Person,
  Dashboard4RowAction,
  Dashboard4Sort,
} from '@tc96/ui/blocks/application/dashboard/dashboard-4'

const wave = (base: number, swing: number, days = 28) =>
  Array.from({ length: days }, (_, day) =>
    Math.round(
      base +
        swing * Math.sin(day / 2.2) +
        (swing / 2) * Math.cos(day / 1.3) +
        (day * swing) / 40,
    ),
  )

const revenuePoints = wave(2100, 420)
const signupPoints = wave(150, 38)
const licensePoints = Array.from(
  { length: 28 },
  (_, day) => 2860 + day * 15 + Math.round(12 * Math.sin(day)),
)

const sum = (points: number[]) => points.reduce((total, point) => total + point)

export const metrics: Dashboard4Metric[] = [
  {
    caption: 'loja.tc96.io, 28 dias',
    format: 'currency',
    id: 'revenue',
    label: 'Receita',
    points: revenuePoints,
    value: sum(revenuePoints),
  },
  {
    caption: 'Últimos 28 dias',
    id: 'signups',
    label: 'Cadastros',
    points: signupPoints,
    value: sum(signupPoints),
  },
  {
    caption: 'Nuvem, 28 dias',
    id: 'licenses',
    label: 'Licenças ativas',
    points: licensePoints,
    value: licensePoints.at(-1) ?? 0,
  },
]

const person = (id: string, label: string): Dashboard4Person => ({ id, label })

const nora = person('nora', 'Nora Vale')
const lena = person('lena', 'Lena Wade')
const sofia = person('sofia', 'Sofia Romero')
const kenji = person('kenji', 'Kenji Tan')
const nina = person('nina', 'Nina Santos')
const elijah = person('elijah', 'Elijah Morgan')
const jonah = person('jonah', 'Jonah Lee')

export const team: Dashboard4Person[] = [
  nora,
  lena,
  sofia,
  kenji,
  nina,
  elijah,
  jonah,
  person('ana', 'Ana Ribeiro'),
  person('bruno', 'Bruno Lima'),
  person('carla', 'Carla Mendes'),
  person('davi', 'Davi Rocha'),
]

const statuses = {
  backlog: { label: 'Backlog', tone: 'secondary' },
  done: { label: 'Concluído', tone: 'success' },
  progress: { label: 'Em andamento', tone: 'warning' },
  planned: { label: 'Planejado', tone: 'info' },
} as const satisfies Record<string, Dashboard4Module['status']>

export type ModuleStatus = keyof typeof statuses

export interface ModuleRecord extends Dashboard4Module {
  startsAt: string
  statusId: ModuleStatus
}

const module = (
  id: string,
  name: string,
  kind: string,
  owner: Dashboard4Person,
  domain: string,
  [tasksDone, tasksTotal]: [number, number],
  [startsAt, window, windowDays]: [string, string, number],
  statusId: ModuleStatus,
  favorite = false,
): ModuleRecord => ({
  domain: `${domain}.tc96.io`,
  favorite,
  id,
  kind,
  name,
  owner,
  startsAt,
  status: statuses[statusId],
  statusId,
  tasksDone,
  tasksTotal,
  window,
  windowDays,
})

export const modules: ModuleRecord[] = [
  module(
    'm1',
    'Matriz de acesso',
    'Sistema',
    nora,
    'admin',
    [11, 26],
    ['2026-04-22', '22 abr – 06 mai', 14],
    'progress',
  ),
  module(
    'm2',
    'Console de API',
    'Recurso',
    lena,
    'api',
    [29, 32],
    ['2026-04-12', '12 abr – 26 abr', 14],
    'progress',
    true,
  ),
  module(
    'm3',
    'Biblioteca de blocos',
    'Recurso',
    sofia,
    'blocks',
    [10, 30],
    ['2026-04-24', '24 abr – 10 mai', 16],
    'planned',
  ),
  module(
    'm4',
    'Retenção de dados',
    'Sistema',
    kenji,
    'privacy',
    [7, 32],
    ['2026-04-27', '27 abr – 14 mai', 17],
    'backlog',
  ),
  module(
    'm5',
    'Portal de documentação',
    'Área',
    nina,
    'docs',
    [0, 14],
    ['2026-04-21', '21 abr – 05 mai', 14],
    'progress',
  ),
  module(
    'm6',
    'Central de ajuda',
    'Área',
    sofia,
    'help',
    [9, 23],
    ['2026-04-23', '23 abr – 11 mai', 18],
    'planned',
  ),
  module(
    'm7',
    'Hub de integrações',
    'Área',
    kenji,
    'integrations',
    [14, 24],
    ['2026-04-20', '20 abr – 04 mai', 14],
    'progress',
  ),
  module(
    'm8',
    'Cobrança de licenças',
    'Recurso',
    elijah,
    'billing',
    [21, 33],
    ['2026-04-18', '18 abr – 02 mai', 14],
    'progress',
    true,
  ),
  module(
    'm9',
    'Onboarding Pro',
    'Recurso',
    jonah,
    'pro',
    [0, 18],
    ['2026-04-19', '19 abr – 03 mai', 14],
    'backlog',
  ),
  module(
    'm10',
    'Sincronização do registro',
    'Sistema',
    nora,
    'registry',
    [8, 32],
    ['2026-04-17', '17 abr – 01 mai', 14],
    'planned',
  ),
  module(
    'm11',
    'Índice de busca',
    'Sistema',
    lena,
    'search',
    [20, 20],
    ['2026-04-10', '10 abr – 24 abr', 14],
    'done',
  ),
  module(
    'm12',
    'Página de status',
    'Área',
    jonah,
    'status',
    [26, 26],
    ['2026-04-08', '08 abr – 22 abr', 14],
    'done',
  ),
  module(
    'm13',
    'Estúdio de temas',
    'Recurso',
    elijah,
    'themes',
    [5, 19],
    ['2026-04-28', '28 abr – 12 mai', 14],
    'planned',
  ),
  module(
    'm14',
    'Análise de uso',
    'Recurso',
    nina,
    'analytics',
    [12, 28],
    ['2026-04-25', '25 abr – 09 mai', 14],
    'progress',
  ),
  module(
    'm15',
    'Webhooks',
    'Sistema',
    kenji,
    'hooks',
    [3, 15],
    ['2026-04-29', '29 abr – 13 mai', 14],
    'backlog',
  ),
  module(
    'm16',
    'Log de auditoria',
    'Sistema',
    nora,
    'audit',
    [16, 22],
    ['2026-04-15', '15 abr – 29 abr', 14],
    'progress',
  ),
  module(
    'm17',
    'Espaços de equipe',
    'Área',
    sofia,
    'teams',
    [0, 12],
    ['2026-05-01', '01 mai – 15 mai', 14],
    'backlog',
  ),
]

export const initialSort: Dashboard4Sort = { direction: 'asc', key: 'name' }

export const initialFilter = 'all'

export const moduleActions: Dashboard4RowAction[] = [
  { id: 'duplicate', label: 'Duplicar' },
  { destructive: true, id: 'archive', label: 'Arquivar' },
]

const statusOrder: ModuleStatus[] = ['progress', 'planned', 'backlog', 'done']

export const filterOptionsFor = (
  rows: ModuleRecord[],
): Dashboard4FilterOption[] => [
  { count: rows.length, label: 'Todos', value: 'all' },
  ...statusOrder.map((statusId) => ({
    count: rows.filter((row) => row.statusId === statusId).length,
    label: statuses[statusId].label,
    value: statusId,
  })),
]

export const filterModules = (rows: ModuleRecord[], filter: string) =>
  filter === 'all' ? rows : rows.filter((row) => row.statusId === filter)

const collator = new Intl.Collator('pt-BR')

const ratio = (row: ModuleRecord) =>
  row.tasksTotal > 0 ? row.tasksDone / row.tasksTotal : 0

export const sortModules = (rows: ModuleRecord[], sort: Dashboard4Sort) => {
  const compare = {
    name: (a: ModuleRecord, b: ModuleRecord) =>
      collator.compare(a.name, b.name),
    progress: (a: ModuleRecord, b: ModuleRecord) => ratio(a) - ratio(b),
    status: (a: ModuleRecord, b: ModuleRecord) =>
      statusOrder.indexOf(a.statusId) - statusOrder.indexOf(b.statusId),
    window: (a: ModuleRecord, b: ModuleRecord) =>
      a.startsAt.localeCompare(b.startsAt),
  }[sort.key]
  const sign = sort.direction === 'asc' ? 1 : -1
  return [...rows].sort((a, b) => sign * compare(a, b))
}

export const pageModules = (
  rows: ModuleRecord[],
  page: number,
  pageSize: number,
) => {
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const current = Math.min(Math.max(page, 1), pageCount)
  const start = (current - 1) * pageSize
  const pageRows = rows.slice(start, start + pageSize)
  return {
    pagination: {
      from: pageRows.length ? start + 1 : 0,
      page: current,
      pageCount,
      to: start + pageRows.length,
      total: rows.length,
    },
    rows: pageRows,
  }
}
