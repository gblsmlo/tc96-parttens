import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { TableToolbar, TableToolbarButton } from '../shared/table-toolbar'
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
        <CollectionToolbarHeading>
          <CollectionToolbarTitle>{labels.title}</CollectionToolbarTitle>
          <CollectionToolbarDescription>
            {description}
          </CollectionToolbarDescription>
        </CollectionToolbarHeading>
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
