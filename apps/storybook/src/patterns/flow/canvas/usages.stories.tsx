import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  FlowCanvas,
  FlowCanvasControls,
  FlowCanvasMinimap,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { expect, within } from 'storybook/test'
import { tidy } from './canvas-data.ts'
import { CanvasFrame } from './canvas-frame.tsx'
import {
  collectionsConnections,
  collectionsSteps,
  collectionsStepTypes,
} from './fixtures/collections-agent'
import { collectionsIcons, leadRoutingIcons } from './fixtures/icons'
import {
  leadRoutingConnections,
  leadRoutingSteps,
  leadRoutingStepTypes,
} from './fixtures/lead-routing'
import { useFlowState } from './fixtures/use-flow-state'

const meta = {
  decorators: [CanvasFrame],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Canvas/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

function LeadRouting() {
  const flow = useFlowState(leadRoutingSteps, leadRoutingConnections)
  return (
    <FlowCanvas
      connections={flow.connections}
      icons={leadRoutingIcons}
      onConnect={({ source, target }) => flow.connect(source, target)}
      onConnectionsChange={flow.setConnections}
      onSelect={flow.setSelectedStepId}
      onStepAction={(action, stepId) => {
        if (action === 'delete') flow.remove(stepId)
      }}
      onStepDrop={flow.addStep}
      onStepsChange={flow.setSteps}
      selectedStepId={flow.selectedStepId}
      snapToGrid
      stepTypes={leadRoutingStepTypes}
      steps={flow.steps}
    >
      <FlowCanvasControls>
        <Button
          onClick={() =>
            flow.setSteps(tidy(flow.steps, flow.connections, 'horizontal'))
          }
          size="sm"
          variant="outline"
        >
          Reorganizar
        </Button>
      </FlowCanvasControls>
      <FlowCanvasMinimap />
    </FlowCanvas>
  )
}

function CollectionsAgent() {
  const flow = useFlowState(collectionsSteps, collectionsConnections)
  return (
    <FlowCanvas
      connections={flow.connections}
      direction="vertical"
      icons={collectionsIcons}
      onConnect={({ source, target }) => flow.connect(source, target)}
      onConnectionsChange={flow.setConnections}
      onSelect={flow.setSelectedStepId}
      onStepAction={(action, stepId) => {
        if (action === 'delete') flow.remove(stepId)
      }}
      onStepDrop={flow.addStep}
      onStepsChange={flow.setSteps}
      selectedStepId={flow.selectedStepId}
      stepTypes={collectionsStepTypes}
      steps={flow.steps}
    >
      <FlowCanvasControls>
        <Button
          onClick={() =>
            flow.setSteps(tidy(flow.steps, flow.connections, 'vertical'))
          }
          size="sm"
          variant="outline"
        >
          Organizar árvore
        </Button>
      </FlowCanvasControls>
    </FlowCanvas>
  )
}

export const LeadRoutingWorkflow: Story = {
  render: () => <LeadRouting />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByRole('group', {
        name: 'Avisar o time de vendas, Mensagem no Slack, Falhou',
      }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('group', { name: 'Controles do canvas' }),
    ).toBeVisible()
  },
}

export const CollectionsAgentRun: Story = {
  render: () => <CollectionsAgent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByRole('group', {
        name: 'Decidir abordagem, Decidir abordagem, Sucesso',
      }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Organizar árvore' }),
    ).toBeVisible()
  },
}
