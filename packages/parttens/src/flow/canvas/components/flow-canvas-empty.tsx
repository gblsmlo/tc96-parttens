import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@tc96/ui/empty'
import type { ReactElement } from 'react'
import { flowCanvasEmptyClassName } from '../lib/variants'
import { useFlowCanvasContext } from '../store/flow-canvas-context'

export function FlowCanvasEmpty(): ReactElement {
  const { labels } = useFlowCanvasContext('FlowCanvasEmpty')
  return (
    <div className={flowCanvasEmptyClassName} data-slot="flow-canvas-empty">
      <Empty>
        <EmptyHeader>
          <EmptyTitle>{labels.emptyTitle}</EmptyTitle>
          <EmptyDescription>{labels.emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
