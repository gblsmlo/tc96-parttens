import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings4Controls,
  settings4ControlArgs,
  settings4ControlArgTypes,
} from './settings-4-controls.ts'
import { ComposedSettings4 } from './settings-4-layouts.tsx'

const meta = {
  args: settings4ControlArgs,
  argTypes: settings4ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings4 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings4/Playground',
} satisfies Meta<Settings4Controls>

export default meta

type Story = StoryObj<Settings4Controls>

export const Playground: Story = {}
