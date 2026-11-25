import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flow2Library } from '@tc96/ui/blocks/application/flow/flow-2/partials'
import { flowRunSummary } from '@tc96/ui/patterns/flow/canvas/core'
import { expect, fn, userEvent, within } from 'storybook/test'
import {
  collectionsFailedSteps,
  collectionsIcons,
  collectionsSteps,
  collectionsStepTypes,
} from '../../fixtures/collections-agent'

const meta = {
  args: {
    icons: collectionsIcons,
    onAdd: fn(),
    run: flowRunSummary(collectionsSteps),
    stepTypes: collectionsStepTypes,
  },
  component: Flow2Library,
  decorators: [
    (Story) => (
      <div className="flex h-160">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'fullscreen' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Flow/Flow2/Partials/Library',
} satisfies Meta<typeof Flow2Library>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: /Enviar e-mail/ }),
    )
    await expect(args.onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'email' }),
    )
  },
}

export const Failed: Story = {
  args: { run: flowRunSummary(collectionsFailedSteps) },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('region', { name: 'Última execução' }),
    ).toHaveAttribute('data-status', 'failed')
  },
}

export const NoRun: Story = {
  args: { run: undefined },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).queryByRole('region', { name: 'Última execução' }),
    ).toBeNull()
  },
}

export const Collapsed: Story = {
  args: { collapsed: true },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('[data-slot="flow-step-library"]'),
    ).toHaveAttribute('data-collapsed')
  },
}
