import type { StatsLoadLabels } from './types'

export const defaultStatsLoadLabels: Pick<
  StatsLoadLabels,
  'errorDescription' | 'retry'
> = {
  errorDescription: 'Verifique sua conexão e tente novamente.',
  retry: 'Tentar novamente',
}
