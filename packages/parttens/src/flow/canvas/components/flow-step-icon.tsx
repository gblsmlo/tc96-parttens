import { IconFrame } from '@tc96/elements/icon-frame'
import { cn } from '@tc96/utils'
import type { ReactElement } from 'react'
import type { FlowStep, FlowStepKind } from '../core'
import { flowFallbackIcon, flowKindIcons } from '../lib/steps'
import { flowStepNodeIconVariants } from '../lib/variants'
import { useFlowCanvasContext } from '../store/flow-canvas-context'

export function FlowStepIcon({
  kind,
  step,
}: Readonly<{ kind: FlowStepKind; step: FlowStep }>): ReactElement {
  const { icons } = useFlowCanvasContext('FlowStepIcon')
  const Fallback = flowKindIcons[kind] ?? flowFallbackIcon
  return (
    <IconFrame
      className={cn(flowStepNodeIconVariants({ kind }))}
      data-kind={kind}
      shape="rounded"
      variant="plain"
    >
      {icons[step.type] ?? <Fallback />}
    </IconFrame>
  )
}
