import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  createRecordPreview3Catalog,
  RecordPreview3 as RecordPreview3Block,
} from '@tc96/ui/blocks/application/record-preview/record-preview-3'
import { Button } from '@tc96/ui/button'
import { useState } from 'react'
import { expect, screen, waitFor, within } from 'storybook/test'
import {
  TASKS_TIME_ZONE,
  tasksCatalogLabels,
  tasksKinds,
  tasksPeople,
  tasksPreviewLabels,
  tasksRecord,
  tasksTags,
} from '../fixtures/record-preview-3.ts'

const tasksCatalog = createRecordPreview3Catalog(tasksCatalogLabels)

function TaskRowPreview() {
  const [open, setOpen] = useState(true)
  const [task, setTask] = useState(tasksRecord)

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Abrir tarefa
      </Button>
      <RecordPreview3Block
        catalog={tasksCatalog}
        kinds={tasksKinds}
        labels={tasksPreviewLabels}
        locale="pt-BR"
        onExpand={() => undefined}
        onOpenChange={setOpen}
        onRecordChange={(changes) =>
          setTask((current) => ({ ...current, ...changes }))
        }
        open={open}
        people={tasksPeople}
        record={task}
        tags={tasksTags}
        timeZone={TASKS_TIME_ZONE}
      />
    </>
  )
}

const meta = {
  component: TaskRowPreview,
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Preview/RecordPreview3',
} satisfies Meta<typeof TaskRowPreview>

export default meta

type Story = StoryObj<typeof meta>

export const RecordPreview3: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The quick view of a row of the task collection blocks (`Blocks/Data/Tasks`), with `record.description` under the title: the record has the shape of their task (status, priority, project, assignees, tags, due date with overdue, updated and author). Propriedades is edited in place; Registro holds plain read-only properties. Status and Prioridade come from the catalog the block exports (`createRecordPreview3Catalog`); the projects, tags and people are the app data, passed as props.',
      },
    },
  },
  play: async () => {
    const popup = await screen.findByRole('dialog', {
      name: 'Revisar minuta do contrato social da Padaria Trigo Bom',
    })
    const dialog = within(popup)

    await expect(popup).toHaveAccessibleDescription(
      'Conferir as cláusulas de administração e de quotas antes da assinatura.',
    )

    await waitFor(() =>
      expect(
        popup.querySelector('[data-slot="record-preview-body"]'),
      ).toBeVisible(),
    )
    for (const name of ['Propriedades', 'Registro']) {
      await expect(dialog.getByRole('region', { name })).toBeVisible()
    }
    await expect(
      dialog.getByRole('combobox', { name: /Status: Em andamento/ }),
    ).toBeVisible()
    await expect(dialog.getByText('task_2026_0142')).toBeVisible()
    await expect(dialog.getByText('27/11/2026, 15:05')).toBeVisible()
  },
}
