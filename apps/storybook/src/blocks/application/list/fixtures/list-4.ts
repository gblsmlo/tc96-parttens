import type { List4Integration } from '@tc96/blocks/application/list/list-4'

export const integrations: List4Integration[] = [
  {
    description: 'Receba alertas de novos negócios no canal da equipe.',
    id: 'slack',
    name: 'Slack',
  },
  {
    description: 'Sincronize reuniões e prazos com a sua agenda.',
    id: 'calendar',
    name: 'Google Agenda',
  },
  {
    connected: true,
    description: 'Emita cobranças e concilie pagamentos automaticamente.',
    id: 'billing',
    name: 'Stripe',
  },
  {
    description: 'Envie dados de uso para o seu data warehouse.',
    id: 'warehouse',
    name: 'BigQuery',
  },
]
