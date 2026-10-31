import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlowCanvas } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import {
  twoSteps,
  twoStepsConnections,
  twoStepsTypes,
} from './fixtures/two-steps'

const meta = {
  args: {
    className: 'h-96 rounded-xl border',
    connections: twoStepsConnections,
    stepTypes: twoStepsTypes,
    steps: twoSteps,
  },
  component: FlowCanvas,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Patterns/Flow/Canvas/States',
} satisfies Meta<typeof FlowCanvas>

export default meta
type Story = StoryObj<typeof meta>

export const LoadingRegionIsBusy: Story = {
  args: { connections: [], loading: true, steps: [] },
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', {
      name: 'Canvas do fluxo',
    })
    await expect(region).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="flow-canvas-empty"]'),
    ).toBeNull()
  },
}

export const EmptyWithoutSteps: Story = {
  args: { connections: [], steps: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.react-flow')).not.toBeNull()
    await expect(
      within(canvasElement).getByText('Nenhum passo ainda'),
    ).toBeVisible()
  },
}

export const StepGroupNamedByNameTypeAndState: Story = {
  play: async ({ canvasElement }) => {
    const node = await within(canvasElement).findByRole('group', {
      name: 'Enviar e-mail, E-mail, Não executado',
    })
    await expect(node).toHaveAttribute('aria-roledescription', 'passo')
  },
}
