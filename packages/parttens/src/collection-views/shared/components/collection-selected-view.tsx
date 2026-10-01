'use client'

import { Button } from '@tc96/ui/button'
import { Menu, MenuPopup, MenuTrigger } from '@tc96/ui/menu'
import {
  Popover,
  PopoverClose,
  PopoverPopup,
  PopoverTrigger,
} from '@tc96/ui/popover'
import { ToolbarButton } from '@tc96/ui/toolbar'
import { cn } from '@tc96/utils'
import { ChevronDownIcon, EllipsisIcon, PlusIcon } from 'lucide-react'
import type { ReactElement, ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'

/*
 * O seletor é um popover, não um menu: ele reúne um campo de busca e, em cada
 * view, um botão de opções, e um `role="menu"` não pode conter nenhum dos dois.
 * Escolher uma view, criar outra ou usar uma opção fecha o popover.
 */
const SelectedViewCloseContext = createContext<() => void>(() => undefined)

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
  const [open, setOpen] = useState(false)

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <ToolbarButton
            render={
              <Button className={className} type="button" variant="ghost" />
            }
          />
        }
      >
        {icon ? <span className="shrink-0">{icon}</span> : null}
        <span className="min-w-0 truncate font-medium">{label}</span>
        <ChevronDownIcon aria-hidden="true" className="shrink-0" />
      </PopoverTrigger>
      <PopoverPopup align="start" aria-label={label} className="w-72">
        <SelectedViewCloseContext.Provider value={() => setOpen(false)}>
          <div className="flex flex-col gap-1">{children}</div>
        </SelectedViewCloseContext.Provider>
      </PopoverPopup>
    </Popover>
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
    <div className="pb-1" data-slot="selected-view-search">
      <input
        aria-label={label}
        className="h-8 w-full rounded-md bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        onChange={(event) => onValueChange(event.target.value)}
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
    <div
      aria-label={label}
      className="flex flex-col gap-0.5"
      data-slot="selected-view-items"
      role="group"
    >
      {children}
    </div>
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
  const close = useContext(SelectedViewCloseContext)

  return (
    <div
      className={cn(
        'flex min-w-0 items-center rounded-md',
        selected && 'bg-accent/60',
      )}
      data-selected={selected ? '' : undefined}
      data-slot="selected-view-item"
    >
      <PopoverClose
        aria-current={selected ? 'true' : undefined}
        onClick={onSelect}
        render={
          <Button
            className="min-w-0 flex-1 justify-start"
            size="sm"
            type="button"
            variant="ghost"
          />
        }
      >
        {icon ? <span className="shrink-0">{icon}</span> : null}
        <span className="truncate">{label}</span>
      </PopoverClose>
      {options ? (
        <Menu
          onOpenChange={(menuOpen, details) => {
            if (!menuOpen && details.reason === 'item-press') close()
          }}
        >
          <MenuTrigger
            aria-label={optionsLabel}
            render={<Button size="icon-sm" type="button" variant="ghost" />}
          >
            <EllipsisIcon aria-hidden="true" className="size-4" />
          </MenuTrigger>
          <MenuPopup align="start" className="w-64" side="right">
            {options}
          </MenuPopup>
        </Menu>
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
    <PopoverClose
      data-slot="selected-view-create"
      onClick={onClick}
      render={
        <Button
          className="w-full justify-start"
          size="sm"
          type="button"
          variant="ghost"
        />
      }
    >
      <PlusIcon aria-hidden="true" />
      {label}
    </PopoverClose>
  )
}
