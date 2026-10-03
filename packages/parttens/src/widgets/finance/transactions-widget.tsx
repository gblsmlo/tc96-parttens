'use client'

import { type AmountFormatOptions, formatAmount } from '@tc96/helpers/format'
import { Button } from '@tc96/ui/button'
import { CardPanel } from '@tc96/ui/card'
import { ScrollAreaPrimitive, ScrollBar } from '@tc96/ui/scroll-area'
import { cn } from '@tc96/utils'
import type { ComponentProps, ReactElement, ReactNode } from 'react'
import { useId, useState } from 'react'
import { CardWidgetShell } from '../shared/card-widget-shell'
import { WidgetHeader } from '../shared/widget-header'

export type TransactionKind = 'credit' | 'debit'

export interface Transaction {
  amount: number
  icon?: ReactNode
  id: string
  kind?: TransactionKind
  meta?: ReactNode
  name: ReactNode
  status?: ReactNode
}

export interface TransactionListProps extends ComponentProps<'ul'> {}

export function TransactionList({
  className,
  ...props
}: Readonly<TransactionListProps>): ReactElement {
  return (
    <ul
      className={cn('divide-y divide-border/40', className)}
      data-slot="transaction-list"
      {...props}
    />
  )
}

export interface TransactionListItemProps
  extends Omit<ComponentProps<'li'>, 'title'> {
  amount: number
  format?: AmountFormatOptions
  icon?: ReactNode
  kind?: TransactionKind
  meta?: ReactNode
  name: ReactNode
  status?: ReactNode
}

export function transactionKind(amount: number): TransactionKind {
  return amount >= 0 ? 'credit' : 'debit'
}

export function TransactionListItem({
  amount,
  className,
  format,
  icon,
  kind = transactionKind(amount),
  meta,
  name,
  status,
  ...props
}: Readonly<TransactionListItemProps>): ReactElement {
  const credit = kind === 'credit'

  return (
    <li
      className={cn(
        'flex min-w-0 items-center gap-3 py-3 first:pt-0 last:pb-0',
        className,
      )}
      data-kind={kind}
      data-slot="transaction-list-item"
      {...props}
    >
      {icon}
      <div className="grid min-w-0 flex-1 gap-0.5">
        <span className="truncate font-medium text-sm">{name}</span>
        {meta ? (
          <span className="truncate text-muted-foreground text-xs">{meta}</span>
        ) : null}
      </div>
      <div className="grid shrink-0 justify-items-end gap-1">
        <span
          className={cn(
            'font-semibold text-sm tabular-nums',
            credit && 'text-success-foreground',
          )}
          data-slot="transaction-amount"
        >
          {formatAmount(credit ? Math.abs(amount) : amount, {
            ...(credit ? { signDisplay: 'always' } : {}),
            ...format,
          })}
        </span>
        {status}
      </div>
    </li>
  )
}

export interface TransactionsWidgetProps
  extends Omit<ComponentProps<'div'>, 'children' | 'title'> {
  action?: ReactNode
  collapseLabel?: ReactNode
  defaultExpanded?: boolean
  emptyLabel?: ReactNode
  expandLabel?: (hidden: number) => ReactNode
  expanded?: boolean
  format?: AmountFormatOptions
  listLabel?: string
  maxHeight?: number
  onExpandedChange?: (expanded: boolean) => void
  title: ReactNode
  transactions: readonly Transaction[]
  visibleCount?: number
}

function defaultExpandLabel(hidden: number): ReactNode {
  return `Ver todas (+${hidden})`
}

export function TransactionsWidget({
  action,
  className,
  collapseLabel = 'Ver menos',
  defaultExpanded = false,
  emptyLabel = 'Sem transações',
  expandLabel = defaultExpandLabel,
  expanded: controlledExpanded,
  format,
  listLabel,
  maxHeight = 420,
  onExpandedChange,
  title,
  transactions,
  visibleCount = 5,
  ...props
}: Readonly<TransactionsWidgetProps>): ReactElement {
  const titleId = useId()
  const [uncontrolledExpanded, setUncontrolledExpanded] =
    useState(defaultExpanded)
  const expanded = controlledExpanded ?? uncontrolledExpanded
  const hidden = Math.max(0, transactions.length - visibleCount)
  const collapsed = hidden > 0 && !expanded
  const shown = collapsed ? transactions.slice(0, visibleCount) : transactions

  function setExpanded(next: boolean) {
    if (controlledExpanded === undefined) setUncontrolledExpanded(next)
    onExpandedChange?.(next)
  }

  const list = (
    <TransactionList
      aria-label={listLabel ?? (typeof title === 'string' ? title : undefined)}
    >
      {shown.map(({ id, ...transaction }) => (
        <TransactionListItem
          key={id}
          {...transaction}
          {...(format ? { format } : {})}
        />
      ))}
    </TransactionList>
  )

  return (
    <CardWidgetShell
      aria-labelledby={titleId}
      className={className}
      data-expanded={hidden > 0 ? String(expanded) : undefined}
      data-widget="transactions"
      {...props}
    >
      <WidgetHeader action={action} title={title} titleId={titleId} />
      <CardPanel className="px-5 pb-5">
        {transactions.length === 0 ? (
          <p
            className="py-6 text-center text-muted-foreground text-sm"
            data-slot="transactions-empty"
          >
            {emptyLabel}
          </p>
        ) : collapsed ? (
          <div className="relative" data-slot="transactions-collapsed">
            {list}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-center bg-linear-to-t from-card from-35% to-transparent">
              <Button
                className="pointer-events-auto"
                onClick={() => setExpanded(true)}
                size="sm"
                type="button"
                variant="outline"
              >
                {expandLabel(hidden)}
              </Button>
            </div>
          </div>
        ) : hidden > 0 ? (
          <div className="grid gap-3">
            <ScrollAreaPrimitive.Root
              className="relative"
              data-slot="transactions-scroll"
            >
              <ScrollAreaPrimitive.Viewport
                className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                data-slot="scroll-area-viewport"
                style={{ maxHeight }}
              >
                <ScrollAreaPrimitive.Content
                  className="pe-3"
                  data-slot="scroll-area-content"
                  style={{ minWidth: 0 }}
                >
                  {list}
                </ScrollAreaPrimitive.Content>
              </ScrollAreaPrimitive.Viewport>
              <ScrollBar orientation="vertical" />
            </ScrollAreaPrimitive.Root>
            {collapseLabel ? (
              <Button
                className="justify-self-center"
                onClick={() => setExpanded(false)}
                size="sm"
                type="button"
                variant="ghost"
              >
                {collapseLabel}
              </Button>
            ) : null}
          </div>
        ) : (
          list
        )}
      </CardPanel>
    </CardWidgetShell>
  )
}
