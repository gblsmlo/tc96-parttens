import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import {
  CollectionToolbarDescription,
  CollectionToolbarHeading,
  CollectionToolbarTitle,
} from '@tc96/ui/patterns/toolbar/components/collection-toolbar-heading'
import { GridToolbar, GridToolbarButton } from '../../shared/grid/grid-toolbar'
import type { Support3Labels } from './types'

export interface Support3ToolbarProps {
  description: string
  labels: Support3Labels
  onResetOrder?: () => void
  orderChanged: boolean
}

export function Support3Toolbar({
  description,
  labels,
  onResetOrder,
  orderChanged,
}: Readonly<Support3ToolbarProps>) {
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
