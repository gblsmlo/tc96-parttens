import { defaultCardLoadLabels } from '../shared/labels'
import type { Card8Labels } from './types'

export const defaultCard8Labels: Card8Labels = {
  ...defaultCardLoadLabels,
  emptyDescription: 'As próximas reuniões aparecem aqui.',
  emptyTitle: 'Nenhuma reunião agendada',
  errorTitle: 'Não foi possível carregar as reuniões',
  heading: 'Reunião',
  join: 'Entrar na reunião',
  joinTo: (title) => `Entrar na reunião ${title}`,
  loading: 'Carregando reuniões',
  more: (title) => `Mais ações de ${title}`,
  people: 'Participantes',
  title: 'Próximas reuniões',
}
