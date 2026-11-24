import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings22Controls,
  settings22ControlArgs,
  settings22ControlArgTypes,
} from './settings-22-controls.ts'
import { ComposedSettings22 } from './settings-22-layouts.tsx'

const meta = {
  args: settings22ControlArgs,
  argTypes: settings22ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings22 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings22/Playground',
} satisfies Meta<Settings22Controls>

export default meta

type Story = StoryObj<Settings22Controls>

export const Playground: Story = {}
