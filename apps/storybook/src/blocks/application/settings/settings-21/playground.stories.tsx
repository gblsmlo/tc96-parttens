import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings21Controls,
  settings21ControlArgs,
  settings21ControlArgTypes,
} from './settings-21-controls.ts'
import { ComposedSettings21 } from './settings-21-layouts.tsx'

const meta = {
  args: settings21ControlArgs,
  argTypes: settings21ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings21 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings21/Playground',
} satisfies Meta<Settings21Controls>

export default meta

type Story = StoryObj<Settings21Controls>

export const Playground: Story = {}
