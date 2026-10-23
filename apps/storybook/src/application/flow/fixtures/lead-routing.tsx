import type {
  AssistantMessage,
  AssistantSuggestion,
  FlowConnection,
  FlowLogEntry,
  FlowOwner,
  FlowStep,
  FlowStepStats,
  FlowStepType,
} from '@tc96/templates/application/flow/workflow-editor'
import {
  FileTextIcon,
  GitBranchIcon,
  ListPlusIcon,
  MailIcon,
  MessageSquareIcon,
  UserPlusIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'

export const leadRoutingStepTypes: FlowStepType[] = [
  {
    group: 'Gatilhos',
    id: 'form',
    kind: 'trigger',
    label: 'Formulário enviado',
  },
  { group: 'Fluxo', id: 'condition', kind: 'condition', label: 'Condição' },
  { group: 'Dados', id: 'crm', kind: 'action', label: 'Criar contato' },
  { group: 'Dados', id: 'list', kind: 'action', label: 'Adicionar à lista' },
  {
    group: 'Mensagens',
    id: 'slack',
    kind: 'action',
    label: 'Mensagem no Slack',
  },
  { group: 'Mensagens', id: 'email', kind: 'action', label: 'Enviar e-mail' },
]

export const leadRoutingIcons: Record<string, ReactNode> = {
  condition: <GitBranchIcon />,
  crm: <UserPlusIcon />,
  email: <MailIcon />,
  form: <FileTextIcon />,
  list: <ListPlusIcon />,
  slack: <MessageSquareIcon />,
}

export const leadRoutingOwners: FlowOwner[] = [
  { id: 'marina', name: 'Marina Costa' },
  { id: 'rafael', name: 'Rafael Lima' },
]

const marina = { name: 'Marina Costa' }
const rafael = { name: 'Rafael Lima' }

export const leadRoutingSteps: FlowStep[] = [
  {
    description: 'Webhook do site',
    id: 'form',
    name: 'Novo lead',
    owner: marina,
    position: { x: 0, y: 120 },
    run: { durationMs: 200, status: 'success' },
    type: 'form',
  },
  {
    description: 'Orçamento acima de R$ 5 mil',
    id: 'qualified',
    name: 'Lead qualificado?',
    owner: marina,
    position: { x: 320, y: 120 },
    run: { durationMs: 40, status: 'success' },
    type: 'condition',
  },
  {
    description: 'Cria o contato com o estágio Novo',
    id: 'crm',
    name: 'Criar contato no CRM',
    owner: rafael,
    position: { x: 640, y: 0 },
    run: { durationMs: 1200, status: 'success' },
    type: 'crm',
  },
  {
    description: 'Canal #vendas',
    id: 'slack',
    name: 'Avisar o time de vendas',
    owner: rafael,
    position: { x: 960, y: 0 },
    run: { durationMs: 800, status: 'success' },
    type: 'slack',
  },
  {
    description: 'Modelo de boas-vindas',
    id: 'welcome',
    name: 'Enviar boas-vindas',
    owner: rafael,
    position: { x: 1280, y: 0 },
    run: { durationMs: 600, status: 'success' },
    type: 'email',
  },
  {
    description: 'Lista de nutrição',
    id: 'newsletter',
    name: 'Adicionar à newsletter',
    owner: marina,
    position: { x: 640, y: 240 },
    run: { status: 'skipped' },
    type: 'list',
  },
]

export const leadRoutingConnections: FlowConnection[] = [
  { id: 'form-qualified', source: 'form', target: 'qualified', taken: true },
  {
    id: 'qualified-crm',
    label: 'Verdadeiro',
    source: 'qualified',
    target: 'crm',
    taken: true,
  },
  { id: 'crm-slack', source: 'crm', target: 'slack', taken: true },
  { id: 'slack-welcome', source: 'slack', target: 'welcome', taken: true },
  {
    id: 'qualified-newsletter',
    label: 'Falso',
    source: 'qualified',
    target: 'newsletter',
  },
]

export const leadRoutingFailedSteps: FlowStep[] = leadRoutingSteps.map(
  (step) => {
    if (step.id === 'slack')
      return {
        ...step,
        run: {
          durationMs: 800,
          note: 'Canal #vendas não encontrado',
          status: 'failed' as const,
        },
      }
    if (step.id === 'welcome')
      return { ...step, run: { status: 'not-run' as const } }
    return step
  },
)

export const leadRoutingRunningSteps: FlowStep[] = leadRoutingSteps.map(
  (step) => {
    if (step.id === 'slack')
      return { ...step, run: { status: 'running' as const } }
    if (step.id === 'welcome')
      return { ...step, run: { status: 'not-run' as const } }
    return step
  },
)

export const leadRoutingLogs: FlowLogEntry[] = [
  {
    description: 'Aprovado: lead recebido do formulário',
    id: 'log-1',
    sequence: 1,
    status: 'success',
    stepId: 'form',
    stepName: 'Novo lead',
  },
  {
    description: 'Aprovado: orçamento de R$ 8.000',
    id: 'log-2',
    sequence: 2,
    status: 'success',
    stepId: 'qualified',
    stepName: 'Lead qualificado?',
  },
  {
    description: 'Aprovado: contato criado',
    id: 'log-3',
    sequence: 3,
    status: 'success',
    stepId: 'crm',
    stepName: 'Criar contato no CRM',
  },
]

export const leadRoutingStats: Record<string, FlowStepStats> = {
  form: { completed: 8, entered: 8 },
  qualified: { completed: 8, entered: 8 },
  crm: { completed: 6, entered: 6 },
  slack: { completed: 5, entered: 6 },
}

export const leadRoutingMessages: AssistantMessage[] = []

export const leadRoutingSuggestions: AssistantSuggestion[] = [
  { id: 'why', label: 'Por que o passo de Slack falhou?' },
  { id: 'improve', label: 'Como posso melhorar este workflow?' },
  { id: 'summary', label: 'Resuma a última execução' },
]
