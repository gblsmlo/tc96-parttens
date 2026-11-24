import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings23Controls,
  settings23ControlArgs,
  settings23ControlArgTypes,
} from './settings-23-controls.ts'
import { ComposedSettings23 } from './settings-23-layouts.tsx'

const meta = {
  args: settings23ControlArgs,
  argTypes: settings23ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings23 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings23/Playground',
} satisfies Meta<Settings23Controls>

export default meta

type Story = StoryObj<Settings23Controls>

export const Playground: Story = {}
