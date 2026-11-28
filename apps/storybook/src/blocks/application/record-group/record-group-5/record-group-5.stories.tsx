import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createRecordGroup5Catalog,
  RecordGroup5 as RecordGroup5Block,
} from '@tc96/ui/blocks/application/record-group/record-group-5'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import {
  briefCatalogLabels,
  initialVersions,
  versionsLabels,
} from '../fixtures/brief.ts'

const versionsCatalog = createRecordGroup5Catalog(briefCatalogLabels)

function Versions() {
  const [openVersion, setOpenVersion] = useState<number | null>(null)

  return (
    <RecordGroup5Block
      catalog={versionsCatalog}
      labels={versionsLabels}
      onOpenVersionChange={setOpenVersion}
      openVersion={openVersion}
      versions={initialVersions}
    />
  )
}

const meta = {
  component: Versions,
  decorators: [
    (Story) => (
      <div className="w-105 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Group/RecordGroup5',
} satisfies Meta<typeof Versions>

export default meta

type Story = StoryObj<typeof meta>

export const RecordGroup5: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Lists the history of a record: a plain group with one link per version (icon, title, status badge) that opens that version in a read-only `RecordPreview`. The versions and the open version come in as props, every field of the preview is a read-only select, and opening or closing leaves through `onOpenVersionChange`. The objective and target options and the status vocabulary come from the catalog the block exports (`createRecordGroup5Catalog`).',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const versions = within(
      within(canvasElement).getByRole('region', { name: 'Versões' }),
    )
    const first = versions.getByRole('button', { name: 'Versão 1 Publicada' })

    await expect(
      versions.getByRole('button', { name: 'Versão 2 Rascunho' }),
    ).toBeVisible()
    await expect(first).toBeVisible()
  },
}
