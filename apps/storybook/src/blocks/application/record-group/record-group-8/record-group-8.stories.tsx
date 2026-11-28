import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createRecordGroup8Catalog,
  RecordGroup8 as RecordGroup8Block,
} from '@tc96/ui/blocks/application/record-group/record-group-8'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import {
  initialStage,
  stageCatalogLabels,
  stageLabels,
  stageLink,
} from '../fixtures/stage.ts'

const stageCatalog = createRecordGroup8Catalog(stageCatalogLabels)

function Stage() {
  const [stage, setStage] = useState(initialStage)

  return (
    <RecordGroup8Block
      catalog={stageCatalog}
      labels={stageLabels}
      link={stageLink}
      onRecordChange={(changes) =>
        setStage((current) => ({ ...current, ...changes }))
      }
      record={stage}
    />
  )
}

const meta = {
  component: Stage,
  decorators: [
    (Story) => (
      <div className="w-105 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Group/RecordGroup8',
} satisfies Meta<typeof Stage>

export default meta

type Story = StoryObj<typeof meta>

export const RecordGroup8: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Holds the work of the current stage in one plain group: two editable selects (interest and urgency) followed by a link to a record the stage produced, such as the scheduled appointment. The record comes in as props and edits leave through `onRecordChange`; the link row renders only when `link` (`href`, `label`, `meta`) is passed. The interest and urgency options come from the catalog the block exports (`createRecordGroup8Catalog`).',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const stage = within(
      within(canvasElement).getByRole('region', { name: 'Novo Lead' }),
    )
    await expect(stage.getByText('Sem urgência')).toBeVisible()
    await expect(
      stage.getByRole('link', {
        name: 'Consulta inicial Agendada · 14/10 às 10:00',
      }),
    ).toHaveAttribute('href', '#/agenda/consulta-inicial')
  },
}
