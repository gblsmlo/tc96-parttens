'use client'

import type {
  FlowRunSummary,
  FlowStepType,
} from '@tc96/parttens/flow/canvas/core'
import { FlowRunCard } from '@tc96/parttens/flow/step-library/composition/flow-run-card/flow-run-card'
import { FlowStepLibrary } from '@tc96/parttens/flow/step-library/composition/step-library/step-library'
import { groupStepTypes } from '@tc96/parttens/flow/step-library/core'
import { type ComponentProps, type ReactElement, useMemo } from 'react'
import type { FlowPageLabels } from '../../shared/types'
import { agentBuilderLabels } from './agent-builder-labels'

export interface AgentBuilderLibraryProps
  extends Omit<
    ComponentProps<typeof FlowStepLibrary>,
    'children' | 'groups' | 'labels'
  > {
  labels?: FlowPageLabels
  run?: FlowRunSummary
  stepTypes: readonly FlowStepType[]
}

export function AgentBuilderLibrary({
  labels = agentBuilderLabels,
  run,
  stepTypes,
  ...library
}: Readonly<AgentBuilderLibraryProps>): ReactElement {
  const groups = useMemo(() => groupStepTypes(stepTypes), [stepTypes])

  return (
    <FlowStepLibrary {...library} groups={groups} labels={labels.library}>
      {run ? <FlowRunCard labels={labels.runCard} run={run} /> : null}
    </FlowStepLibrary>
  )
}
