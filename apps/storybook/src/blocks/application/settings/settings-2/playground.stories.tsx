import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings2Controls,
  settings2ControlArgs,
  settings2ControlArgTypes,
} from './settings-2-controls.ts'
import { ComposedSettings2 } from './settings-2-layouts.tsx'

const meta = {
  args: settings2ControlArgs,
  argTypes: settings2ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings2 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings2/Playground',
} satisfies Meta<Settings2Controls>

export default meta

type Story = StoryObj<Settings2Controls>

export const Playground: Story = {}
