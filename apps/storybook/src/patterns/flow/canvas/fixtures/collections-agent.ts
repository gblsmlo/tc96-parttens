import {
  type FlowConnection,
  type FlowStep,
  type FlowStepType,
  flowStepNodeSize,
  tidyTree,
} from '@tc96/parttens'

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
  {
    group: 'Ferramentas',
    id: 'escalate',
    kind: 'action',
    label: 'Escalar para o time',
  },
]

const tokens = ['1.842 tokens', 'US$ 0,031']

const steps: FlowStep[] = [
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
    run: { metrics: ['0,3s'], status: 'success' },
    type: 'escalate',
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
    taken: true,
  },
]

export const collectionsSteps: FlowStep[] = tidyTree(
  steps,
  collectionsConnections,
  { direction: 'vertical', gap: [48, 88], nodeSize: flowStepNodeSize },
)
