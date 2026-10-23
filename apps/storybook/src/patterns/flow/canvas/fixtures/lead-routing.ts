import type { FlowConnection, FlowStep, FlowStepType } from '@tc96/parttens'

export const leadRoutingStepTypes: FlowStepType[] = [
  {
    group: 'Gatilhos',
    id: 'form',
    kind: 'trigger',
    label: 'Formulário enviado',
  },
  { group: 'Fluxo', id: 'condition', kind: 'condition', label: 'Condição' },
  { group: 'Dados', id: 'crm', kind: 'action', label: 'Criar contato' },
  {
    group: 'Mensagens',
    id: 'slack',
    kind: 'action',
    label: 'Mensagem no Slack',
  },
  { group: 'Mensagens', id: 'email', kind: 'action', label: 'Enviar e-mail' },
  { group: 'Dados', id: 'list', kind: 'action', label: 'Adicionar à lista' },
]

export const leadRoutingSteps: FlowStep[] = [
  {
    description: 'Webhook do site',
    id: 'form',
    name: 'Novo lead',
    owner: { name: 'Marina Costa' },
    position: { x: 0, y: 120 },
    run: { durationMs: 200, status: 'success' },
    type: 'form',
  },
  {
    description: 'Orçamento acima de R$ 5 mil',
    id: 'qualified',
    name: 'Lead qualificado?',
    owner: { name: 'Marina Costa' },
    position: { x: 320, y: 120 },
    run: { durationMs: 40, status: 'success' },
    type: 'condition',
  },
  {
    description: 'Cria o contato com o estágio Novo',
    id: 'crm',
    name: 'Criar contato no CRM',
    owner: { name: 'Rafael Lima' },
    position: { x: 640, y: 0 },
    run: { durationMs: 1200, status: 'success' },
    type: 'crm',
  },
  {
    description: 'Canal #vendas',
    id: 'slack',
    name: 'Avisar o time de vendas',
    owner: { name: 'Rafael Lima' },
    position: { x: 960, y: 0 },
    run: {
      durationMs: 800,
      note: 'Canal #vendas não encontrado',
      status: 'failed',
    },
    type: 'slack',
  },
  {
    description: 'Modelo de boas-vindas',
    id: 'welcome',
    name: 'Enviar boas-vindas',
    owner: { name: 'Rafael Lima' },
    position: { x: 1280, y: 0 },
    run: { status: 'not-run' },
    type: 'email',
  },
  {
    description: 'Lista de nutrição',
    id: 'newsletter',
    name: 'Adicionar à newsletter',
    owner: { name: 'Marina Costa' },
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
  { id: 'slack-welcome', source: 'slack', target: 'welcome' },
  {
    id: 'qualified-newsletter',
    label: 'Falso',
    source: 'qualified',
    target: 'newsletter',
  },
]
