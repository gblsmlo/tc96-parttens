import type { ListLoadLabels } from './types'

export const defaultListLoadLabels: Pick<
  ListLoadLabels,
  'errorDescription' | 'retry'
> = {
  errorDescription: 'Verifique sua conexão e tente novamente.',
  retry: 'Tentar novamente',
}
