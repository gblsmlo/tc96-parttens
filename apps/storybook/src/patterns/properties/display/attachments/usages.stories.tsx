import { LinkIcon, PaperclipIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
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
  parameters: {
    docs: {
      description: {
        story:
          'The documents of a deal, on the [Default](?path=/story/patterns-properties-display-attachments-layouts--default) layout: a click on Anexar arquivo adds the kickoff minutes, as an upload would.',
      },
    },
  },
  render: () => (
    <StatefulAttachments
      action={{ icon: PaperclipIcon, label: 'Anexar arquivo' }}
      ariaLabel="Arquivos do negócio"
      initialItems={recordFiles}
      newItem={uploadedFile}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('link', { name: 'Proposta comercial.pdf' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Anexar arquivo' }),
    ).toBeVisible()
  },
}

export const RecordLinks: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The links of a support case, on the [Default](?path=/story/patterns-properties-display-attachments-layouts--default) layout, with a link icon on the add trigger: a click adds the status page.',
      },
    },
  },
  render: () => (
    <StatefulAttachments
      action={{ icon: LinkIcon, label: 'Adicionar link' }}
      ariaLabel="Links do chamado"
      initialItems={recordLinks}
      newItem={pastedLink}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Playbook de suporte' }),
    ).toBeVisible()
  },
}

export const MeetingMaterial: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The material of a meeting, one item of each type, on the [Default](?path=/story/patterns-properties-display-attachments-layouts--default) layout: the recording and the documents download, the profile opens as a link.',
      },
    },
  },
  render: () => (
    <StatefulAttachments
      action={{ icon: PaperclipIcon, label: 'Anexar arquivo' }}
      ariaLabel="Material da reunião"
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
      'Proposta comercial.pdf',
      'Playbook de onboarding',
      'Gravação da reunião',
      'Perfil no LinkedIn',
    ])
  },
}

export const ReadOnlyLinks: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The links of a closed support case, on the [Default](?path=/story/patterns-properties-display-attachments-layouts--default) layout with no add trigger and no remove buttons.',
      },
    },
  },
  render: () => (
    <StatefulAttachments
      ariaLabel="Links do chamado"
      initialItems={recordLinks}
      removable={false}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Playbook de suporte' }),
    ).toBeVisible()
  },
}
