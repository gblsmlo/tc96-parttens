import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings6Controls,
  settings6ControlArgs,
  settings6ControlArgTypes,
} from './settings-6-controls.ts'
import { ComposedSettings6 } from './settings-6-layouts.tsx'

const meta = {
  args: settings6ControlArgs,
  argTypes: settings6ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings6/Playground',
} satisfies Meta<Settings6Controls>

export default meta

type Story = StoryObj<Settings6Controls>

export const Playground: Story = {}
