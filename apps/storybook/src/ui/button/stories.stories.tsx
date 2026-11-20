import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ButtonControls,
  buttonControlArgs,
  buttonControlArgTypes,
} from './button-controls.ts'
import { ComposedButton } from './button-layouts.tsx'

const meta = {
  args: buttonControlArgs,
  argTypes: buttonControlArgTypes,
  parameters: {
    controls: { exclude: ['disabled', 'loading', 'size', 'variant'] },
  },
  render: (args) => <ComposedButton {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Button/Stories',
} satisfies Meta<ButtonControls>

export default meta

type Story = StoryObj<ButtonControls>

export const Default: Story = {}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const Destructive: Story = {
  args: { variant: 'destructive' },
}

export const DestructiveOutline: Story = {
  args: { variant: 'destructive-outline' },
}

export const Ghost: Story = {
  args: { variant: 'ghost' },
}

export const Link: Story = {
  args: { variant: 'link' },
}

export const SizeXs: Story = {
  args: { size: 'xs' },
  name: 'Size xs',
}

export const SizeSm: Story = {
  args: { size: 'sm' },
  name: 'Size sm',
}

export const SizeLg: Story = {
  args: { size: 'lg' },
  name: 'Size lg',
}

export const SizeXl: Story = {
  args: { size: 'xl' },
  name: 'Size xl',
}

export const SizeIconXs: Story = {
  args: { size: 'icon-xs' },
  name: 'Size icon-xs',
}

export const SizeIconSm: Story = {
  args: { size: 'icon-sm' },
  name: 'Size icon-sm',
}

export const SizeIcon: Story = {
  args: { size: 'icon' },
  name: 'Size icon',
}

export const SizeIconLg: Story = {
  args: { size: 'icon-lg' },
  name: 'Size icon-lg',
}

export const SizeIconXl: Story = {
  args: { size: 'icon-xl' },
  name: 'Size icon-xl',
}

export const Loading: Story = {
  args: { loading: true },
}

export const Disabled: Story = {
  args: { disabled: true },
}
