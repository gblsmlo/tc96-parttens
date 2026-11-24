import type { CardLoadLabels } from './types'

export const defaultCardLoadLabels: Pick<
  CardLoadLabels,
  'errorDescription' | 'retry'
> = {
  errorDescription: 'Verifique sua conexão e tente novamente.',
  retry: 'Tentar novamente',
}
