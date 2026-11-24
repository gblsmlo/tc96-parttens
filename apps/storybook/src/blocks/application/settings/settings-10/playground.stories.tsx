import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings10Controls,
  settings10ControlArgs,
  settings10ControlArgTypes,
} from './settings-10-controls.ts'
import { ComposedSettings10 } from './settings-10-layouts.tsx'

const meta = {
  args: settings10ControlArgs,
  argTypes: settings10ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings10 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings10/Playground',
} satisfies Meta<Settings10Controls>

export default meta

type Story = StoryObj<Settings10Controls>

export const Playground: Story = {}
