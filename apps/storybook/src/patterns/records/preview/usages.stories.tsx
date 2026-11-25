import { ArrowsOutSimpleIcon } from '@phosphor-icons/react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@tc96/ui/button'
import {
  DateProperty,
  IconLabelProperty,
  PersonProperty,
  type PersonPropertyOption,
  type PropertyOption,
  RecordGroup,
  RecordGroupRow,
  RecordPreview,
  RecordPreviewAction,
  RecordPreviewBody,
  ScheduleProperty,
  type ScheduleValue,
  SelectProperty,
  TagsProperty,
  TextProperty,
} from '@tc96/ui/patterns'
import { useState } from 'react'
import { expect, screen, waitFor, within } from 'storybook/test'
import {
  priorityOptions,
  statusOptions,
  TIME_ZONE,
} from '../../collection/fixtures/tasks'
import { ptBRPropertyLabels } from '../../properties/properties-labels.ts'

const typeOptions: readonly PropertyOption[] = [
  { label: 'Protocolo', value: 'filing' },
  { label: 'Audiência', value: 'hearing' },
  { label: 'Petição', value: 'petition' },
  { label: 'Análise', value: 'review' },
]

const tagOptions: readonly PropertyOption[] = [
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

const openPage = () => undefined

const meta = {
  tags: ['!autodocs'],
  title: 'Patterns/Records/Preview/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Tasks: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The quick view of a task: three `RecordGroup` sections (Propriedades, Agenda and Registro) of `RecordGroupRow` fields, each with a `properties` value, stacked by `RecordPreviewBody`. Propriedades and Agenda are edited in place; Registro is read-only, with a copy action on the ID. The header carries the title and the Ampliar action. The date rows hide the icon of their property, so only Status and Prioridade keep theirs.',
      },
    },
  },
  play: async () => {
    const popup = await screen.findByRole('dialog', {
      name: 'Protocolar recurso no TRT',
    })
    const dialog = within(popup)

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
  },
  render: function Tasks() {
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
            <RecordPreviewAction label="Ampliar" onClick={openPage}>
              <ArrowsOutSimpleIcon aria-hidden />
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
                  placeholder="Adicionar uma tag"
                  ariaLabel="Tags"
                  onValueChange={setTags}
                  options={tagOptions}
                  value={tags}
                  labels={ptBRPropertyLabels.tags}
                />
              </RecordGroupRow>
              <RecordGroupRow label="Responsável">
                <PersonProperty
                  placeholder="Sem responsável"
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
                  locale="pt-BR"
                  ariaLabel="Data"
                  className={withoutIcon}
                  onValueChange={setSchedule}
                  today={new Date(2026, 9, 14)}
                  value={schedule}
                  labels={ptBRPropertyLabels.schedule}
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
                  labels={ptBRPropertyLabels.date}
                />
              </RecordGroupRow>
            </RecordGroup>
            <RecordGroup title="Registro">
              <RecordGroupRow label="ID">
                <TextProperty
                  ariaLabel="ID"
                  value={record.id}
                  variant="plain"
                  copyable
                  labels={{ ...ptBRPropertyLabels.text, copy: 'Copiar ID' }}
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
                  placeholder="Sem responsável"
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
