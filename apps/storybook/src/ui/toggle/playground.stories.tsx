import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ToggleControls,
  toggleControlArgs,
  toggleControlArgTypes,
} from './toggle-controls.ts'
import { ComposedToggle } from './toggle-layouts.tsx'

const meta = {
  args: toggleControlArgs,
  argTypes: toggleControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedToggle {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Toggle/Playground',
} satisfies Meta<ToggleControls>

export default meta

type Story = StoryObj<ToggleControls>

export const Playground: Story = {}
