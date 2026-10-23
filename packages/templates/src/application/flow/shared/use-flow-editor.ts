import {
  type FlowConnection,
  type FlowDirection,
  type FlowStepAction,
  type FlowStepType,
  flowStepNodeSize,
  tidyTree,
} from '@tc96/parttens/flow/canvas/core'
import type { FlowEditorProps, FlowPosition, FlowStepValues } from './types'
import type { FlowPageState } from './use-flow-page-state'

const tidyGap: Record<FlowDirection, readonly [number, number]> = {
  horizontal: [96, 48],
  vertical: [48, 88],
}

export function useFlowEditor(
  {
    connections,
    onSelectedStepChange,
    onStepAdd,
    onStepChange,
    onStepDelete,
    onStepDuplicate,
    onStepsChange,
    selectedStepId,
    stepTypes,
    steps,
  }: Readonly<FlowEditorProps>,
  state: FlowPageState,
) {
  const selectedStep = steps.find((step) => step.id === selectedStepId)

  const deleteStep = (stepId: string) => {
    if (stepId === selectedStepId) state.closeInspector()
    onStepDelete?.(stepId)
  }

  const requestDelete = (stepId: string) => {
    const attached = connections.filter(
      (connection) =>
        connection.source === stepId || connection.target === stepId,
    )
    if (attached.length > 0) state.setPendingDelete(stepId)
    else deleteStep(stepId)
  }

  const onStepAction = (
    action: FlowStepAction,
    stepId: string,
    connection?: FlowConnection,
  ) => {
    if (action === 'view' || action === 'edit') {
      onSelectedStepChange?.(stepId)
      state.openInspector(action)
    } else if (action === 'add-after' || action === 'add-branch') {
      state.openInspector('create', { after: stepId, connection })
    } else if (action === 'duplicate') onStepDuplicate?.(stepId)
    else requestDelete(stepId)
  }

  const onSubmit = (values: FlowStepValues) => {
    if (state.mode === 'create') {
      const type = stepTypes.find((item) => item.id === values.type)
      if (type)
        onStepAdd?.(type, {
          after: state.creation.after,
          connection: state.creation.connection,
          values,
        })
      state.closeInspector()
      return
    }
    if (selectedStep) onStepChange?.(selectedStep.id, values)
    state.setMode('view')
  }

  const tidy = (direction: FlowDirection) =>
    onStepsChange?.(
      tidyTree(steps, connections, {
        direction,
        gap: tidyGap[direction],
        nodeSize: flowStepNodeSize,
      }),
    )

  return {
    deleteStep,
    onLibraryAdd: (type: FlowStepType) => onStepAdd?.(type),
    onStepAction,
    onStepDrop: (type: FlowStepType, position: FlowPosition) =>
      onStepAdd?.(type, { position }),
    onSubmit,
    pendingDeleteName:
      steps.find((step) => step.id === state.pendingDelete)?.name ?? '',
    requestDelete,
    selectedStep,
    tidy,
  }
}
