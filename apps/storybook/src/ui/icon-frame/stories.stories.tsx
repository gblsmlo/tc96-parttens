import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type IconFrameControls,
  iconFrameControlArgs,
  iconFrameControlArgTypes,
} from './icon-frame-controls.ts'
import { ComposedIconFrame } from './icon-frame-layouts.tsx'

const meta = {
  args: iconFrameControlArgs,
  argTypes: iconFrameControlArgTypes,
  parameters: {
    controls: { exclude: ['element', 'shape', 'size', 'variant'] },
    layout: 'centered',
  },
  render: (args) => <ComposedIconFrame {...args} />,
  tags: ['!autodocs'],
  title: 'UI/IconFrame/Stories',
} satisfies Meta<IconFrameControls>

export default meta

type Story = StoryObj<IconFrameControls>

export const Default: Story = {}

export const Xs: Story = {
  args: { size: 'xs' },
}

export const Sm: Story = {
  args: { size: 'sm' },
}

export const Lg: Story = {
  args: { size: 'lg' },
}

export const Xl: Story = {
  args: { size: 'xl' },
}

export const Rounded: Story = {
  args: { shape: 'rounded' },
}

export const Plain: Story = {
  args: { variant: 'plain' },
}

export const WithoutColor: Story = {
  args: { color: '' },
}
