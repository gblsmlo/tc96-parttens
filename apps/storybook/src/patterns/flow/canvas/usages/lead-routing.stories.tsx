import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  FlowCanvas,
  FlowCanvasControls,
  FlowCanvasMinimap,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { expect, within } from 'storybook/test'
import { leadRoutingIcons } from '../fixtures/icons'
import {
  leadRoutingConnections,
  leadRoutingSteps,
  leadRoutingStepTypes,
} from '../fixtures/lead-routing'
import { useFlowState } from '../fixtures/use-flow-state'

function LeadRouting() {
  const flow = useFlowState(leadRoutingSteps, leadRoutingConnections)
  return (
    <FlowCanvas
      className="h-136 rounded-xl border"
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
        <Button size="sm" variant="outline">
          Reorganizar
        </Button>
      </FlowCanvasControls>
      <FlowCanvasMinimap />
    </FlowCanvas>
  )
}

const meta = {
  component: LeadRouting,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Canvas/Usages/Lead Routing',
} satisfies Meta<typeof LeadRouting>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DefaultInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const node = await canvas.findByRole('group', {
      name: 'Avisar o time de vendas, Mensagem no Slack, Falhou',
    })
    await expect(node).toBeVisible()
    await expect(
      canvas.getByRole('group', { name: 'Controles do canvas' }),
    ).toBeVisible()
  },
  tags: ['!dev', '!autodocs'],
}
