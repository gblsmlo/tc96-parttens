import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type SeparatorControls,
  separatorControlArgs,
  separatorControlArgTypes,
} from './separator-controls.ts'
import { SeparatorCanvas } from './separator-frame.tsx'
import { ComposedSeparator } from './separator-layouts.tsx'

const meta = {
  args: separatorControlArgs,
  argTypes: separatorControlArgTypes,
  decorators: [SeparatorCanvas],
  parameters: {
    controls: { exclude: ['orientation'] },
    layout: 'centered',
  },
  render: (args) => <ComposedSeparator {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Separator/Stories',
} satisfies Meta<SeparatorControls>

export default meta

type Story = StoryObj<SeparatorControls>

export const Default: Story = {}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
}
