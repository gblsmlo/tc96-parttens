import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings20Controls,
  settings20ControlArgs,
  settings20ControlArgTypes,
} from './settings-20-controls.ts'
import { ComposedSettings20 } from './settings-20-layouts.tsx'

const meta = {
  args: settings20ControlArgs,
  argTypes: settings20ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings20 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings20/Playground',
} satisfies Meta<Settings20Controls>

export default meta

type Story = StoryObj<Settings20Controls>

export const Playground: Story = {}
