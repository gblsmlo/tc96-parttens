import type { Card2Integration } from '@tc96/blocks/application/card/card-2'

export const integrations: Card2Integration[] = [
  {
    description: 'Receba alertas de novos negócios no canal da equipe.',
    id: 'slack',
    name: 'Slack',
    tier: { label: 'Grátis', tone: 'success' },
  },
  {
    description: 'Sincronize reuniões e prazos com a sua agenda.',
    id: 'calendar',
    name: 'Google Agenda',
    tier: { label: 'Grátis', tone: 'success' },
  },
  {
    connected: true,
    description: 'Emita cobranças e concilie pagamentos automaticamente.',
    id: 'billing',
    name: 'Stripe',
    tier: { label: 'Pro', tone: 'info' },
  },
  {
    description: 'Envie dados de uso para o seu data warehouse.',
    id: 'warehouse',
    name: 'BigQuery',
    tier: { label: 'Enterprise', tone: 'warning' },
  },
]
