import type { Stats1Labels } from './types'

export const defaultStats1Labels: Stats1Labels = {
  actions: (label) => `Ações de ${label}`,
  details: 'Ver detalhes',
  emptyDescription: 'Os indicadores aparecem aqui quando houver dados.',
  emptyTitle: 'Nenhum indicador ainda',
  export: 'Exportar',
  title: 'Indicadores',
  trend: { down: 'Queda de', flat: 'Sem variação', up: 'Alta de' },
}
