import type { SettingsIntegration2App } from '@tc96/ui/blocks/application/settings/integration/settings-integration-2'
import googleLogo from '@thesvg/icons/google'
import slackLogo from '@thesvg/icons/slack'
import stripeLogo from '@thesvg/icons/stripe'

export const settingsIntegration2Apps: SettingsIntegration2App[] = [
  {
    description: 'Sincroniza e-mails e reuniões com os leads.',
    id: 'google-workspace',
    name: 'Google Workspace',
    logo: googleLogo,
    status: 'connected',
  },
  {
    description: 'Envia avisos de leads e tarefas para um canal.',
    id: 'slack',
    name: 'Slack',
    logo: slackLogo,
    status: 'disconnected',
  },
  {
    description: 'Cria cobranças e concilia pagamentos recebidos.',
    id: 'stripe',
    name: 'Stripe',
    logo: stripeLogo,
    status: 'error',
  },
]
