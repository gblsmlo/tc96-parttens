import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type Settings14Controls,
  settings14ControlArgs,
  settings14ControlArgTypes,
} from './settings-14-controls.ts'
import { ComposedSettings14 } from './settings-14-layouts.tsx'

const meta = {
  args: settings14ControlArgs,
  argTypes: settings14ControlArgTypes,
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings14 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings14/Playground',
} satisfies Meta<Settings14Controls>

export default meta

type Story = StoryObj<Settings14Controls>

export const Playground: Story = {}
