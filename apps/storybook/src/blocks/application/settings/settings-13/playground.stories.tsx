import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings13Controls,
  settings13ControlArgs,
  settings13ControlArgTypes,
} from './settings-13-controls.ts'
import { ComposedSettings13 } from './settings-13-layouts.tsx'

const meta = {
  args: settings13ControlArgs,
  argTypes: settings13ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings13 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings13/Playground',
} satisfies Meta<Settings13Controls>

export default meta

type Story = StoryObj<Settings13Controls>

export const Playground: Story = {}
