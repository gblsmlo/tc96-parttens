import type { Meta, StoryObj } from '@storybook/react-vite'
import { toastControlArgs } from './toast-controls.ts'
import {
  AnchoredToast,
  ComposedToast,
  StackedToasts,
} from './toast-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/Toast/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TitleOnly: Story = {
  render: () => <ComposedToast {...toastControlArgs} description="" />,
}

export const WithAction: Story = {
  render: () => <ComposedToast {...toastControlArgs} action />,
}

export const Stacked: Story = {
  render: () => <StackedToasts />,
}

export const Anchored: Story = {
  render: () => <AnchoredToast />,
}

export const TooltipStyle: Story = {
  render: () => <AnchoredToast tooltipStyle />,
}
