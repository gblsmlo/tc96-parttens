import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings16Controls,
  settings16ControlArgs,
  settings16ControlArgTypes,
} from './settings-16-controls.ts'
import { ComposedSettings16 } from './settings-16-layouts.tsx'

const meta = {
  args: settings16ControlArgs,
  argTypes: settings16ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings16 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings16/Playground',
} satisfies Meta<Settings16Controls>

export default meta

type Story = StoryObj<Settings16Controls>

export const Playground: Story = {}
