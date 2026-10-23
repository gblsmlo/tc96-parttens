import { flowStepNodeSize, tidyTree } from '@tc96/parttens/flow/canvas/core'
import type {
  AssistantSuggestion,
  FlowConnection,
  FlowLogEntry,
  FlowStep,
  FlowStepStats,
  FlowStepType,
} from '@tc96/templates/application/flow/agent-builder'
import type { IconModule } from '@thesvg/icons'
import anthropic from '@thesvg/icons/anthropic'
import neon from '@thesvg/icons/neon'
import resend from '@thesvg/icons/resend'
import stripe from '@thesvg/icons/stripe'
import type { ReactNode } from 'react'

function brand(icon: IconModule, mono = false): ReactNode {
  return (
    <img
      alt=""
      className={mono ? 'size-4 dark:invert' : 'size-4'}
      src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(icon.svg)}`}
    />
  )
}

export const collectionsStepTypes: FlowStepType[] = [
  {
    group: 'Gatilhos',
    id: 'invoice',
    kind: 'trigger',
    label: 'Fatura vencida',
  },
  {
    group: 'Dados',
    id: 'customer',
    kind: 'action',
    label: 'Consultar cliente',
  },
  {
    group: 'Modelos',
    id: 'decide',
    kind: 'condition',
    label: 'Decidir abordagem',
  },
  { group: 'Mensagens', id: 'email', kind: 'action', label: 'Enviar e-mail' },
  {
    group: 'Ferramentas',
    id: 'schedule',
    kind: 'action',
    label: 'Agendar retorno',
  },
]

export const collectionsIcons: Record<string, ReactNode> = {
  customer: brand(neon),
  decide: brand(anthropic, true),
  email: brand(resend, true),
  invoice: brand(stripe),
  schedule: brand(neon),
}

const tokens = ['1.842 tokens', 'US$ 0,031']

const rawSteps: FlowStep[] = [
  {
    description: 'Webhook de cobrança',
    id: 'invoice',
    name: 'Fatura vencida',
    position: { x: 0, y: 0 },
    run: { metrics: ['0,2s'], status: 'success' },
    type: 'invoice',
  },
  {
    description: 'Histórico de pagamentos',
    id: 'customer',
    name: 'Consultar cliente',
    position: { x: 0, y: 0 },
    run: { metrics: ['0,4s', '120 linhas'], status: 'success' },
    type: 'customer',
  },
  {
    description: 'Escolhe o tom da cobrança',
    id: 'decide',
    name: 'Decidir abordagem',
    position: { x: 0, y: 0 },
    run: { metrics: tokens, status: 'success' },
    type: 'decide',
  },
  {
    description: 'Lembrete cordial',
    id: 'reminder',
    name: 'Enviar lembrete',
    position: { x: 0, y: 0 },
    run: { metrics: ['0,6s'], status: 'success' },
    type: 'email',
  },
  {
    description: 'Retorno em três dias',
    id: 'follow-up',
    name: 'Agendar retorno',
    position: { x: 0, y: 0 },
    run: { metrics: ['0,3s'], status: 'success' },
    type: 'schedule',
  },
  {
    description: 'Passa o caso para uma pessoa',
    id: 'dispute',
    name: 'Escalar contestação',
    position: { x: 0, y: 0 },
    run: { status: 'skipped' },
    type: 'email',
  },
]

export const collectionsConnections: FlowConnection[] = [
  {
    id: 'invoice-customer',
    source: 'invoice',
    target: 'customer',
    taken: true,
  },
  { id: 'customer-decide', source: 'customer', target: 'decide', taken: true },
  {
    id: 'decide-reminder',
    label: 'Sem resposta',
    source: 'decide',
    target: 'reminder',
    taken: true,
  },
  {
    id: 'decide-follow-up',
    label: 'Prometeu pagar',
    source: 'decide',
    target: 'follow-up',
    taken: true,
  },
  {
    id: 'decide-dispute',
    label: 'Contestou',
    source: 'decide',
    target: 'dispute',
  },
]

export const collectionsSteps: FlowStep[] = tidyTree(
  rawSteps,
  collectionsConnections,
  { direction: 'vertical', gap: [48, 88], nodeSize: flowStepNodeSize },
)

export const collectionsFailedSteps: FlowStep[] = collectionsSteps.map(
  (step) => {
    if (step.id === 'reminder')
      return {
        ...step,
        run: {
          metrics: ['0,6s'],
          note: 'O Resend recusou o domínio de envio',
          status: 'failed' as const,
        },
      }
    if (step.id === 'follow-up')
      return { ...step, run: { status: 'not-run' as const } }
    return step
  },
)

export const collectionsRunningSteps: FlowStep[] = collectionsSteps.map(
  (step) =>
    step.id === 'reminder'
      ? { ...step, run: { status: 'running' as const } }
      : step,
)

export const collectionsLogs: FlowLogEntry[] = [
  {
    description: 'Aprovado: 1.842 tokens, US$ 0,031',
    id: 'log-1',
    sequence: 1,
    status: 'success',
    stepId: 'decide',
    stepName: 'Decidir abordagem',
  },
  {
    description: 'Aprovado: lembrete enviado',
    id: 'log-2',
    sequence: 2,
    status: 'success',
    stepId: 'reminder',
    stepName: 'Enviar lembrete',
  },
]

export const collectionsStats: Record<string, FlowStepStats> = {
  decide: { completed: 9, entered: 10 },
  reminder: { completed: 6, entered: 6 },
}

export const collectionsSuggestions: AssistantSuggestion[] = [
  { id: 'why', label: 'Por que o passo de lembrete falhou?' },
  { id: 'cost', label: 'Quanto custa cada execução?' },
  { id: 'branch', label: 'Sugira um novo ramo' },
]
