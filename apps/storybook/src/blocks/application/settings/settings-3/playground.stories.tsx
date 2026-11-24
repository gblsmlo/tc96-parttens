import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings3Controls,
  settings3ControlArgs,
  settings3ControlArgTypes,
} from './settings-3-controls.ts'
import { ComposedSettings3 } from './settings-3-layouts.tsx'

const meta = {
  args: settings3ControlArgs,
  argTypes: settings3ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings3 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings3/Playground',
} satisfies Meta<Settings3Controls>

export default meta

type Story = StoryObj<Settings3Controls>

export const Playground: Story = {}
