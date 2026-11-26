import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Agenda1Controls,
  agenda1ControlArgs,
  agenda1ControlArgTypes,
} from './agenda-1-controls.ts'
import { ComposedAgenda1 } from './agenda-1-layouts.tsx'

const meta = {
  args: agenda1ControlArgs,
  argTypes: agenda1ControlArgTypes,
  decorators: [
    (Story) => (
      <div className="h-[calc(100dvh-2rem)]">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
  render: (args) => <ComposedAgenda1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Data/Agenda/Agenda1/Playground',
} satisfies Meta<Agenda1Controls>

export default meta

type Story = StoryObj<Agenda1Controls>

export const Playground: Story = {}
