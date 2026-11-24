import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings9Controls,
  settings9ControlArgs,
  settings9ControlArgTypes,
} from './settings-9-controls.ts'
import { ComposedSettings9 } from './settings-9-layouts.tsx'

const meta = {
  args: settings9ControlArgs,
  argTypes: settings9ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings9 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings9/Playground',
} satisfies Meta<Settings9Controls>

export default meta

type Story = StoryObj<Settings9Controls>

export const Playground: Story = {}
