import type { Settings7Tag } from '@tc96/blocks/application/settings/settings-7'

export const tags: Settings7Tag[] = [
  {
    colorClassName: 'bg-violet-700 dark:bg-violet-500',
    id: 'tag-cliente-ativo',
    leads: 42,
    name: 'Cliente ativo',
    subtags: [
      {
        colorClassName: 'bg-sky-700 dark:bg-sky-500',
        id: 'tag-renovacao',
        leads: 8,
        name: 'Renovação em 30 dias',
        tasks: 3,
      },
    ],
    tasks: 17,
  },
  {
    colorClassName: 'bg-emerald-700 dark:bg-emerald-500',
    id: 'tag-indicacao',
    leads: 1,
    name: 'Indicação',
    tasks: 0,
  },
  {
    colorClassName: 'bg-amber-700 dark:bg-amber-500',
    id: 'tag-prioridade-alta',
    leads: 12,
    name: 'Prioridade alta',
    tasks: 5,
  },
]
