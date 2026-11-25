import type { Meta, StoryObj } from '@storybook/react-vite'
import { FlagCanvas } from './flag-canvas.tsx'
import {
  type FlagControls,
  flagControlArgs,
  flagControlArgTypes,
} from './flag-controls.ts'
import { ComposedFlag } from './flag-layouts.tsx'

const meta = {
  args: flagControlArgs,
  argTypes: flagControlArgTypes,
  decorators: [FlagCanvas],
  render: (args) => <ComposedFlag {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Flag/Variants',
} satisfies Meta<FlagControls>

export default meta

type Story = StoryObj<FlagControls>

export const Default: Story = {}

export const Inactive: Story = {
  args: { active: false },
  parameters: { controls: { exclude: ['active'] } },
}

export const Plain: Story = {
  args: { variant: 'plain' },
  parameters: { controls: { exclude: ['variant'] } },
}
