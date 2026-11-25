import { GridFourIcon } from '@phosphor-icons/react'

export interface SavedView {
  id: string
  label: string
}

export const savedViews: SavedView[] = [
  { id: 'recent', label: 'Pessoas contatadas recentemente' },
  { id: 'all', label: 'Todas as pessoas' },
  { id: 'overdue', label: 'Aguardando retorno' },
]

export const ViewIcon = () => (
  <span className="inline-flex size-4 items-center justify-center rounded-sm bg-primary text-primary-foreground">
    <GridFourIcon aria-hidden="true" className="size-3" />
  </span>
)
