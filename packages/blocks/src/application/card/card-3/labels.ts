import { defaultCardLoadLabels } from '../shared/labels'
import type { Card3Labels } from './types'

export const defaultCard3Labels: Card3Labels = {
  ...defaultCardLoadLabels,
  errorTitle: 'Não foi possível carregar o perfil',
  loading: 'Carregando perfil',
  title: 'Perfil',
  follow: 'Seguir',
  message: 'Mensagem',
  stats: 'Números',
}
