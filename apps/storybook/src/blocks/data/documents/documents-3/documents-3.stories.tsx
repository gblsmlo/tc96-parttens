import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Documents3Controls,
  documents3ControlArgs,
  documents3ControlArgTypes,
} from './documents-3-controls.ts'
import { ComposedDocuments3 } from './documents-3-layouts.tsx'

const meta = {
  args: documents3ControlArgs,
  argTypes: documents3ControlArgTypes,
  decorators: [
    (Story) => (
      <div className="h-[calc(100dvh-2rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDocuments3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/My Documents/Documents3',
} satisfies Meta<Documents3Controls>

export default meta

type Story = StoryObj<Documents3Controls>

export const Documents3: Story = {}
