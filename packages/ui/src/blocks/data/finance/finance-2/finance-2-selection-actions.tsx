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
import type { Finance2Labels, Finance2Transaction } from './types'

const idsOf = ({ selectedRows }: ActionBarContext<Finance2Transaction>) =>
  selectedRows.map((transaction) => transaction.id)

export interface Finance2SelectionActionsOptions {
  labels: Finance2Labels
  onExportSelected?: (transactionIds: string[]) => void
  onFlag?: (transactionIds: string[]) => void
  onRefund?: (transactionIds: string[]) => void
}

export function createFinance2SelectionActions({
  labels,
  onExportSelected,
  onFlag,
  onRefund,
}: Finance2SelectionActionsOptions): ActionBarGroup<Finance2Transaction>[] {
  const items: ActionBarItem<Finance2Transaction>[] = []
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
