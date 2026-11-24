import type { ImpactMapLabels } from './types'

export const defaultImpactMapLabels: ImpactMapLabels = {
  emptyDescription:
    'Os nós aparecem aqui assim que houver iniciativas e métricas.',
  emptyTitle: 'Nenhum nó no mapa',
  errorDescription: 'Tente novamente em instantes.',
  errorTitle: 'Não foi possível carregar o mapa de impacto',
  kinds: {
    initiative: 'Iniciativa',
    metric: 'Métrica',
    'north-star': 'North star',
  },
  loading: 'Carregando mapa de impacto',
  map: 'Árvore de impacto',
  owner: (name) => `Responsável: ${name}`,
  progress: (title, value) => `Progresso de ${title}: ${value}%`,
  retry: 'Tentar novamente',
  title: 'Mapa de impacto de crescimento',
}
