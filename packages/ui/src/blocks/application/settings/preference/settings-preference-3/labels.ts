import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsPreference3Labels } from './types'

export const defaultSettingsPreference3Labels: SettingsPreference3Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar a aparência',
  loading: 'Carregando aparência',
  mode: 'Modo',
  modeDescription: 'Claro, escuro ou a configuração do seu sistema',
  theme: 'Tema',
  themeDescription: 'Cores, raio e fontes da interface',
  title: 'Aparência',
}
