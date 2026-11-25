import type { SettingsIntegration6App } from '@tc96/ui/blocks/application/settings/integration/settings-integration-6'

export const settingsIntegration6Apps: SettingsIntegration6App[] = [
  {
    connected: true,
    description: 'Sincroniza e-mails e reuniões com os leads.',
    enabled: true,
    id: 'google-workspace',
    name: 'Google Workspace',
  },
  {
    connected: true,
    description: 'Envia avisos de leads e tarefas para um canal.',
    enabled: false,
    id: 'slack',
    name: 'Slack',
  },
  {
    connected: false,
    description: 'Cria cobranças e concilia pagamentos recebidos.',
    enabled: false,
    id: 'stripe',
    name: 'Stripe',
  },
  {
    connected: false,
    description: 'Registra reuniões e anotações no histórico do cliente.',
    enabled: false,
    id: 'notion',
    name: 'Notion',
  },
  {
    connected: true,
    description: 'Dispara e-mails transacionais a partir dos eventos.',
    enabled: true,
    id: 'resend',
    name: 'Resend',
  },
  {
    connected: false,
    description: 'Abre tarefas de acompanhamento a partir das negociações.',
    enabled: false,
    id: 'linear',
    name: 'Linear',
  },
]
