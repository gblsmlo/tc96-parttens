import type { SettingsLoadLabels } from './types'

export const defaultSettingsLoadLabels: Pick<
  SettingsLoadLabels,
  'errorDescription' | 'retry'
> = {
  errorDescription: 'Verifique sua conexão e tente novamente.',
  retry: 'Tentar novamente',
}
