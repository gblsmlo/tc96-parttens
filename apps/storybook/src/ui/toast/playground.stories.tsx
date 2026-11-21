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
  render: (args) => <ComposedToast {...args} />,
  tags: ['!autodocs'],
  title: 'UI/Toast/Playground',
} satisfies Meta<ToastControls>

export default meta

type Story = StoryObj<ToastControls>

export const Playground: Story = {}
