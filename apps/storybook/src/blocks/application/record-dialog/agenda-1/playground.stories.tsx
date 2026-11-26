import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type Agenda1Controls,
  agenda1ControlArgs,
  agenda1ControlArgTypes,
} from './agenda-1-controls.ts'
import { ComposedAgenda1 } from './agenda-1-layouts.tsx'

const meta = {
  args: {
    ...agenda1ControlArgs,
    onCreate: fn(),
  },
  argTypes: agenda1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedAgenda1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Agenda/Agenda1/Playground',
} satisfies Meta<
  Agenda1Controls & {
    onCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
