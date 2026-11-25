import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { GridToolbar, GridToolbarButton } from '../shared/grid-toolbar'
import { GridToolbarHeading } from '../shared/grid-toolbar-heading'
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
        <GridToolbarHeading description={description} title={labels.title} />
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
