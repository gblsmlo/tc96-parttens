import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings17Controls,
  settings17ControlArgs,
  settings17ControlArgTypes,
} from './settings-17-controls.ts'
import { ComposedSettings17 } from './settings-17-layouts.tsx'

const meta = {
  args: settings17ControlArgs,
  argTypes: settings17ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings17 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings17/Playground',
} satisfies Meta<Settings17Controls>

export default meta

type Story = StoryObj<Settings17Controls>

export const Playground: Story = {}
