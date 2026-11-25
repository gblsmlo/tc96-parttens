import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flow2Canvas } from '@tc96/ui/blocks/application/flow/flow-2/partials'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  collectionsConnections,
  collectionsFailedSteps,
  collectionsIcons,
  collectionsSteps,
  collectionsStepTypes,
} from '../../fixtures/collections-agent'

const meta = {
  args: {
    connections: collectionsConnections,
    icons: collectionsIcons,
    onTidy: fn(),
    stepTypes: collectionsStepTypes,
    steps: collectionsSteps,
  },
  component: Flow2Canvas,
  decorators: [
    (Story) => (
      <div className="h-160">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Flow/Flow2/Partials/Canvas',
} satisfies Meta<typeof Flow2Canvas>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Organizar árvore' }),
    )
    await expect(args.onTidy).toHaveBeenCalledOnce()
  },
}

export const Failed: Story = {
  args: { steps: collectionsFailedSteps },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector(
        '[data-slot="flow-step-node"][data-status="failed"]',
      ),
    ).not.toBeNull()
  },
}

export const Locked: Story = {
  args: { locked: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Organizar árvore' }),
    ).toBeDisabled()
  },
}

export const Empty: Story = {
  args: { connections: [], steps: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum passo ainda'),
    ).toBeVisible()
  },
}
