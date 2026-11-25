import type {
  Projects1Expanded,
  Projects1Person,
  Projects1RowAction,
  Projects1Sort,
  Projects1Status,
  Projects1Task,
  Projects1View,
  Projects1ViewCounts,
} from '@tc96/ui/blocks/data/projects/projects-1'

const person = (id: string, label: string): Projects1Person => ({ id, label })

const people = {
  emilio: person('emilio', 'Emílio Novaes'),
  jonas: person('jonas', 'Jonas Ribeiro'),
  marina: person('marina', 'Marina Peres'),
  noemi: person('noemi', 'Noemi Kato'),
  paulo: person('paulo', 'Paulo Sá'),
}

export const tasks: Projects1Task[] = [
  {
    assignee: people.marina,
    id: 'task-1',
    priority: 'urgent',
    project: 'API de registro',
    status: 'inProgress',
    subtasks: [
      {
        assignee: people.marina,
        id: 'task-1-1',
        priority: 'urgent',
        project: 'API de registro',
        status: 'done',
        title: 'Fechar o formato do payload de licença assinado',
      },
      {
        assignee: people.jonas,
        id: 'task-1-2',
        priority: 'high',
        project: 'API de registro',
        status: 'done',
        title: 'Validar a rotação de assinatura das instalações privadas',
      },
      {
        assignee: people.emilio,
        id: 'task-1-3',
        priority: 'urgent',
        project: 'API de registro',
        status: 'inProgress',
        title: 'Bloquear reenvio de links de instalação expirados',
      },
      {
        assignee: people.marina,
        id: 'task-1-4',
        priority: 'medium',
        project: 'API de registro',
        status: 'inProgress',
        title: 'Documentar o fluxo alternativo para licenças inválidas',
      },
    ],
    title: 'Concluir o handshake do registro para instalações privadas',
  },
  {
    assignee: people.jonas,
    id: 'task-2',
    priority: 'urgent',
    project: 'Acesso ao workspace',
    status: 'todo',
    title: 'Revisar a invalidação de sessão ao mudar papéis do workspace',
  },
  {
    assignee: people.paulo,
    id: 'task-3',
    priority: 'urgent',
    project: 'Métricas de lançamento',
    status: 'inProgress',
    subtasks: [
      {
        assignee: people.paulo,
        id: 'task-3-1',
        priority: 'high',
        project: 'Métricas de lançamento',
        status: 'todo',
        title: 'Definir as faixas de saúde por projeto',
      },
      {
        assignee: people.noemi,
        id: 'task-3-2',
        priority: 'medium',
        project: 'Métricas de lançamento',
        status: 'review',
        title: 'Desenhar o selo de saúde na central de lançamento',
      },
    ],
    title: 'Ligar os selos de saúde do projeto à central de lançamento',
  },
  {
    assignee: people.noemi,
    id: 'task-4',
    priority: 'high',
    project: 'Acesso ao workspace',
    status: 'todo',
    subtasks: [
      {
        assignee: people.noemi,
        id: 'task-4-1',
        priority: 'medium',
        project: 'Acesso ao workspace',
        status: 'todo',
        title: 'Escrever o texto do estado vazio de convites',
      },
    ],
    title: 'Desenhar estados vazios para convites de assento expirando',
  },
  {
    assignee: people.emilio,
    id: 'task-5',
    priority: 'high',
    project: 'Entrega de tarefas',
    status: 'review',
    subtasks: [
      {
        assignee: people.emilio,
        id: 'task-5-1',
        priority: 'high',
        project: 'Entrega de tarefas',
        status: 'done',
        title: 'Registrar o autor de cada mudança de status',
      },
      {
        assignee: people.jonas,
        id: 'task-5-2',
        priority: 'low',
        project: 'Entrega de tarefas',
        status: 'review',
        title: 'Expor a trilha de auditoria na API pública',
      },
    ],
    title: 'Adicionar trilha de auditoria às mudanças de status das tarefas',
  },
  {
    assignee: people.marina,
    id: 'task-6',
    priority: 'medium',
    project: 'Faturamento',
    status: 'inProgress',
    title: 'Migrar as faturas antigas para o novo layout',
  },
  {
    assignee: people.paulo,
    id: 'task-7',
    priority: 'medium',
    project: 'Faturamento',
    status: 'todo',
    title: 'Enviar lembrete antes do vencimento do cartão',
  },
  {
    assignee: people.jonas,
    id: 'task-8',
    priority: 'high',
    project: 'API de registro',
    status: 'review',
    title: 'Limitar a taxa de chamadas do endpoint de ativação',
  },
  {
    assignee: people.noemi,
    id: 'task-9',
    priority: 'low',
    project: 'Métricas de lançamento',
    status: 'todo',
    title: 'Exportar o painel de lançamento em CSV',
  },
  {
    assignee: people.emilio,
    id: 'task-10',
    priority: 'medium',
    project: 'Acesso ao workspace',
    status: 'inProgress',
    title: 'Aceitar login único por domínio verificado',
  },
  {
    assignee: people.marina,
    id: 'task-11',
    priority: 'low',
    project: 'Entrega de tarefas',
    status: 'backlog',
    title: 'Agrupar notificações de tarefas por projeto',
  },
  {
    assignee: people.paulo,
    id: 'task-12',
    priority: 'medium',
    project: 'Faturamento',
    status: 'backlog',
    title: 'Permitir notas fiscais em lote',
  },
  {
    assignee: people.jonas,
    id: 'task-13',
    priority: 'low',
    project: 'Métricas de lançamento',
    status: 'backlog',
    title: 'Comparar lançamentos por trimestre',
  },
  {
    assignee: people.noemi,
    id: 'task-14',
    priority: 'high',
    project: 'Acesso ao workspace',
    status: 'backlog',
    title: 'Auditar permissões herdadas de grupos',
  },
  {
    assignee: people.emilio,
    id: 'task-15',
    priority: 'medium',
    project: 'API de registro',
    status: 'done',
    title: 'Publicar o changelog da versão 2 da API',
  },
  {
    assignee: people.marina,
    id: 'task-16',
    priority: 'low',
    project: 'Entrega de tarefas',
    status: 'done',
    title: 'Renomear o quadro de entregas',
  },
]

const activeStatuses: readonly Projects1Status[] = [
  'todo',
  'inProgress',
  'review',
]

export const tasksForView = (
  view: Projects1View,
  list: Projects1Task[] = tasks,
): Projects1Task[] => {
  if (view === 'active')
    return list.filter((task) => activeStatuses.includes(task.status))
  if (view === 'backlog')
    return list.filter((task) => task.status === 'backlog')
  return list
}

export const viewCounts: Projects1ViewCounts = {
  active: tasksForView('active').length,
  all: tasks.length,
  backlog: tasksForView('backlog').length,
}

export const initialExpanded: Projects1Expanded = { 'task-1': true }

export const initialSort: Projects1Sort | null = null

export const rowActions: Projects1RowAction[] = [
  { id: 'open', label: 'Abrir' },
  { id: 'assign', label: 'Reatribuir' },
  { destructive: true, id: 'archive', label: 'Arquivar' },
]
