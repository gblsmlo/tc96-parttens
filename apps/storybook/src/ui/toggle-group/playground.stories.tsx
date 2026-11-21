import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ToggleGroupControls,
  toggleGroupControlArgs,
  toggleGroupControlArgTypes,
} from './toggle-group-controls.ts'
import { ComposedToggleGroup } from './toggle-group-layouts.tsx'

const meta = {
  args: toggleGroupControlArgs,
  argTypes: toggleGroupControlArgTypes,
  parameters: { layout: 'centered' },
  render: (args) => <ComposedToggleGroup {...args} />,
  tags: ['!autodocs'],
  title: 'UI/ToggleGroup/Playground',
} satisfies Meta<ToggleGroupControls>

export default meta

type Story = StoryObj<ToggleGroupControls>

export const Playground: Story = {}
