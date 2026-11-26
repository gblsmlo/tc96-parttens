import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Documents4Controls,
  documents4ControlArgs,
  documents4ControlArgTypes,
} from './documents-4-controls.ts'
import { ComposedDocuments4 } from './documents-4-layouts.tsx'

const meta = {
  args: documents4ControlArgs,
  argTypes: documents4ControlArgTypes,
  decorators: [
    (Story) => (
      <div className="h-[calc(100dvh-2rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDocuments4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/My Documents/Documents4',
} satisfies Meta<Documents4Controls>

export default meta

type Story = StoryObj<Documents4Controls>

export const Documents4: Story = {}
