import type { Meta, StoryObj } from '@storybook/react-vite'
import { Flow2Library } from '@tc96/ui/blocks/application/flow/flow-2/partials'
import { flowRunSummary } from '@tc96/ui/patterns/flow/canvas/core'
import { fn } from 'storybook/test'
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

export const Default: Story = {}

export const Failed: Story = {
  args: { run: flowRunSummary(collectionsFailedSteps) },
}

export const NoRun: Story = {
  args: { run: undefined },
}

export const Collapsed: Story = {
  args: { collapsed: true },
}
