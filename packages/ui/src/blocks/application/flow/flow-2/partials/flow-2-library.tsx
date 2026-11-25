'use client'

import type {
  FlowRunSummary,
  FlowStepType,
} from '@tc96/ui/patterns/flow/canvas/core'
import { FlowRunCard } from '@tc96/ui/patterns/flow/step-library/composition/flow-run-card/flow-run-card'
import { FlowStepLibrary } from '@tc96/ui/patterns/flow/step-library/composition/step-library/step-library'
import { groupStepTypes } from '@tc96/ui/patterns/flow/step-library/core'
import { type ComponentProps, type ReactElement, useMemo } from 'react'
import type { FlowPageLabels } from '../../shared/types'
import { flow2Labels } from './flow-2-labels'

export interface Flow2LibraryProps
  extends Omit<
    ComponentProps<typeof FlowStepLibrary>,
    'children' | 'groups' | 'labels'
  > {
  labels?: FlowPageLabels
  run?: FlowRunSummary
  stepTypes: readonly FlowStepType[]
}

export function Flow2Library({
  labels = flow2Labels,
  run,
  stepTypes,
  ...library
}: Readonly<Flow2LibraryProps>): ReactElement {
  const groups = useMemo(() => groupStepTypes(stepTypes), [stepTypes])

  return (
    <FlowStepLibrary {...library} groups={groups} labels={labels.library}>
      {run ? <FlowRunCard labels={labels.runCard} run={run} /> : null}
    </FlowStepLibrary>
  )
}
