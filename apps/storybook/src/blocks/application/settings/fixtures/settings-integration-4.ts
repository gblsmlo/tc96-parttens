import type { SettingsIntegration4Section } from '@tc96/ui/blocks/application/settings/integration/settings-integration-4'

export const settingsIntegration4Sections: SettingsIntegration4Section[] = [
  {
    apps: [
      {
        description: 'Avisos de leads e tarefas em canais.',
        id: 'slack',
        name: 'Slack',
        status: 'connected',
      },
      {
        description: 'Mensagens de clientes pelo WhatsApp Business.',
        id: 'whatsapp',
        name: 'WhatsApp Business',
        status: 'review',
      },
    ],
    id: 'communication',
    title: 'Comunicação',
  },
  {
    apps: [
      {
        description: 'Documentos e anexos dos negócios.',
        id: 'google-drive',
        name: 'Google Drive',
        status: 'connected',
      },
      {
        description: 'Tarefas sincronizadas com o pipeline.',
        id: 'notion',
        name: 'Notion',
        status: 'connected',
      },
    ],
    id: 'collaboration',
    title: 'Colaboração',
  },
  {
    apps: [
      {
        description: 'Reuniões agendadas direto na agenda do time.',
        id: 'google-calendar',
        name: 'Google Calendar',
        status: 'review',
      },
    ],
    id: 'scheduling',
    title: 'Agendamento',
  },
]
