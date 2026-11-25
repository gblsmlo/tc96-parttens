import type { SettingsIntegration7App } from '@tc96/ui/blocks/application/settings/integration/settings-integration-7'

export const settingsIntegration7Apps: SettingsIntegration7App[] = [
  {
    actionLabel: 'Configurar',
    description: 'Sincroniza e-mails e reuniões com os leads.',
    id: 'google-workspace',
    name: 'Google Workspace',
    status: 'connected',
  },
  {
    actionLabel: 'Configurar',
    description: 'Envia avisos de leads e tarefas para um canal.',
    id: 'slack',
    name: 'Slack',
    status: 'connected',
  },
  {
    actionLabel: 'Instalar',
    description: 'Dispara e-mails transacionais a partir das automações.',
    id: 'resend',
    name: 'Resend',
    status: 'available',
  },
  {
    actionLabel: 'Instalar',
    description: 'Cria cobranças e concilia pagamentos recebidos.',
    id: 'stripe',
    name: 'Stripe',
    status: 'available',
  },
  {
    actionLabel: 'Testar',
    description: 'Resume conversas e sugere próximos passos com IA.',
    id: 'cursor',
    name: 'Cursor',
    status: 'preview',
  },
]
