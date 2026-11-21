import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  type ToastControls,
  toastControlArgs,
  toastControlArgTypes,
} from './toast-controls.ts'
import { ComposedToast } from './toast-layouts.tsx'

const meta = {
  args: toastControlArgs,
  argTypes: toastControlArgTypes,
  parameters: { controls: { exclude: ['position', 'type'] } },
  render: (args) => <ComposedToast {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Toast/Stories',
} satisfies Meta<ToastControls>

export default meta

type Story = StoryObj<ToastControls>

export const Default: Story = {}

export const Success: Story = {
  args: { type: 'success' },
}

export const ErrorType: Story = {
  args: { type: 'error' },
  name: 'Error',
}

export const Info: Story = {
  args: { type: 'info' },
}

export const Warning: Story = {
  args: { type: 'warning' },
}

export const Loading: Story = {
  args: { type: 'loading' },
}

export const PositionTopLeft: Story = {
  args: { position: 'top-left' },
  name: 'Position top-left',
}

export const PositionTopCenter: Story = {
  args: { position: 'top-center' },
  name: 'Position top-center',
}

export const PositionTopRight: Story = {
  args: { position: 'top-right' },
  name: 'Position top-right',
}

export const PositionBottomLeft: Story = {
  args: { position: 'bottom-left' },
  name: 'Position bottom-left',
}

export const PositionBottomCenter: Story = {
  args: { position: 'bottom-center' },
  name: 'Position bottom-center',
}
