import { GridFourIcon } from '@phosphor-icons/react'

export interface SavedView {
  count?: number
  countLabel?: string
  id: string
  label: string
}

export const savedViews: SavedView[] = [
  {
    count: 12,
    countLabel: 'Pessoas contatadas recentemente, 12 pessoas',
    id: 'recent',
    label: 'Pessoas contatadas recentemente',
  },
  {
    count: 248,
    countLabel: 'Todas as pessoas, 248 pessoas',
    id: 'all',
    label: 'Todas as pessoas',
  },
  {
    count: 0,
    countLabel: 'Aguardando retorno, nenhuma pessoa',
    id: 'overdue',
    label: 'Aguardando retorno',
  },
]

export const ViewIcon = () => (
  <span className="inline-flex size-4 items-center justify-center rounded-sm bg-primary text-primary-foreground">
    <GridFourIcon aria-hidden="true" className="size-3" />
  </span>
)
