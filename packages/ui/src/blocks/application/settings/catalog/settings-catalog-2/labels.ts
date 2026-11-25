import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsCatalog2Labels } from './types'

export const defaultSettingsCatalog2Labels: SettingsCatalog2Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar os SLAs',
  loading: 'Carregando SLAs',
  description:
    'Aplique prazos às issues que correspondem às regras de automação',
  enable: 'Ativar SLAs',
  title: 'SLAs',
}
