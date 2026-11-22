import {
  FlowRunCard,
  FlowStepLibrary,
  type FlowStepType,
  groupStepTypes,
} from '@tc96/parttens'
import { workflowStepTypes } from './fixtures/workflow'
import type { StepLibraryControls } from './step-library-controls.ts'
import { stepLibraryRuns } from './step-library-variants.ts'

export const workflowGroups = groupStepTypes(workflowStepTypes)

const addStep = (_type: FlowStepType) => {}

export const ComposedStepLibrary = ({
  collapsed,
  disabled,
  empty,
  hint,
  loading,
  onAdd = addStep,
  run,
  runCard,
  title,
}: Readonly<
  StepLibraryControls & { onAdd?: (type: FlowStepType) => void }
>) => (
  <FlowStepLibrary
    collapsed={collapsed}
    disabled={disabled}
    groups={empty ? [] : workflowGroups}
    labels={{ ...(hint ? { hint } : {}), ...(title ? { title } : {}) }}
    loading={loading}
    onAdd={onAdd}
  >
    {runCard ? <FlowRunCard run={stepLibraryRuns[run]} /> : null}
  </FlowStepLibrary>
)
