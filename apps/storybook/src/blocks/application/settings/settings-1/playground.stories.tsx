import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings1Controls,
  settings1ControlArgs,
  settings1ControlArgTypes,
} from './settings-1-controls.ts'
import { ComposedSettings1 } from './settings-1-layouts.tsx'

const meta = {
  args: settings1ControlArgs,
  argTypes: settings1ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings1/Playground',
} satisfies Meta<Settings1Controls>

export default meta

type Story = StoryObj<Settings1Controls>

export const Playground: Story = {}
