import { defaultSettingsLoadLabels } from '../../shared/labels'
import type { SettingsNotificationChannel1Labels } from './types'

export const defaultSettingsNotificationChannel1Labels: SettingsNotificationChannel1Labels =
  {
    ...defaultSettingsLoadLabels,
    errorTitle: 'Não foi possível carregar as notificações',
    loading: 'Carregando notificações',
    categories: 'Categorias de notificação',
    cell: (event, channel) => `${event} por ${channel}`,
    description: 'Escolha por onde receber o aviso de cada evento.',
    emptyDescription:
      'Os eventos de notificação aparecem aqui quando existirem.',
    emptyTitle: 'Nenhum evento de notificação',
    event: 'Evento',
    title: 'Canais de notificação',
  }
