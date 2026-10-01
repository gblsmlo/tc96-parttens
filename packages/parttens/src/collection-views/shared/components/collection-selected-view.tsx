'use client'

import {
  Menu,
  MenuGroup,
  MenuItem,
  MenuPopup,
  MenuSub,
  MenuSubPopup,
  MenuSubTrigger,
} from '@tc96/ui/menu'
import { cn } from '@tc96/utils'
import { ChevronDownIcon, EllipsisIcon, PlusIcon } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { CollectionToolbarMenuTrigger } from './collection-toolbar-menu-trigger'

export interface SelectedViewMenuProps {
  children: ReactNode
  className?: string
  icon?: ReactNode
  label: string
}

/** Gatilho com a view ativa e popup alinhado ao início da toolbar. */
export function SelectedViewMenu({
  children,
  className,
  icon,
  label,
}: Readonly<SelectedViewMenuProps>): ReactElement {
  return (
    <Menu>
      <CollectionToolbarMenuTrigger className={className}>
        {icon ? <span className="shrink-0">{icon}</span> : null}
        <span className="min-w-0 truncate font-medium">{label}</span>
        <ChevronDownIcon aria-hidden="true" className="shrink-0" />
      </CollectionToolbarMenuTrigger>
      <MenuPopup align="start" className="w-64">
        {children}
      </MenuPopup>
    </Menu>
  )
}

export interface SelectedViewSearchProps {
  label?: string
  onValueChange: (value: string) => void
  placeholder?: string
  value: string
}

export function SelectedViewSearch({
  label = 'Buscar views',
  onValueChange,
  placeholder = 'Buscar views...',
  value,
}: Readonly<SelectedViewSearchProps>): ReactElement {
  return (
    <div className="px-1 pb-1" data-slot="selected-view-search">
      <input
        aria-label={label}
        className="h-8 w-full rounded-md bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        onChange={(event) => onValueChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== 'Escape') event.stopPropagation()
        }}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </div>
  )
}

export interface SelectedViewItemsProps {
  children: ReactNode
  label?: string
}

export function SelectedViewItems({
  children,
  label = 'Views',
}: Readonly<SelectedViewItemsProps>): ReactElement {
  return (
    <MenuGroup aria-label={label} data-slot="selected-view-items">
      {children}
    </MenuGroup>
  )
}

export interface SelectedViewItemProps {
  icon?: ReactNode
  label: string
  onSelect: () => void
  options?: ReactNode
  optionsLabel?: string
  selected?: boolean
}

export function SelectedViewItem({
  icon,
  label,
  onSelect,
  options,
  optionsLabel = `Opções de ${label}`,
  selected = false,
}: Readonly<SelectedViewItemProps>): ReactElement {
  return (
    <div
      className={cn(
        'flex min-w-0 items-center rounded-md',
        selected && 'bg-accent/60',
      )}
      data-selected={selected ? '' : undefined}
      data-slot="selected-view-item"
    >
      <MenuItem
        aria-current={selected ? 'true' : undefined}
        className={cn('min-w-0 flex-1', selected && 'text-primary')}
        onClick={onSelect}
      >
        {icon ? <span className="shrink-0">{icon}</span> : null}
        <span className="truncate">{label}</span>
      </MenuItem>
      {options ? (
        <MenuSub>
          <MenuSubTrigger
            aria-label={optionsLabel}
            className="me-1 h-7 min-h-7 w-7 justify-center px-1 [&>svg:last-child]:hidden"
          >
            <EllipsisIcon aria-hidden="true" className="size-4" />
          </MenuSubTrigger>
          <MenuSubPopup className="w-64">{options}</MenuSubPopup>
        </MenuSub>
      ) : null}
    </div>
  )
}

export interface SelectedViewCreateProps {
  label?: string
  onClick: () => void
}

export function SelectedViewCreate({
  label = 'Criar nova view',
  onClick,
}: Readonly<SelectedViewCreateProps>): ReactElement {
  return (
    <MenuItem data-slot="selected-view-create" onClick={onClick}>
      <PlusIcon aria-hidden="true" />
      {label}
    </MenuItem>
  )
}
