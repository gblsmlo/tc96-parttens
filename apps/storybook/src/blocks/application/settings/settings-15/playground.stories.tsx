import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings15Controls,
  settings15ControlArgs,
  settings15ControlArgTypes,
} from './settings-15-controls.ts'
import { ComposedSettings15 } from './settings-15-layouts.tsx'

const meta = {
  args: settings15ControlArgs,
  argTypes: settings15ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings15 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings15/Playground',
} satisfies Meta<Settings15Controls>

export default meta

type Story = StoryObj<Settings15Controls>

export const Playground: Story = {}
