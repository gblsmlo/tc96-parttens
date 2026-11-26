'use client'

import { DotsSixVerticalIcon, XIcon } from '@phosphor-icons/react'
import { Button, type ButtonProps } from '@tc96/ui/button'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@tc96/ui/menu'
import { cn } from '@tc96/utils'
import { Fragment, type ReactNode } from 'react'

export interface ActionBarContext<TData = unknown> {
  selectedCount: number
  selectedRows: readonly TData[]
}

export interface ActionBarItem<TData = unknown> {
  disabled?: boolean
  icon?: ReactNode
  id?: string
  label: string
  onSelect?: (context: ActionBarContext<TData>) => void
  shortcut?: string
  submenu?: ActionBarGroup<TData>[]
  variant?: 'default' | 'primary' | 'destructive'
}

export interface ActionBarGroup<TData = unknown> {
  id?: string
  items: ActionBarItem<TData>[]
  label?: string
}

export interface ActionBarProps<TData = unknown> {
  actions: ActionBarGroup<TData>[]
  className?: string
  clearSelectionLabel?: string
  formatSelection?: (count: number) => string
  label?: string
  notice?: string
  onClearSelection?: () => void
  selectedCount: number
  selectedRows?: readonly TData[]
}

function selectionLabel(count: number) {
  return `${count} selecionado${count === 1 ? '' : 's'}`
}

function actionKey<TData>(action: ActionBarItem<TData>) {
  return action.id ?? action.label
}

function groupKey<TData>(group: ActionBarGroup<TData>) {
  return (
    group.id ??
    group.label ??
    group.items.map((action) => actionKey(action)).join('|')
  )
}

function buttonAppearance(
  variant: ActionBarItem['variant'] = 'default',
): Pick<ButtonProps, 'className' | 'variant'> {
  if (variant === 'primary') return { variant: 'default' }
  if (variant === 'destructive')
    return { className: 'text-destructive-foreground', variant: 'ghost' }
  return { variant: 'ghost' }
}

function ActionItem<TData>({
  action,
  context,
}: Readonly<{
  action: ActionBarItem<TData>
  context: ActionBarContext<TData>
}>): ReactNode {
  const content = (
    <>
      {action.icon}
      <span>{action.label}</span>
      {action.shortcut ? (
        <kbd className="ms-auto text-xs">{action.shortcut}</kbd>
      ) : null}
    </>
  )

  if (action.submenu) {
    return (
      <Menu modal={false}>
        <MenuTrigger
          aria-label={action.label}
          disabled={action.disabled}
          render={
            <Button
              aria-label={action.label}
              disabled={action.disabled}
              size="sm"
              {...buttonAppearance(action.variant)}
            />
          }
        >
          {content}
        </MenuTrigger>
        <MenuPopup align="center" side="top" sideOffset={8}>
          {action.submenu.map((group, groupIndex) => (
            <Fragment key={groupKey(group)}>
              {groupIndex > 0 ? <MenuSeparator /> : null}
              <MenuGroup>
                {group.label ? (
                  <MenuGroupLabel>{group.label}</MenuGroupLabel>
                ) : null}
                {group.items.map((item) => (
                  <MenuItem
                    disabled={item.disabled}
                    key={actionKey(item)}
                    onClick={() => item.onSelect?.(context)}
                    variant={
                      item.variant === 'destructive' ? 'destructive' : 'default'
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.shortcut ? (
                      <kbd className="ms-auto text-xs">{item.shortcut}</kbd>
                    ) : null}
                  </MenuItem>
                ))}
              </MenuGroup>
            </Fragment>
          ))}
        </MenuPopup>
      </Menu>
    )
  }

  return (
    <Button
      aria-label={action.label}
      disabled={action.disabled}
      onClick={() => action.onSelect?.(context)}
      size="sm"
      title={action.label}
      {...buttonAppearance(action.variant)}
    >
      {content}
    </Button>
  )
}

export function ActionBar<TData = unknown>({
  actions,
  className,
  clearSelectionLabel = 'Limpar seleção',
  formatSelection = selectionLabel,
  label = 'Ações dos itens selecionados',
  notice,
  onClearSelection,
  selectedCount,
  selectedRows = [],
}: Readonly<ActionBarProps<TData>>): ReactNode {
  if (selectedCount < 1) return null

  const context: ActionBarContext<TData> = {
    selectedCount,
    selectedRows,
  }

  const bar = (
    <div
      aria-label={label}
      className={cn(
        'flex min-h-11 w-fit max-w-full items-center gap-1 overflow-x-auto rounded-xl border bg-popover px-2 py-1 text-popover-foreground shadow-(shadow:--popover-shadow)',
        className,
      )}
      data-slot="action-bar"
      role="toolbar"
    >
      <DotsSixVerticalIcon
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />
      <span className="px-1 font-medium text-sm">
        {formatSelection(selectedCount)}
      </span>
      {actions.map((group, groupIndex) => (
        <div className="flex items-center gap-0.5" key={groupKey(group)}>
          {groupIndex > 0 ? (
            <hr
              aria-orientation="vertical"
              className="mx-1 h-5 w-px border-0 bg-border"
            />
          ) : null}
          {group.items.map((action) => (
            <ActionItem
              action={action}
              context={context}
              key={actionKey(action)}
            />
          ))}
        </div>
      ))}
      {onClearSelection ? (
        <Button
          aria-label={clearSelectionLabel}
          onClick={onClearSelection}
          size="sm"
          title={clearSelectionLabel}
          variant="ghost"
        >
          <XIcon aria-hidden="true" />
        </Button>
      ) : null}
    </div>
  )

  if (!notice) return bar

  return (
    <div className="flex w-fit max-w-full flex-col items-center gap-2">
      <output
        className="block max-w-full rounded-md border bg-popover px-3 py-1.5 text-center text-muted-foreground text-sm shadow-(shadow:--popover-shadow)"
        data-slot="action-bar-notice"
      >
        {notice}
      </output>
      {bar}
    </div>
  )
}
