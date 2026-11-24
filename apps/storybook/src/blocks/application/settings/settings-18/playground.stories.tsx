import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings18Controls,
  settings18ControlArgs,
  settings18ControlArgTypes,
} from './settings-18-controls.ts'
import { ComposedSettings18 } from './settings-18-layouts.tsx'

const meta = {
  args: settings18ControlArgs,
  argTypes: settings18ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings18 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings18/Playground',
} satisfies Meta<Settings18Controls>

export default meta

type Story = StoryObj<Settings18Controls>

export const Playground: Story = {}
