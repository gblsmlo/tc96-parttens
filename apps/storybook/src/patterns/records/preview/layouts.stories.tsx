import type { Meta, StoryObj } from '@storybook/react-vite'
import { recordPreviewControlArgs } from './record-preview-controls.ts'
import { ComposedRecordPreview } from './record-preview-layouts.tsx'

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Preview/Layouts',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TitleOnly: Story = {
  render: () => (
    <ComposedRecordPreview
      {...recordPreviewControlArgs}
      actions={false}
      description=""
    />
  ),
}

export const WithBody: Story = {
  render: () => <ComposedRecordPreview {...recordPreviewControlArgs} body />,
}

export const WithFooter: Story = {
  render: () => <ComposedRecordPreview {...recordPreviewControlArgs} footer />,
}

export const LongContent: Story = {
  render: () => (
    <ComposedRecordPreview {...recordPreviewControlArgs} footer longContent />
  ),
}

export const LongTitle: Story = {
  render: () => (
    <ComposedRecordPreview
      {...recordPreviewControlArgs}
      title="Rework the onboarding flow so that the sign-up, the e-mail check and the first project share one continuous path"
    />
  ),
}
