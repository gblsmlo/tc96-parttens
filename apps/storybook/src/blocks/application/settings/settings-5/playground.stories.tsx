import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings5Controls,
  settings5ControlArgs,
  settings5ControlArgTypes,
} from './settings-5-controls.ts'
import { ComposedSettings5 } from './settings-5-layouts.tsx'

const meta = {
  args: settings5ControlArgs,
  argTypes: settings5ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings5 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings5/Playground',
} satisfies Meta<Settings5Controls>

export default meta

type Story = StoryObj<Settings5Controls>

export const Playground: Story = {}
