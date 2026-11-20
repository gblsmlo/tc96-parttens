import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertCanvas } from './alert-frame.tsx'
import {
  ActionAlert,
  ParagraphsAlert,
  TitleOnlyAlert,
  WithoutIconAlert,
} from './alert-layouts.tsx'

const meta = {
  decorators: [AlertCanvas],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'UI/Alert/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TitleOnly: Story = {
  render: () => <TitleOnlyAlert />,
}

export const WithoutIcon: Story = {
  render: () => <WithoutIconAlert />,
}

export const WithAction: Story = {
  render: () => <ActionAlert />,
}

export const Paragraphs: Story = {
  render: () => <ParagraphsAlert />,
}
