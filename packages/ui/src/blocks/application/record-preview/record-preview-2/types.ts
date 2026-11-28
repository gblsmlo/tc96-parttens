import type {
  DatePropertyLabels,
  PropertyOption,
  SchedulePropertyLabels,
  ScheduleValue,
  SelectPropertyLabels,
  TagsPropertyLabels,
} from '@tc96/ui/patterns/properties/core'
import type { PersonPropertyOption } from '@tc96/ui/patterns/properties/display/person/person-option-content'

export type RecordPreview2Person = PersonPropertyOption

export type RecordPreview2CatalogKey = 'priority' | 'status' | 'tags' | 'type'

export type RecordPreview2Catalog = Readonly<
  Record<RecordPreview2CatalogKey, readonly PropertyOption[]>
>

export interface RecordPreview2CatalogLabels {
  priority: Record<'high' | 'low' | 'medium' | 'urgent', string>
  status: Record<
    'backlog' | 'done' | 'in-progress' | 'in-review' | 'todo',
    string
  >
  tags: Record<'civil' | 'deadline' | 'labor' | 'urgent', string>
  type: Record<'filing' | 'hearing' | 'petition' | 'review', string>
}

export interface RecordPreview2Record {
  assignee: string | null
  createdAt: string
  createdBy: string | null
  description?: string | null
  due: string | null
  id: string
  priority: string | null
  schedule: ScheduleValue
  status: string | null
  tags: readonly string[]
  title: string
  type: string | null
  updatedAt: string
}

export type RecordPreview2Changes = Partial<
  Pick<
    RecordPreview2Record,
    'assignee' | 'due' | 'priority' | 'schedule' | 'status' | 'tags' | 'type'
  >
>

export type RecordPreview2Field =
  | 'assignee'
  | 'createdAt'
  | 'createdBy'
  | 'due'
  | 'id'
  | 'priority'
  | 'schedule'
  | 'status'
  | 'tags'
  | 'type'
  | 'updatedAt'

export type RecordPreview2Group = 'properties' | 'record' | 'schedule'

export interface RecordPreview2Labels {
  close: string
  copyId: string
  date: Partial<DatePropertyLabels>
  expand: string
  fields: Record<RecordPreview2Field, string>
  groups: Record<RecordPreview2Group, string>
  noAssignee: string
  noCreator: string
  schedule: Partial<SchedulePropertyLabels>
  select: Partial<SelectPropertyLabels>
  tagPicker: Partial<TagsPropertyLabels>
  tagsPlaceholder: string
}

export type RecordPreview2LabelsOverride = Partial<
  Omit<RecordPreview2Labels, 'fields' | 'groups'>
> & {
  fields?: Partial<RecordPreview2Labels['fields']>
  groups?: Partial<RecordPreview2Labels['groups']>
}

export interface RecordPreview2Props {
  catalog?: RecordPreview2Catalog
  className?: string
  finalFocus?: () => HTMLElement | null
  labels?: RecordPreview2LabelsOverride
  locale?: string
  onExpand?: () => void
  onOpenChange: (open: boolean) => void
  onRecordChange: (changes: RecordPreview2Changes) => void
  open: boolean
  people: readonly RecordPreview2Person[]
  record: RecordPreview2Record
  timeZone?: string
  today?: Date
}
