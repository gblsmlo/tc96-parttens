import type { Meta, StoryObj } from '@storybook/react-vite'
import { dialogControlArgs } from './dialog-controls.ts'
import {
  ComposedDialog,
  DetachedTriggerDialog,
  NestedDialog,
  ScrollingPanelDialog,
} from './dialog-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/Dialog/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutDescription: Story = {
  render: () => <ComposedDialog {...dialogControlArgs} description="" />,
}

export const WithoutPanel: Story = {
  render: () => <ComposedDialog {...dialogControlArgs} body="" />,
}

export const WithoutFooter: Story = {
  render: () => <ComposedDialog {...dialogControlArgs} footer={false} />,
}

export const WithoutCloseButton: Story = {
  render: () => (
    <ComposedDialog {...dialogControlArgs} showCloseButton={false} />
  ),
}

export const ScrollingPanel: Story = {
  render: () => <ScrollingPanelDialog />,
}

export const DetachedTrigger: Story = {
  render: () => <DetachedTriggerDialog />,
}

export const InsideDialog: Story = {
  render: () => <NestedDialog />,
}
