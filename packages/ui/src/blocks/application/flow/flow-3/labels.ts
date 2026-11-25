import type { Flow3Labels } from './types'

export const defaultFlow3Labels: Flow3Labels = {
  approvalDescription: 'Este passo espera uma decisão para continuar.',
  approvalsTitle: 'Aguardando aprovação',
  approve: 'Aprovar',
  approveStep: (name) => `Aprovar ${name}`,
  canvas: 'Passos da execução',
  emptyDescription: 'Os passos aparecem aqui assim que a execução começar.',
  emptyTitle: 'Nenhum passo na execução',
  errorDescription: 'Tente novamente em instantes.',
  errorTitle: 'Não foi possível carregar a execução',
  loading: 'Carregando execução',
  noApprovals: 'Nenhuma aprovação pendente.',
  reject: 'Recusar',
  rejectStep: (name) => `Recusar ${name}`,
  replay: 'Reexecutar',
  retry: 'Tentar novamente',
  statuses: {
    failed: 'Falhou',
    pending: 'Pendente',
    running: 'Executando',
    succeeded: 'Concluído',
    'waiting-approval': 'Aguardando aprovação',
  },
  summary: (completed, total) => `${completed} de ${total} passos concluídos`,
  summaryTitle: 'Resumo da execução',
  title: 'Execução do pipeline',
}
