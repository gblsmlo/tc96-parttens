import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import {
  TableToolbar,
  TableToolbarButton,
} from '../../shared/table/table-toolbar'
import type { Support4Labels } from './types'

export interface Support4ToolbarProps {
  description: string
  labels: Support4Labels
  onResetOrder?: () => void
  orderChanged: boolean
}

export function Support4Toolbar({
  description,
  labels,
  onResetOrder,
  orderChanged,
}: Readonly<Support4ToolbarProps>) {
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
