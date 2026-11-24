import type { Timeline3Labels } from './types'

export const defaultTimeline3Labels: Timeline3Labels = {
  approve: 'Aprovar',
  currentStep: 'Etapa atual',
  emptyDescription: 'As etapas aparecem aqui quando o fluxo for iniciado.',
  emptyTitle: 'Nenhuma etapa de aprovação',
  errorDescription: 'Tente novamente em instantes.',
  errorTitle: 'Não foi possível carregar as etapas',
  loading: 'Carregando etapas',
  reject: 'Recusar',
  retry: 'Tentar novamente',
  statuses: {
    approved: 'Aprovado',
    pending: 'Pendente',
    rejected: 'Recusado',
  },
  title: 'Fluxo de aprovação',
}
