import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconLabelCanvas } from './icon-label-canvas.tsx'
import {
  type IconLabelControls,
  iconLabelControlArgs,
  iconLabelControlArgTypes,
} from './icon-label-controls.ts'
import { ComposedIconLabel } from './icon-label-layouts.tsx'

const meta = {
  args: iconLabelControlArgs,
  argTypes: iconLabelControlArgTypes,
  decorators: [IconLabelCanvas],
  parameters: { controls: { exclude: ['element', 'muted', 'variant'] } },
  render: (args) => <ComposedIconLabel {...args} />,
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Icon Label/Stories',
} satisfies Meta<IconLabelControls>

export default meta

type Story = StoryObj<IconLabelControls>

export const Default: Story = {}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const Muted: Story = {
  args: { muted: true },
}
