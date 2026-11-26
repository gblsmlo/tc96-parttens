import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Legal8Controls,
  legal8ControlArgs,
  legal8ControlArgTypes,
} from './legal-8-controls.ts'
import { ComposedLegal8 } from './legal-8-layouts.tsx'

const meta = {
  args: legal8ControlArgs,
  argTypes: legal8ControlArgTypes,
  decorators: [
    (Story) => (
      <div className="h-[calc(100dvh-2rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedLegal8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Legal/Legal8/Playground',
} satisfies Meta<Legal8Controls>

export default meta

type Story = StoryObj<Legal8Controls>

export const Playground: Story = {}
