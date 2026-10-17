import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  DateProperty,
  IconLabelProperty,
  PersonProperty,
  type PersonPropertyOption,
  RecordGroup,
  RecordGroupRow,
  RecordPreview,
  RecordPreviewAction,
  RecordPreviewBody,
  ScheduleProperty,
  type ScheduleValue,
  SelectProperty,
  type SelectPropertyOption,
  TagsProperty,
  type TagsPropertyOption,
  TextProperty,
} from '@tc96/parttens'
import { Button } from '@tc96/ui/button'
import { Maximize2Icon } from 'lucide-react'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import {
  priorityOptions,
  statusOptions,
  TIME_ZONE,
} from '../../../collection-views/fixtures/tasks'

const typeOptions: readonly SelectPropertyOption[] = [
  { label: 'Protocolo', value: 'filing' },
  { label: 'Audiência', value: 'hearing' },
  { label: 'Petição', value: 'petition' },
  { label: 'Análise', value: 'review' },
]

const tagOptions: readonly TagsPropertyOption[] = [
  { label: 'Prazo', value: 'deadline' },
  { label: 'Urgente', value: 'urgent' },
  { label: 'Cível', value: 'civil' },
  { label: 'Trabalhista', value: 'labor' },
]

const people: readonly PersonPropertyOption[] = [
  { fallback: 'JA', label: 'Jessica Alencar', value: 'jessica' },
  { fallback: 'G', label: 'Gabriel', value: 'gabriel' },
]

const recordDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  timeZone: TIME_ZONE,
  year: 'numeric',
})

const recordTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  hourCycle: 'h23',
  minute: '2-digit',
  timeZone: TIME_ZONE,
})

const dueDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
})

const formatDueDate = (iso: string) =>
  dueDateFormatter.format(new Date(iso)).replaceAll('.', '')

const formatRecordDate = (iso: string) => {
  const date = new Date(iso)
  return `${recordDateFormatter.format(date)}, ${recordTimeFormatter.format(date)}`
}

const withoutIcon = '[&_[data-slot=property-icon]]:hidden'

const record = {
  createdAt: '2026-09-27T09:00:00.000Z',
  createdBy: 'gabriel',
  id: 'seed_tasks_task_01',
  title: 'Protocolar recurso no TRT',
  updatedAt: '2026-10-14T02:34:00.000Z',
}

interface TaskPreviewArgs {
  onOpenPage: () => void
}

const meta = {
  args: { onOpenPage: fn() },
  parameters: {
    docs: {
      description: {
        component:
          'RecordPreview as the quick view of a task: three `RecordGroup` sections (Propriedades, Agenda and Registro) of `RecordGroupRow` fields, each with a `properties` value. Propriedades and Agenda are edited in place; Registro is read-only, with a copy action on the ID. The header carries the title and the Ampliar action.',
      },
    },
  },
  tags: ['!autodocs'],
  title: 'Patterns/Records/Preview/Usages/Tasks',
} satisfies Meta<TaskPreviewArgs>

export default meta

type Story = StoryObj<TaskPreviewArgs>

