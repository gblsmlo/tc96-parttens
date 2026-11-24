import type { Timeline2Release } from '@tc96/blocks/application/timeline/timeline-2'

export const releases: Timeline2Release[] = [
  {
    date: '2026-11-20',
    entries: [
      {
        id: 'new',
        items: [
          'Painel de metas por equipe',
          'Exportação de relatórios em CSV',
        ],
        type: 'new',
      },
      {
        id: 'improvement',
        items: ['Busca global mais rápida em contas grandes'],
        type: 'improvement',
      },
    ],
    id: 'v2-4-0',
    version: 'Versão 2.4.0',
  },
  {
    date: '2026-11-12',
    entries: [
      {
        id: 'fix',
        items: [
          'Notificações duplicadas após reconectar',
          'Filtro de datas ignorava o fuso horário',
        ],
        type: 'fix',
      },
    ],
    id: 'v2-3-1',
    version: 'Versão 2.3.1',
  },
  {
    date: '2026-11-03',
    entries: [
      {
        id: 'new',
        items: ['Convites por link para novos membros'],
        type: 'new',
      },
      {
        id: 'improvement',
        items: ['Atalhos de teclado na lista de tarefas'],
        type: 'improvement',
      },
    ],
    id: 'v2-3-0',
    version: 'Versão 2.3.0',
  },
]
