import {
  ArrowUUpLeftIcon,
  DownloadSimpleIcon,
  FlagIcon,
} from '@phosphor-icons/react'
import type {
  ActionBarContext,
  ActionBarGroup,
  ActionBarItem,
} from '@tc96/ui/patterns/action-bar/components/action-bar'
import type { Table8Labels, Table8Transaction } from './types'

const idsOf = ({ selectedRows }: ActionBarContext<Table8Transaction>) =>
  selectedRows.map((transaction) => transaction.id)

export interface Table8SelectionActionsOptions {
  labels: Table8Labels
  onExportSelected?: (transactionIds: string[]) => void
  onFlag?: (transactionIds: string[]) => void
  onRefund?: (transactionIds: string[]) => void
}

export function createTable8SelectionActions({
  labels,
  onExportSelected,
  onFlag,
  onRefund,
}: Table8SelectionActionsOptions): ActionBarGroup<Table8Transaction>[] {
  const items: ActionBarItem<Table8Transaction>[] = []
  if (onExportSelected)
    items.push({
      icon: <DownloadSimpleIcon aria-hidden="true" />,
      id: 'export',
      label: labels.exportSelected,
      onSelect: (context) => onExportSelected(idsOf(context)),
    })
  if (onRefund)
    items.push({
      icon: <ArrowUUpLeftIcon aria-hidden="true" />,
      id: 'refund',
      label: labels.refund,
      onSelect: (context) => onRefund(idsOf(context)),
    })
  if (onFlag)
    items.push({
      icon: <FlagIcon aria-hidden="true" />,
      id: 'flag',
      label: labels.flag,
      onSelect: (context) => onFlag(idsOf(context)),
    })
  return items.length ? [{ id: 'bulk', items }] : []
}
