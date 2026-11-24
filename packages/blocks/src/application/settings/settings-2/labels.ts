import { defaultSettingsLoadLabels } from '../shared/labels'
import type { Settings2Labels } from './types'

export const defaultSettings2Labels: Settings2Labels = {
  ...defaultSettingsLoadLabels,
  errorTitle: 'Não foi possível carregar as preferências',
  loading: 'Carregando preferências',
  displayNames: 'Nomes de exibição',
  displayNamesDescription: 'Como os nomes das pessoas aparecem na interface',
  fontSize: 'Tamanho da fonte',
  fontSizeDescription: 'Ajusta o tamanho do texto em todo o app',
  generalTitle: 'Geral',
  interfaceTitle: 'Interface e tema',
  theme: 'Tema da interface',
  themeDescription: 'Escolha o esquema de cores da interface',
  underlineLinks: 'Sublinhar links',
  underlineLinksDescription: 'Sempre sublinha os títulos das listas',
}
