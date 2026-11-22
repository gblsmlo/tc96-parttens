import type { Meta, StoryObj } from '@storybook/react-vite'
import { LinkIcon, PaperclipIcon } from 'lucide-react'
import { expect, within } from 'storybook/test'
import { AttachmentsCanvas } from './attachments-canvas.tsx'
import {
  meetingMaterial,
  pastedLink,
  recordFiles,
  recordLinks,
  uploadedFile,
} from './attachments-data.ts'
import { StatefulAttachments } from './attachments-layouts.tsx'

const meta = {
  decorators: [AttachmentsCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Attachments/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const RecordFiles: Story = {
  render: () => (
    <StatefulAttachments
      action={{ icon: PaperclipIcon, label: 'Attach file' }}
      ariaLabel="Record files"
      initialItems={recordFiles}
      newItem={uploadedFile}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('link', { name: 'Commercial proposal.pdf' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Attach file' }),
    ).toBeVisible()
  },
}

export const RecordLinks: Story = {
  render: () => (
    <StatefulAttachments
      action={{ icon: LinkIcon, label: 'Add link' }}
      ariaLabel="Record links"
      initialItems={recordLinks}
      newItem={pastedLink}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Support playbook' }),
    ).toBeVisible()
  },
}

export const MeetingMaterial: Story = {
  render: () => (
    <StatefulAttachments
      action={{ icon: PaperclipIcon, label: 'Attach file' }}
      ariaLabel="Meeting material"
      initialItems={meetingMaterial}
      newItem={uploadedFile}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual([
      'Commercial proposal.pdf',
      'Onboarding playbook',
      'Meeting recording',
      'LinkedIn profile',
    ])
  },
}

export const ReadOnlyLinks: Story = {
  render: () => (
    <StatefulAttachments
      ariaLabel="Record links"
      initialItems={recordLinks}
      removable={false}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Support playbook' }),
    ).toBeVisible()
  },
}
