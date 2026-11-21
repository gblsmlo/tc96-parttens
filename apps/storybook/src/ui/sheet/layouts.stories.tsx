import type { Meta, StoryObj } from '@storybook/react-vite'
import { sheetControlArgs } from './sheet-controls.ts'
import {
  ComposedSheet,
  DetachedTriggerSheet,
  ScrollingPanelSheet,
} from './sheet-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'UI/Sheet/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithoutDescription: Story = {
  render: () => <ComposedSheet {...sheetControlArgs} description="" />,
}

export const WithoutPanel: Story = {
  render: () => <ComposedSheet {...sheetControlArgs} body="" />,
}

export const WithoutFooter: Story = {
  render: () => <ComposedSheet {...sheetControlArgs} footer={false} />,
}

export const WithoutCloseButton: Story = {
  render: () => <ComposedSheet {...sheetControlArgs} showCloseButton={false} />,
}

export const ScrollingPanel: Story = {
  render: () => <ScrollingPanelSheet />,
}

export const DetachedTrigger: Story = {
  render: () => <DetachedTriggerSheet />,
}
