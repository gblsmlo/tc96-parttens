import { defaultSettingsLoadLabels } from '../shared/labels'
import type { Settings8Labels } from './types'

export const defaultSettings8Labels: Settings8Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar os SLAs',
  loading: 'Carregando SLAs',
  description:
    'Aplique prazos às issues que correspondem às regras de automação',
  enable: 'Ativar SLAs',
  title: 'SLAs',
}
