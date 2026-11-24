import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings8Controls,
  settings8ControlArgs,
  settings8ControlArgTypes,
} from './settings-8-controls.ts'
import { ComposedSettings8 } from './settings-8-layouts.tsx'

const meta = {
  args: settings8ControlArgs,
  argTypes: settings8ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings8 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings8/Playground',
} satisfies Meta<Settings8Controls>

export default meta

type Story = StoryObj<Settings8Controls>

export const Playground: Story = {}
