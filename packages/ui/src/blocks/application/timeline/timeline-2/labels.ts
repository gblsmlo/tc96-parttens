import type { Timeline2Labels } from './types'

export const defaultTimeline2Labels: Timeline2Labels = {
  emptyDescription: 'As versões publicadas aparecem aqui.',
  emptyTitle: 'Nenhuma versão publicada',
  errorDescription: 'Tente novamente em instantes.',
  errorTitle: 'Não foi possível carregar o histórico de versões',
  loading: 'Carregando histórico de versões',
  retry: 'Tentar novamente',
  title: 'Histórico de versões',
  types: { fix: 'Correção', improvement: 'Melhoria', new: 'Novo' },
}
