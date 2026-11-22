import {
  FlowCanvas,
  FlowCanvasControls,
  FlowCanvasMinimap,
  FlowShortcutsPopover,
} from '@tc96/parttens'
import { Toggle } from '@tc96/ui/toggle'
import { LockIcon } from 'lucide-react'
import { useState } from 'react'
import type { CanvasControls } from './canvas-controls.ts'
import { sampleSelectedStepId, sampleSteps } from './canvas-data.ts'
import { leadRoutingIcons } from './fixtures/icons'
import {
  leadRoutingConnections,
  leadRoutingStepTypes,
} from './fixtures/lead-routing'
import { useFlowState } from './fixtures/use-flow-state'

export const LockToggle = ({
  locked,
  onLockedChange,
}: Readonly<{
  locked: boolean
  onLockedChange: (locked: boolean) => void
}>) => (
  <Toggle
    aria-label="Travar canvas"
    onPressedChange={onLockedChange}
    pressed={locked}
    size="sm"
    variant="outline"
  >
    <LockIcon aria-hidden="true" />
  </Toggle>
)

const SampleCanvas = ({
  controls,
  direction,
  edgeControls,
  empty,
  loading,
  locked: initialLocked,
  minimap,
  run,
  selected,
  shortcuts,
  stepMenu,
}: Readonly<CanvasControls>) => {
  const flow = useFlowState(
    empty ? [] : sampleSteps(direction, run),
    empty ? [] : leadRoutingConnections,
    selected ? sampleSelectedStepId : null,
  )
  const [locked, setLocked] = useState(initialLocked)

  return (
    <FlowCanvas
      connections={flow.connections}
      direction={direction}
      edgeControls={edgeControls || undefined}
      icons={leadRoutingIcons}
      loading={loading}
      locked={locked}
      onConnect={({ source, target }) => flow.connect(source, target)}
      onConnectionsChange={flow.setConnections}
      onSelect={flow.setSelectedStepId}
      onStepAction={(action, stepId) => {
        if (action === 'delete') flow.remove(stepId)
      }}
      onStepDrop={flow.addStep}
      onStepsChange={flow.setSteps}
      selectedStepId={flow.selectedStepId}
      stepMenu={stepMenu || undefined}
      stepTypes={leadRoutingStepTypes}
      steps={flow.steps}
    >
      {controls ? (
        <FlowCanvasControls>
          <LockToggle locked={locked} onLockedChange={setLocked} />
          {shortcuts ? <FlowShortcutsPopover /> : null}
        </FlowCanvasControls>
      ) : null}
      {minimap ? <FlowCanvasMinimap /> : null}
    </FlowCanvas>
  )
}

export const ComposedFlowCanvas = (args: Readonly<CanvasControls>) => (
  <SampleCanvas
    key={[
      args.direction,
      args.empty,
      args.locked,
      args.run,
      args.selected,
    ].join()}
    {...args}
  />
)
