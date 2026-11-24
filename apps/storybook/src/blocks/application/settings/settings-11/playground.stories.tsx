import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings11Controls,
  settings11ControlArgs,
  settings11ControlArgTypes,
} from './settings-11-controls.ts'
import { ComposedSettings11 } from './settings-11-layouts.tsx'

const meta = {
  args: settings11ControlArgs,
  argTypes: settings11ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings11 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings11/Playground',
} satisfies Meta<Settings11Controls>

export default meta

type Story = StoryObj<Settings11Controls>

export const Playground: Story = {}
