import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings19Controls,
  settings19ControlArgs,
  settings19ControlArgTypes,
} from './settings-19-controls.ts'
import { ComposedSettings19 } from './settings-19-layouts.tsx'

const meta = {
  args: settings19ControlArgs,
  argTypes: settings19ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings19 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings19/Playground',
} satisfies Meta<Settings19Controls>

export default meta

type Story = StoryObj<Settings19Controls>

export const Playground: Story = {}
