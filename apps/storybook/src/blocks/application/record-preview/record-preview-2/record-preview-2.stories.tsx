import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createRecordPreview2Catalog,
  RecordPreview2 as RecordPreview2Block,
} from '@tc96/ui/blocks/application/record-preview/record-preview-2'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  TASK_TIME_ZONE,
  taskCatalogLabels,
  taskPeople,
  taskPreviewLabels,
  taskRecord,
  taskToday,
} from '../fixtures/record-preview.ts'

const taskCatalog = createRecordPreview2Catalog(taskCatalogLabels)

function TaskPreview() {
  const [open, setOpen] = useState(true)
  const [task, setTask] = useState(taskRecord)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Abrir tarefa
      </Button>
      <RecordPreview2Block
        catalog={taskCatalog}
        labels={taskPreviewLabels}
        locale="pt-BR"
        onExpand={() => undefined}
        onOpenChange={setOpen}
        onRecordChange={(changes) =>
          setTask((current) => ({ ...current, ...changes }))
        }
        open={open}
        people={taskPeople}
        record={task}
        timeZone={TASK_TIME_ZONE}
        today={taskToday}
      />
    </>
  )
}

const meta = {
  component: TaskPreview,
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Preview/RecordPreview2',
} satisfies Meta<typeof TaskPreview>

export default meta

type Story = StoryObj<typeof meta>

export const RecordPreview2: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The quick view of a task in a right-side sheet, with `record.description` under the title: Propriedades (Status, Prioridade, Tipo, Tags and Responsável) and Agenda (Data and Prazo) are edited in place with every property in its `plain` variant (no badge surface), and Registro stays read-only (the ID with a copy action, the dates and the author). Each section collapses, and the label sits on the first line of a value that wraps, as the four tags do. Status, Prioridade, Tipo and Tags take their options from the catalog the block exports (`createRecordPreview2Catalog`); the date rows hide the icon of their value.',
      },
    },
  },
  play: async () => {
    const popup = await screen.findByRole('dialog', {
      name: 'Protocolar recurso no TRT',
    })
    const dialog = within(popup)

    await expect(popup).toHaveAccessibleDescription(
      'Recurso ordinário contra a sentença da 2ª Vara do Trabalho.',
    )

    await waitFor(() =>
      expect(
        popup.querySelector('[data-slot="record-preview-body"]'),
      ).toBeVisible(),
    )
    for (const name of ['Propriedades', 'Agenda', 'Registro']) {
      await expect(dialog.getByRole('region', { name })).toBeVisible()
    }
    await expect(dialog.getByRole('button', { name: 'Ampliar' })).toBeVisible()
    await expect(dialog.getByText('seed_tasks_task_01')).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: 'Copiar ID' }),
    ).toBeVisible()
    await expect(dialog.getByText('27/09/2026, 06:00')).toBeVisible()
    await expect(dialog.getByText('13/10/2026, 23:34')).toBeVisible()

    const registro = dialog.getByRole('button', { name: 'Registro' })
    await userEvent.click(registro)
    await expect(registro).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(registro)
    await expect(registro).toHaveAttribute('aria-expanded', 'true')
  },
}
