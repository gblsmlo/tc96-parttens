import { defaultListLoadLabels } from '../shared/labels'
import type { List5Labels } from './types'

export const defaultList5Labels: List5Labels = {
  ...defaultListLoadLabels,
  errorTitle: 'Não foi possível carregar os módulos',
  loading: 'Carregando módulos',
  add: (name) => `Adicionar ${name}`,
  browseMore: 'Ver mais',
  title: 'Módulos disponíveis',
}
