import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { GridToolbar, GridToolbarButton } from '../shared/grid-toolbar'
import type { DataGrid7Labels } from './types'

export interface DataGrid7ToolbarProps {
  description: string
  labels: DataGrid7Labels
  onResetOrder?: () => void
  orderChanged: boolean
}

export function DataGrid7Toolbar({
  description,
  labels,
  onResetOrder,
  orderChanged,
}: Readonly<DataGrid7ToolbarProps>) {
  return (
    <GridToolbar
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
          <GridToolbarButton disabled={!orderChanged} onClick={onResetOrder}>
            <ArrowCounterClockwiseIcon aria-hidden="true" />
            {labels.resetOrder}
          </GridToolbarButton>
        ) : undefined
      }
    />
  )
}
