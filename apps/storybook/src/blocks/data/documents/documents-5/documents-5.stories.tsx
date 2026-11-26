import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Documents5Controls,
  documents5ControlArgs,
  documents5ControlArgTypes,
} from './documents-5-controls.ts'
import { ComposedDocuments5 } from './documents-5-layouts.tsx'

const meta = {
  args: documents5ControlArgs,
  argTypes: documents5ControlArgTypes,
  decorators: [
    (Story) => (
      <div className="h-[calc(100dvh-2rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedDocuments5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/My Documents/Documents5',
} satisfies Meta<Documents5Controls>

export default meta

type Story = StoryObj<Documents5Controls>

export const Documents5: Story = {}
