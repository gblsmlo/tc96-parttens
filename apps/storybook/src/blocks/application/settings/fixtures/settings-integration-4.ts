import type { SettingsIntegration4Section } from '@tc96/ui/blocks/application/settings/integration/settings-integration-4'
import googleCalendarLogo from '@thesvg/icons/google-calendar'
import googleDriveLogo from '@thesvg/icons/google-drive'
import notionLogo from '@thesvg/icons/notion'
import slackLogo from '@thesvg/icons/slack'
import whatsappLogo from '@thesvg/icons/whatsapp'

export const settingsIntegration4Sections: SettingsIntegration4Section[] = [
  {
    apps: [
      {
        description: 'Avisos de leads e tarefas em canais.',
        id: 'slack',
        name: 'Slack',
        logo: slackLogo,
        status: 'connected',
      },
      {
        description: 'Mensagens de clientes pelo WhatsApp Business.',
        id: 'whatsapp',
        name: 'WhatsApp Business',
        logo: whatsappLogo,
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
        logo: googleDriveLogo,
        status: 'connected',
      },
      {
        description: 'Tarefas sincronizadas com o pipeline.',
        id: 'notion',
        name: 'Notion',
        logo: notionLogo,
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
        logo: googleCalendarLogo,
        status: 'review',
      },
    ],
    id: 'scheduling',
    title: 'Agendamento',
  },
]
