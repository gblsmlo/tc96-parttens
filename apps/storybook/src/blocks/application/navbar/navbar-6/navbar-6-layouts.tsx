import { Navbar6 } from '@tc96/ui/blocks/application/navbar/navbar-6'
import { MenuItem, MenuSeparator } from '@tc96/ui/menu'
import { useState } from 'react'
import { fn } from 'storybook/test'
import {
  breadcrumb,
  filterOptions,
  people,
  sortOptions,
} from '../fixtures/navbar-6.ts'
import type { Navbar6Controls } from './navbar-6-controls.ts'

export const navbar6Handlers = {
  onFiltersChange: fn(),
  onInvite: fn(),
  onSortChange: fn(),
}

export const boardMenu = (
  <>
    <MenuItem>Duplicar quadro</MenuItem>
    <MenuItem>Arquivar quadro</MenuItem>
    <MenuSeparator />
    <MenuItem variant="destructive">Excluir quadro</MenuItem>
  </>
)

export const ComposedNavbar6 = ({
  activeFilters,
  maxPeople,
  peopleCount,
  showFilter,
  showInvite,
  showMenu,
  showSort,
}: Readonly<Navbar6Controls>) => {
  const [sort, setSort] = useState('recent')
  const [filters, setFilters] = useState<string[] | null>(null)
  const selected =
    filters ?? filterOptions.slice(0, activeFilters).map((option) => option.id)

  return (
    <Navbar6
      breadcrumb={breadcrumb}
      filterOptions={showFilter ? filterOptions : undefined}
      filters={selected}
      maxPeople={maxPeople}
      menu={showMenu ? boardMenu : undefined}
      onFiltersChange={
        showFilter
          ? (next) => {
              navbar6Handlers.onFiltersChange(next)
              setFilters(next)
            }
          : undefined
      }
      onInvite={showInvite ? navbar6Handlers.onInvite : undefined}
      onSortChange={
        showSort
          ? (next) => {
              navbar6Handlers.onSortChange(next)
              setSort(next)
            }
          : undefined
      }
      people={people.slice(0, peopleCount)}
      sort={sort}
      sortOptions={showSort ? sortOptions : undefined}
    />
  )
}
