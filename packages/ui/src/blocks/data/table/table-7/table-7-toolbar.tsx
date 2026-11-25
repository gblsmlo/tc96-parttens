import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { TableToolbar, TableToolbarButton } from '../shared/table-toolbar'
import { TableToolbarHeading } from '../shared/table-toolbar-heading'
import type { Table7Labels } from './types'

export interface Table7ToolbarProps {
  description: string
  labels: Table7Labels
  onResetOrder?: () => void
  orderChanged: boolean
}

export function Table7Toolbar({
  description,
  labels,
  onResetOrder,
  orderChanged,
}: Readonly<Table7ToolbarProps>) {
  return (
    <TableToolbar
      aria-label={labels.toolbar}
      left={
        <TableToolbarHeading description={description} title={labels.title} />
      }
      right={
        onResetOrder ? (
          <TableToolbarButton disabled={!orderChanged} onClick={onResetOrder}>
            <ArrowCounterClockwiseIcon aria-hidden="true" />
            {labels.resetOrder}
          </TableToolbarButton>
        ) : undefined
      }
    />
  )
}
