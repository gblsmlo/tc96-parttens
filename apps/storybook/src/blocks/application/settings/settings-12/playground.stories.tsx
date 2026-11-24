import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings12Controls,
  settings12ControlArgs,
  settings12ControlArgTypes,
} from './settings-12-controls.ts'
import { ComposedSettings12 } from './settings-12-layouts.tsx'

const meta = {
  args: settings12ControlArgs,
  argTypes: settings12ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings12 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings12/Playground',
} satisfies Meta<Settings12Controls>

export default meta

type Story = StoryObj<Settings12Controls>

export const Playground: Story = {}
