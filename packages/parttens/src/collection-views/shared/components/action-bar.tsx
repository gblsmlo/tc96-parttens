'use client'

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
import { GripVerticalIcon, XIcon } from 'lucide-react'
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

function buttonVariant(
  variant: ActionBarItem['variant'] = 'default',
): ButtonProps['variant'] {
  if (variant === 'primary') return 'primary'
  if (variant === 'destructive') return 'destructive-ghost'
  return 'ghost'
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
              variant={buttonVariant(action.variant)}
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
      variant={buttonVariant(action.variant)}
    >
      {content}
    </Button>
  )
}

export function ActionBar<TData = unknown>({
  actions,
  className,
  onClearSelection,
  selectedCount,
  selectedRows = [],
}: Readonly<ActionBarProps<TData>>): ReactNode {
  if (selectedCount < 1) return null

  const context: ActionBarContext<TData> = {
    selectedCount,
    selectedRows,
  }

  return (
    <div
      aria-label="Ações dos itens selecionados"
      className={cn(
        'flex min-h-11 w-fit max-w-full items-center gap-1 overflow-x-auto rounded-xl border bg-popover px-2 py-1 text-popover-foreground shadow-lg',
        className,
      )}
      data-slot="action-bar"
      role="toolbar"
    >
      <GripVerticalIcon
        aria-hidden="true"
        className="size-4 shrink-0 text-muted-foreground"
      />
      <span className="px-1 font-medium text-sm">
        {selectionLabel(selectedCount)}
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
          aria-label="Limpar seleção"
          onClick={onClearSelection}
          size="sm"
          title="Limpar seleção"
          variant="ghost"
        >
          <XIcon />
        </Button>
      ) : null}
    </div>
  )
}
