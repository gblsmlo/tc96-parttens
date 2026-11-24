import {
  type FlowConnection,
  type FlowDirection,
  type FlowStep,
  flowStepNodeSize,
  tidyTree,
} from '@tc96/ui/patterns'
import type { CanvasRunName } from './canvas-variants.ts'
import {
  leadRoutingConnections,
  leadRoutingSteps,
} from './fixtures/lead-routing'

export const treeGap = {
  horizontal: [64, 40],
  vertical: [48, 88],
} as const satisfies Record<FlowDirection, readonly [number, number]>

export const tidy = (
  steps: readonly FlowStep[],
  connections: readonly FlowConnection[],
  direction: FlowDirection,
) =>
  tidyTree(steps, connections, {
    direction,
    gap: treeGap[direction],
    nodeSize: flowStepNodeSize,
  })

const withRun = (step: FlowStep, run: CanvasRunName): FlowStep => {
  if (run === 'last-run') return step
  if (run === 'not-run') return { ...step, run: { status: 'not-run' } }
  return {
    ...step,
    run: { durationMs: step.run?.durationMs ?? 600, status: run },
  }
}

export const sampleSteps = (
  direction: FlowDirection,
  run: CanvasRunName,
): FlowStep[] =>
  tidy(
    leadRoutingSteps.map((step) => withRun(step, run)),
    leadRoutingConnections,
    direction,
  )

export const sampleSelectedStepId = 'qualified'
