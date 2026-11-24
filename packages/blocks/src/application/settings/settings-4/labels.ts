import { defaultSettingsLoadLabels } from '../shared/labels'
import type { Settings4Labels } from './types'

export const defaultSettings4Labels: Settings4Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar a aparência',
  loading: 'Carregando aparência',
  mode: 'Modo',
  modeDescription: 'Claro, escuro ou a configuração do seu sistema',
  theme: 'Tema',
  themeDescription: 'Cores, raio e fontes da interface',
  title: 'Aparência',
}
