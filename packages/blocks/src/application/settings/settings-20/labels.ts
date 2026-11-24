import type { Settings20Labels } from './types'

export const defaultSettings20Labels: Settings20Labels = {
  categories: 'Categorias de notificação',
  cell: (event, channel) => `${event} por ${channel}`,
  description: 'Escolha por onde receber o aviso de cada evento.',
  emptyDescription: 'Os eventos de notificação aparecem aqui quando existirem.',
  emptyTitle: 'Nenhum evento de notificação',
  event: 'Evento',
  title: 'Canais de notificação',
}
