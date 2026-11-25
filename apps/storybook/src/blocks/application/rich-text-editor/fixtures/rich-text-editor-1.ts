import type { RichTextValue } from '@tc96/ui/patterns/rich-text-editor'

export const launchBriefTitle = 'Briefing de lançamento: app de agendamento'

export const launchBriefDescription =
  'Plano de comunicação para o lançamento de março.'

export const launchBriefStatus = 'Em revisão'

export const launchBrief: RichTextValue = [
  {
    children: [{ text: 'Objetivo' }],
    type: 'h2',
  },
  {
    children: [
      {
        text: 'Apresentar o novo app de agendamento a clínicas pequenas e gerar 300 cadastros nas duas primeiras semanas.',
      },
    ],
    type: 'p',
  },
  {
    children: [{ text: 'Mensagens principais' }],
    type: 'h2',
  },
  {
    children: [
      {
        children: [
          {
            children: [{ text: 'Menos faltas com lembretes automáticos.' }],
            type: 'lic',
          },
        ],
        type: 'li',
      },
      {
        children: [
          {
            children: [{ text: 'Agenda compartilhada por toda a equipe.' }],
            type: 'lic',
          },
        ],
        type: 'li',
      },
    ],
    type: 'ul',
  },
  {
    children: [{ text: 'Próximos passos' }],
    type: 'h2',
  },
  {
    checked: true,
    children: [{ text: 'Fechar o texto da página de lançamento' }],
    type: 'action_item',
  },
  {
    checked: false,
    children: [{ text: 'Agendar os e-mails de convite' }],
    type: 'action_item',
  },
  {
    children: [{ text: 'Revise o documento antes da reunião de quinta.' }],
    type: 'p',
  },
]
