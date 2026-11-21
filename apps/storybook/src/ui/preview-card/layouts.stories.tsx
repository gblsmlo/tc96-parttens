import type { Meta, StoryObj } from '@storybook/react-vite'
import { previewCardControlArgs } from './preview-card-controls.ts'
import {
  ComposedPreviewCard,
  InTextPreviewCard,
  SharedPreviewCard,
} from './preview-card-layouts.tsx'

const meta = {
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/PreviewCard/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const WithAvatar: Story = {
  render: () => <ComposedPreviewCard {...previewCardControlArgs} avatar />,
}

export const TitleOnly: Story = {
  render: () => (
    <ComposedPreviewCard {...previewCardControlArgs} description="" />
  ),
}

export const AsButton: Story = {
  render: () => (
    <ComposedPreviewCard {...previewCardControlArgs} element="button" />
  ),
}

export const InText: Story = {
  render: () => <InTextPreviewCard />,
}

export const SharedPopup: Story = {
  render: () => <SharedPreviewCard />,
}
