import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import {
  type Agenda2Controls,
  agenda2ControlArgs,
  agenda2ControlArgTypes,
} from './agenda-2-controls.ts'
import { ComposedAgenda2 } from './agenda-2-layouts.tsx'

const meta = {
  args: {
    ...agenda2ControlArgs,
    onCreate: fn(),
  },
  argTypes: agenda2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedAgenda2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Dialog/Agenda/Agenda2/Playground',
} satisfies Meta<
  Agenda2Controls & {
    onCreate: () => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}
