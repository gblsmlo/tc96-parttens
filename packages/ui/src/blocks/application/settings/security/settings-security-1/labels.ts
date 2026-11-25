import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsSecurity1Labels } from './types'

export const defaultSettingsSecurity1Labels: SettingsSecurity1Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar a privacidade',
  loading: 'Carregando privacidade',
  beta: 'Beta',
  description: 'Decida o que é coletado e compartilhado sobre sua conta.',
  pro: 'Pro',
  title: 'Privacidade',
}
