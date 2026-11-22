import type {
  FlowInspectorDetail,
  FlowLogEntry,
  FlowStepStats,
} from '@tc96/parttens'

export const stepDetails: FlowInspectorDetail[] = [
  { id: 'type', label: 'Tipo', value: 'Enviar e-mail' },
  { id: 'name', label: 'Nome', value: 'Enviar cobrança' },
  {
    id: 'description',
    label: 'Descrição',
    value:
      'Envia ao cliente um e-mail com o link de pagamento e o resumo das faturas em aberto, e tenta de novo depois de uma hora se o provedor recusar a entrega.',
  },
  { id: 'owner', label: 'Responsável', owner: { name: 'Ana Souza' } },
  { id: 'inputs', label: 'Entradas', value: '1 passo' },
  { id: 'outputs', label: 'Saídas', value: '2 passos' },
]

export const lastRun = {
  durationMs: 1800,
  runId: 'run_8f21',
}

export const testRunStats: FlowStepStats = { completed: 6, entered: 8 }

export const logEntries: FlowLogEntry[] = [
  {
    description: 'Passed: 1.842 tokens, USD 0,031',
    id: 'log-1',
    sequence: 1,
    status: 'success',
    stepId: 'model',
    stepName: 'Claude',
  },
  {
    description: 'Falhou: caixa de entrada inválida',
    id: 'log-2',
    sequence: 2,
    status: 'failed',
    stepId: 'send-email',
    stepName: 'Enviar e-mail',
  },
  {
    description: 'Branch not taken',
    id: 'log-3',
    sequence: 3,
    status: 'skipped',
    stepId: 'slack',
    stepName: 'Avisar no Slack',
  },
]
