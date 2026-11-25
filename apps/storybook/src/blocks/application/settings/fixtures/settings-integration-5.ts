import type { SettingsIntegration5App } from '@tc96/ui/blocks/application/settings/integration/settings-integration-5'

export const settingsIntegration5Apps: SettingsIntegration5App[] = [
  {
    channels: [
      {
        description: 'Avisa quando um workflow termina.',
        enabled: true,
        id: 'workflow-runs',
        label: 'Execuções de workflow',
      },
      {
        description: 'Avisa quando uma cobrança é recusada.',
        enabled: false,
        id: 'failed-payments',
        label: 'Pagamentos com falha',
      },
    ],
    connected: true,
    description: 'Envia avisos dos eventos escolhidos para um canal.',
    id: 'slack',
    name: 'Slack',
  },
  {
    connected: true,
    description: 'Cria cobranças e concilia pagamentos recebidos.',
    id: 'stripe',
    name: 'Stripe',
  },
  {
    channels: [
      {
        enabled: false,
        id: 'new-leads',
        label: 'Novos leads',
      },
    ],
    connected: false,
    description: 'Cria tarefas a partir de eventos do espaço de trabalho.',
    id: 'linear',
    name: 'Linear',
  },
]
