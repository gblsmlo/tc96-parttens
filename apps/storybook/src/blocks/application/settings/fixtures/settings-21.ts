import type { Settings21App } from '@tc96/blocks/application/settings/settings-21'

export const settings21Apps: Settings21App[] = [
  {
    description: 'Sincroniza e-mails e reuniões com os leads.',
    id: 'google-workspace',
    name: 'Google Workspace',
    status: 'connected',
  },
  {
    description: 'Envia avisos de leads e tarefas para um canal.',
    id: 'slack',
    name: 'Slack',
    status: 'disconnected',
  },
  {
    description: 'Cria cobranças e concilia pagamentos recebidos.',
    id: 'stripe',
    name: 'Stripe',
    status: 'error',
  },
]
