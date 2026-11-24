import { defaultCardLoadLabels } from '../shared/labels'
import type { Card4Labels } from './types'

export const defaultCard4Labels: Card4Labels = {
  ...defaultCardLoadLabels,
  errorTitle: 'Não foi possível carregar as reuniões',
  loading: 'Carregando reuniões',
  attendees: (title) => `Participantes de ${title}`,
  emptyDescription: 'Quando houver reuniões marcadas, elas aparecem aqui.',
  emptyTitle: 'Nenhuma reunião hoje',
  join: 'Entrar',
  joinMeeting: (title) => `Entrar na reunião ${title}`,
  title: 'Agenda de reuniões',
}
