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

interface TaskPreviewProps {
  defaultOpen?: boolean
  onOpenPage?: () => void
}

export function TaskPreview({
  defaultOpen = true,
  onOpenPage,
}: Readonly<TaskPreviewProps>) {
  const [open, setOpen] = useState(defaultOpen)
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
            <Maximize2Icon aria-hidden="true" />
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
}
