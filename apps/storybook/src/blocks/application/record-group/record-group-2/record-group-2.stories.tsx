import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroup2 as RecordGroup2Block } from '@tc96/ui/blocks/application/record-group/record-group-2'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { sleep } from '../../../../test-utils/sleep'
import { recordTriggers, triggerLabels } from '../fixtures/triggers.ts'

function RecordTriggers() {
  const [runningId, setRunningId] = useState<string | null>(null)

  const run = async (id: string) => {
    if (runningId) return
    setRunningId(id)
    await sleep(400)
    setRunningId(null)
  }

  return (
    <RecordGroup2Block
      labels={triggerLabels}
      onRun={run}
      runningId={runningId}
      triggers={recordTriggers}
    />
  )
}

const meta = {
  component: RecordTriggers,
  decorators: [
    (Story) => (
      <div className="w-105 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Group/RecordGroup2',
} satisfies Meta<typeof RecordTriggers>

export default meta

type Story = StoryObj<typeof meta>

export const RecordGroup2: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Commands on the record: each trigger (id, icon and label) renders as a button row in a plain group. The busy state is controlled by `runningId`, which sets `aria-busy` on that row while the consumer runs the command; `onRun` receives the trigger id.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      Array.from(
        canvasElement.querySelectorAll('[data-slot="record-group-link"]'),
        (row) => row.textContent,
      ),
    ).toEqual([
      'Gerar contrato',
      'Solicitar documentos',
      'Agendar consulta',
      'Criar contato',
      'Criar Lead',
    ])
    await expect(
      within(
        within(canvasElement).getByRole('region', { name: 'Ações' }),
      ).getByRole('button', { name: 'Gerar contrato' }),
    ).toBeVisible()
  },
}