const findDialog = () =>
  screen.findByRole('dialog', { name: 'Protocolar recurso no TRT' })

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Opens on the task. Status moves to Concluída, the Urgente tag is removed, and Ampliar reports the click; the Registro values stay read-only.',
      },
    },
  },
  play: async ({ args }) => {
    const popup = await findDialog()
    const dialog = within(popup)

    for (const row of popup.querySelectorAll(
      '[data-slot="record-group-row"]',
    )) {
      await expect(row.getBoundingClientRect().height).toBe(32)
      await expect(getComputedStyle(row).paddingLeft).toBe('0px')
    }
    await expect(
      popup.querySelector('[data-slot="record-preview-body"]'),
    ).toBeVisible()
    await expect(
      popup.querySelector('[data-slot="record-group-row-label"] svg'),
    ).toBeNull()
    const iconRows = [...popup.querySelectorAll('[data-slot="property-icon"]')]
      .filter((icon) => getComputedStyle(icon).display !== 'none')
      .map(
        (icon) =>
          icon
            .closest('[data-slot="record-group-row"]')
            ?.querySelector('[data-slot="record-group-row-label"]')
            ?.textContent,
      )
    await expect(iconRows).toEqual(['Status', 'Prioridade'])

    for (const name of ['Propriedades', 'Agenda', 'Registro']) {
      await expect(dialog.getByRole('region', { name })).toBeVisible()
    }

    await userEvent.click(dialog.getByRole('combobox', { name: /^Status/ }))
    await userEvent.click(
      await screen.findByRole('option', { name: 'Concluída' }),
    )
    await waitFor(() =>
      expect(
        dialog.getByRole('combobox', { name: /^Status/ }),
      ).toHaveTextContent('Concluída'),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())

    await userEvent.click(
      dialog.getByRole('button', { name: 'Remover tag Urgente' }),
    )
    await waitFor(() =>
      expect(
        dialog.queryByRole('button', { name: 'Remover tag Urgente' }),
      ).toBeNull(),
    )

    await expect(
      dialog.getByRole('button', { name: 'Data: 14 de out · 01:30 – 01:45' }),
    ).toBeVisible()
    await expect(dialog.getByText('seed_tasks_task_01')).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: 'Copiar ID' }),
    ).toBeVisible()
    await expect(dialog.getByText('27/09/2026, 06:00')).toBeVisible()
    await expect(dialog.getByText('13/10/2026, 23:34')).toBeVisible()
    await expect(
      dialog.getByRole('button', { name: /^Prazo: 19 de set/ }),
    ).toHaveTextContent('19 de set')

    await userEvent.click(dialog.getByRole('button', { name: 'Ampliar' }))
    await expect(args.onOpenPage).toHaveBeenCalledTimes(1)
  },
  render: function Default({ onOpenPage }) {
    const [open, setOpen] = useState(true)
    const [status, setStatus] = useState<string | null>('in-progress')
    const [priority, setPriority] = useState<string | null>('urgent')
    const [type, setType] = useState<string | null>('filing')
    const [tags, setTags] = useState<readonly string[]>(['deadline', 'urgent'])
    const [assignee, setAssignee] = useState<string | null>('jessica')
    const [schedule, setSchedule] = useState<ScheduleValue>({
      allDay: false,
      endTime: '01:45',
      frequency: null,
      from: new Date(2026, 9, 14),
      reminders: [],
      startTime: '01:30',
      until: null,
    })
    const [due, setDue] = useState<string | null>('2026-09-19T12:00:00.000Z')

    return (
      <>
        <Button onClick={() => setOpen(true)} variant="outline">
          Abrir tarefa
        </Button>
        <RecordPreview
          actions={
            <RecordPreviewAction label="Ampliar" onClick={onOpenPage}>
              <Maximize2Icon aria-hidden />
            </RecordPreviewAction>
          }
          closeLabel="Fechar"
          onOpenChange={setOpen}
          open={open}
          title={record.title}
        >
          <RecordPreviewBody>
            <RecordGroup title="Propriedades">
              <RecordGroupRow label="Status">
                <SelectProperty
                  ariaLabel="Status"
                  onValueChange={setStatus}
                  options={statusOptions}
                  value={status}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Prioridade">
                <SelectProperty
                  ariaLabel="Prioridade"
                  onValueChange={setPriority}
                  options={priorityOptions}
                  value={priority}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Tipo">
                <SelectProperty
                  ariaLabel="Tipo"
                  onValueChange={setType}
                  options={typeOptions}
                  value={type}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Tags">
                <TagsProperty
                  ariaLabel="Tags"
                  onValueChange={setTags}
                  options={tagOptions}
                  value={tags}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Responsável">
                <PersonProperty
                  ariaLabel="Responsável"
                  onValueChange={setAssignee}
                  options={people}
                  value={assignee}
                />
              </RecordGroupRow>
            </RecordGroup>
            <RecordGroup title="Agenda">
              <RecordGroupRow label="Data">
                <ScheduleProperty
                  ariaLabel="Data"
                  className={withoutIcon}
                  onValueChange={setSchedule}
                  today={new Date(2026, 9, 14)}
                  value={schedule}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Prazo">
                <DateProperty
                  allowClear={false}
                  ariaLabel="Prazo"
                  className={withoutIcon}
                  displayLabel={due ? formatDueDate(due) : undefined}
                  locale="pt-BR"
                  onValueChange={setDue}
                  value={due}
                />
              </RecordGroupRow>
            </RecordGroup>
            <RecordGroup title="Registro">
              <RecordGroupRow label="ID">
                <TextProperty
                  ariaLabel="ID"
                  copyLabel="Copiar ID"
                  value={record.id}
                  variant="plain"
                />
              </RecordGroupRow>
              <RecordGroupRow label="Criado em">
                <IconLabelProperty
                  label={formatRecordDate(record.createdAt)}
                  variant="plain"
                />
              </RecordGroupRow>
              <RecordGroupRow label="Atualizado em">
                <IconLabelProperty
                  label={formatRecordDate(record.updatedAt)}
                  variant="plain"
                />
              </RecordGroupRow>
              <RecordGroupRow label="Criado por">
                <PersonProperty
                  ariaLabel="Criado por"
                  options={people}
                  readOnly
                  value={record.createdBy}
                  variant="plain"
                />
              </RecordGroupRow>
            </RecordGroup>
          </RecordPreviewBody>
        </RecordPreview>
      </>
    )
  },
}
