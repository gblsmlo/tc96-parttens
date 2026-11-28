import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createRecordGroup4Catalog,
  RecordGroup4 as RecordGroup4Block,
} from '@tc96/ui/blocks/application/record-group/record-group-4'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import {
  type BriefVersion,
  briefCatalogLabels,
  briefingLabels,
  initialVersions,
  today,
} from '../fixtures/brief.ts'

const briefCatalog = createRecordGroup4Catalog(briefCatalogLabels)

function Briefing() {
  const [versions, setVersions] = useState(initialVersions)
  const latest = versions[0] as BriefVersion
  const [values, setValues] = useState(latest.values)
  const [open, setOpen] = useState(false)

  const commit = (status: BriefVersion['status']) =>
    setVersions((current) => {
      const [head, ...rest] = current as [BriefVersion, ...BriefVersion[]]
      const next = { savedAt: today, status, values }
      return head.status === 'draft'
        ? [{ ...head, ...next }, ...rest]
        : [{ ...next, number: head.number + 1 }, ...current]
    })

  return (
    <RecordGroup4Block
      catalog={briefCatalog}
      labels={briefingLabels}
      onOpenChange={setOpen}
      onPublish={() => commit('published')}
      onSaveDraft={() => commit('draft')}
      onValuesChange={(changes) =>
        setValues((current) => ({ ...current, ...changes }))
      }
      open={open}
      values={values}
      versions={versions}
    />
  )
}

const meta = {
  component: Briefing,
  decorators: [
    (Story) => (
      <div className="w-105 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Group/RecordGroup4',
} satisfies Meta<typeof Briefing>

export default meta

type Story = StoryObj<typeof meta>

export const RecordGroup4: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Edits a form behind one row: a plain group with one link (icon, title, status badge of the latest version) that opens a `RecordPreview`. The preview holds one editable select per brief field, the save state in its description and the commands that save a draft or publish a version in its footer. The versions, the form values and the open state come in as props, the unsaved state is derived by comparing the values with the latest version, and every change leaves through a callback. The objective and target options and the status vocabulary come from the catalog the block exports (`createRecordGroup4Catalog`).',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const trigger = within(
      within(canvasElement).getByRole('region', { name: 'Briefing' }),
    ).getByRole('button', {
      name: 'Briefing Rascunho',
    })
    await expect(trigger).toBeVisible()
    await expect(trigger).toHaveAttribute('data-slot', 'record-group-link')
  },
}
