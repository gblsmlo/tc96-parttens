import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings7Controls,
  settings7ControlArgs,
  settings7ControlArgTypes,
} from './settings-7-controls.ts'
import { ComposedSettings7 } from './settings-7-layouts.tsx'

const meta = {
  args: settings7ControlArgs,
  argTypes: settings7ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings7 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings7/Playground',
} satisfies Meta<Settings7Controls>

export default meta

type Story = StoryObj<Settings7Controls>

export const Playground: Story = {}
