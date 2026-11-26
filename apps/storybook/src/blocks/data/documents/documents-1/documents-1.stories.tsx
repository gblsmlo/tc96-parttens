import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Documents1Controls,
  documents1ControlArgs,
  documents1ControlArgTypes,
} from './documents-1-controls.ts'
import { ComposedDocuments1 } from './documents-1-layouts.tsx'

const meta = {
  args: documents1ControlArgs,
  argTypes: documents1ControlArgTypes,
  decorators: [
    (Story) => (
      <div className="h-[calc(100dvh-2rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDocuments1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/My Documents/Documents1',
} satisfies Meta<Documents1Controls>

export default meta

type Story = StoryObj<Documents1Controls>

export const Documents1: Story = {}
