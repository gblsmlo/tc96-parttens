import {
  ChatCenteredTextIcon,
  DatabaseIcon,
  RobotIcon,
  WrenchIcon,
} from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlowRunCard, FlowStepLibrary, groupStepTypes } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { agentStepTypes } from './fixtures/agent'
import { failedRun, notRunRun } from './fixtures/runs'
import { EditorFrame } from './step-library-frame.tsx'
import { workflowGroups } from './step-library-layouts.tsx'

const meta = {
  decorators: [EditorFrame],
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Step Library/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const addStep = () => {}

const agentGroups = groupStepTypes(agentStepTypes)

const agentIcons = {
  'collection-search': <DatabaseIcon aria-hidden="true" />,
  'model-chat': <RobotIcon aria-hidden="true" />,
  'reply-message': <ChatCenteredTextIcon aria-hidden="true" />,
  'tool-call': <WrenchIcon aria-hidden="true" />,
}

export const WorkflowSteps: Story = {
  render: () => (
    <FlowStepLibrary groups={workflowGroups} onAdd={addStep}>
      <FlowRunCard run={failedRun} />
    </FlowStepLibrary>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('group', { name: 'Controle de fluxo' }),
    ).toBeVisible()
    await expect(
      canvas.getByText('Enviar e-mail falhou: caixa de entrada cheia'),
    ).toBeVisible()
  },
}

export const AgentTools: Story = {
  render: () => (
    <FlowStepLibrary
      groups={agentGroups}
      icons={agentIcons}
      labels={{
        hint: 'Arraste uma ferramenta para o agente',
        title: 'Ferramentas',
      }}
      onAdd={addStep}
    >
      <FlowRunCard run={notRunRun} />
    </FlowStepLibrary>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('region', { name: 'Ferramentas' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Buscar na coleção' }),
    ).toBeVisible()
  },
}
