import type { SettingsIntegration2App } from '@tc96/ui/blocks/application/settings/integration/settings-integration-2'

export const settingsIntegration2Apps: SettingsIntegration2App[] = [
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
