import type {
  DatePropertyLabels,
  PeoplePropertyLabels,
  PropertyOption,
  SelectPropertyLabels,
  TagsPropertyLabels,
} from '@tc96/ui/patterns/properties/core'
import type { PersonPropertyOption } from '@tc96/ui/patterns/properties/display/person/person-option-content'

export type RecordPreview3Person = PersonPropertyOption

export type RecordPreview3Status = 'canceled' | 'done' | 'in-progress' | 'todo'

export type RecordPreview3Priority = 'high' | 'low' | 'medium' | 'urgent'

export type RecordPreview3CatalogKey = 'priority' | 'status'

export type RecordPreview3Catalog = Readonly<
  Record<RecordPreview3CatalogKey, readonly PropertyOption[]>
>

export interface RecordPreview3CatalogLabels {
  priority: Record<RecordPreview3Priority, string>
  status: Record<RecordPreview3Status, string>
}

export interface RecordPreview3Record {
  assigneeIds: readonly string[]
  creatorId: string | null
  description?: string | null
  dueAt: string | null
  id: string
  kindId: string | null
  overdue?: boolean
  priority: string | null
  status: string
  tagIds: readonly string[]
  title: string
  updatedAt: string
}

export type RecordPreview3Changes = Partial<
  Pick<
    RecordPreview3Record,
    'assigneeIds' | 'dueAt' | 'kindId' | 'priority' | 'status' | 'tagIds'
  >
>

export type RecordPreview3Field =
  | 'assignees'
  | 'creator'
  | 'due'
  | 'id'
  | 'kind'
  | 'priority'
  | 'status'
  | 'tags'
  | 'updated'

export type RecordPreview3Group = 'properties' | 'record'

export interface RecordPreview3Labels {
  close: string
  copyId: string
  date: Partial<DatePropertyLabels>
  expand: string
  fields: Record<RecordPreview3Field, string>
  groups: Record<RecordPreview3Group, string>
  noCreator: string
  noKind: string
  noPriority: string
  peoplePicker: Partial<PeoplePropertyLabels>
  select: Partial<SelectPropertyLabels>
  tagPicker: Partial<TagsPropertyLabels>
  tagsPlaceholder: string
  unassigned: string
}

export type RecordPreview3LabelsOverride = Partial<
  Omit<RecordPreview3Labels, 'fields' | 'groups'>
> & {
  fields?: Partial<RecordPreview3Labels['fields']>
  groups?: Partial<RecordPreview3Labels['groups']>
}

export interface RecordPreview3Props {
  catalog?: RecordPreview3Catalog
  className?: string
  finalFocus?: () => HTMLElement | null
  kinds: readonly PropertyOption[]
  labels?: RecordPreview3LabelsOverride
  locale?: string
  onExpand?: () => void
  onOpenChange: (open: boolean) => void
  onRecordChange: (changes: RecordPreview3Changes) => void
  open: boolean
  people: readonly RecordPreview3Person[]
  record: RecordPreview3Record
  tags: readonly PropertyOption[]
  timeZone?: string
}
