import {
  DateProperty,
  PersonProperty,
  type PersonPropertyOption,
  RecordGroup,
  RecordGroupRow,
  SelectProperty,
  type SelectPropertyOption,
  TagsProperty,
  type TagsPropertyOption,
  TextProperty,
} from '@tc96/parttens'
import {
  CalendarDaysIcon,
  CircleCheckIcon,
  CircleDotIcon,
  CirclePauseIcon,
  HashIcon,
  ShapesIcon,
  TagIcon,
  UserIcon,
} from 'lucide-react'
import { useState } from 'react'

export const statusOptions: SelectPropertyOption[] = [
  {
    icon: CircleDotIcon,
    label: 'In progress',
    tone: 'info',
    value: 'progress',
  },
  { icon: CirclePauseIcon, label: 'On hold', tone: 'warning', value: 'hold' },
  { icon: CircleCheckIcon, label: 'Done', tone: 'success', value: 'done' },
]

const assigneeOptions: PersonPropertyOption[] = [
  { label: 'Mariana Souza', value: 'mariana' },
  { label: 'Daniel Costa', value: 'daniel' },
]

const labelOptions: TagsPropertyOption[] = [
  { label: 'Compliance', value: 'compliance' },
  { label: 'Customer', value: 'customer' },
  { label: 'Urgent', value: 'urgent' },
]

export function PropertiesGroup({
  align = 'start',
  editable = false,
}: Readonly<{ align?: 'between' | 'start'; editable?: boolean }>) {
  const [title, setTitle] = useState<string | null>('Quarterly access review')
  const [status, setStatus] = useState<string | null>('progress')
  const [assignee, setAssignee] = useState<string | null>('mariana')
  const [labels, setLabels] = useState<readonly string[]>(['compliance'])
  const [due, setDue] = useState<string | null>('2026-10-21T12:00:00.000Z')
  const readOnly = !editable
  const look = editable ? undefined : 'plain'

  return (
    <RecordGroup title="Properties">
      <RecordGroupRow
        align={align}
        label="Title"
        leading={<HashIcon aria-hidden />}
      >
        <TextProperty
          ariaLabel="Title"
          {...(editable ? { editing: 'inline' as const } : {})}
          onCommit={setTitle}
          value={title}
          variant={look}
        />
      </RecordGroupRow>
      <RecordGroupRow
        align={align}
        label="Status"
        leading={<ShapesIcon aria-hidden />}
      >
        <SelectProperty
          ariaLabel="Status"
          onValueChange={setStatus}
          options={statusOptions}
          readOnly={readOnly}
          value={status}
          variant={look}
        />
      </RecordGroupRow>
      <RecordGroupRow
        align={align}
        label="Assignee"
        leading={<UserIcon aria-hidden />}
      >
        <PersonProperty
          ariaLabel="Assignee"
          onValueChange={setAssignee}
          options={assigneeOptions}
          readOnly={readOnly}
          value={assignee}
          variant={look}
        />
      </RecordGroupRow>
      <RecordGroupRow
        align={align}
        label="Labels"
        leading={<TagIcon aria-hidden />}
      >
        <TagsProperty
          ariaLabel="Labels"
          onValueChange={setLabels}
          options={labelOptions}
          readOnly={readOnly}
          value={labels}
          variant={look}
        />
      </RecordGroupRow>
      <RecordGroupRow
        align={align}
        label="Due"
        leading={<CalendarDaysIcon aria-hidden />}
      >
        <DateProperty
          ariaLabel="Due date"
          locale="en-US"
          onValueChange={setDue}
          readOnly={readOnly}
          timeZone="UTC"
          value={due}
          variant={look}
        />
      </RecordGroupRow>
    </RecordGroup>
  )
}
