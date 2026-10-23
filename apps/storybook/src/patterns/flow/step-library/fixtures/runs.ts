import type { FlowRunSummary } from '@tc96/parttens'

export const failedRun: FlowRunSummary = {
  completed: 2,
  id: 'run-1042',
  note: 'Enviar e-mail falhou: caixa de entrada cheia',
  status: 'failed',
  total: 5,
}

export const passedRun: FlowRunSummary = {
  completed: 5,
  id: 'run-1041',
  status: 'success',
  total: 5,
}

export const notRunRun: FlowRunSummary = {
  completed: 0,
  status: 'not-run',
  total: 5,
}
