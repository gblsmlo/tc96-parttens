import type { Timeline1Event } from '@tc96/blocks/application/timeline/timeline-1'

export const events: Timeline1Event[] = [
  {
    action: 'aprovou a proposta comercial',
    actor: 'Marina Costa',
    attachments: [
      { id: 'proposal', label: 'proposta-atlas.pdf' },
      { id: 'contract', label: 'contrato.docx' },
    ],
    id: 'approved',
    status: { label: 'Aprovada', tone: 'success' },
    time: 'Hoje, 14:32',
  },
  {
    action: 'comentou na negociação',
    actor: 'Rafael Lima',
    id: 'comment',
    time: 'Hoje, 11:05',
  },
  {
    action: 'alterou o prazo de entrega',
    actor: 'Júlia Andrade',
    id: 'deadline',
    status: { label: 'Em revisão', tone: 'warning' },
    time: 'Ontem, 17:48',
  },
  {
    action: 'criou a oportunidade',
    actor: 'Bruno Tavares',
    id: 'created',
    time: '18 de nov., 09:10',
  },
]
