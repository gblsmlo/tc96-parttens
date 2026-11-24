import { defaultSettingsLoadLabels } from '../shared/labels'
import type { Settings17Labels } from './types'

export const defaultSettings17Labels: Settings17Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar a privacidade',
  loading: 'Carregando privacidade',
  beta: 'Beta',
  description: 'Decida o que é coletado e compartilhado sobre sua conta.',
  pro: 'Pro',
  title: 'Privacidade',
}
