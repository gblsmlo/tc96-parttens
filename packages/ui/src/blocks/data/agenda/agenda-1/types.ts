import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionModeLabels,
  DataCollectionPerson,
  DataCollectionSettingsToolbarLabels,
} from '../../shared/collection/types'

export type Agenda1Mode = 'calendar' | 'list' | 'table'

export type Agenda1Period = 'day' | 'month' | 'week'

export type Agenda1Kind = 'appointment' | 'deadline' | 'due' | 'task'

export type Agenda1Modality = 'in-person' | 'phone' | 'video'

export type Agenda1GroupBy = 'day' | 'kind'

export type Agenda1Person = DataCollectionPerson

export interface Agenda1Entry {
  allDay: boolean
  caption?: string | null
  completed?: boolean
  end: string | null
  id: string
  kind: Agenda1Kind
  location?: string | null
  modality?: Agenda1Modality | null
  ownerId?: string | null
  start: string
  title: string
}

export interface Agenda1Slot {
  end: string
  start: string
}

export interface Agenda1Reschedule {
  allDay: boolean
  end: string | null
  entry: Agenda1Entry
  start: string
}

export interface Agenda1Window {
  from: string
  to: string
}

export type Agenda1ColumnId =
  | 'actions'
  | 'kind'
  | 'location'
  | 'modality'
  | 'owner'
  | 'title'
  | 'when'

export interface Agenda1Labels
  extends DataCollectionLoadLabels,
    DataCollectionSettingsToolbarLabels {
  allDay: string
  allKinds: string
  allOwners: string
  cancel: string
  cancelEntry: (title: string) => string
  columns: Record<Agenda1ColumnId, string>
  completed: string
  create: string
  empty: string
  emptyGroup: string
  entryName: (kind: string, title: string) => string
  filters: string
  group: string
  groupBy: string
  groupings: Record<Agenda1GroupBy, string>
  groupToggle: (group: string, collapsed: boolean) => string
  kind: string
  kinds: Record<Agenda1Kind, string>
  modalities: Record<Agenda1Modality, string>
  modes: DataCollectionModeLabels
  next: string
  noGrouping: string
  noResult: string
  openEntry: (title: string) => string
  owner: string
  period: string
  periods: Record<Agenda1Period, string>
  previous: string
  savePreference: string
  today: string
  unassigned: string
}

type Agenda1LabelGroup =
  | 'columns'
  | 'groupings'
  | 'kinds'
  | 'modalities'
  | 'modes'
  | 'periods'

export type Agenda1LabelsOverride = Partial<
  Omit<Agenda1Labels, Agenda1LabelGroup>
> & {
  [TGroup in Agenda1LabelGroup]?: Partial<Agenda1Labels[TGroup]>
}

export interface Agenda1Props
  extends DataCollectionLoadProps,
    DataCollectionFormatProps {
  anchor?: string
  className?: string
  collapsedGroupIds?: string[]
  entries: Agenda1Entry[]
  filtered?: boolean
  groupBy?: Agenda1GroupBy | null
  kindFilter?: Agenda1Kind[]
  labels?: Agenda1LabelsOverride
  mode?: Agenda1Mode
  now?: string
  onAnchorChange?: (anchor: string) => void
  onCancel?: (entryId: string) => void
  onCollapsedGroupIdsChange?: (groupIds: string[]) => void
  onCreate?: (slot?: Agenda1Slot) => void
  onGroupByChange?: (groupBy: Agenda1GroupBy | null) => void
  onKindFilterChange?: (kinds: Agenda1Kind[]) => void
  onModeChange?: (mode: Agenda1Mode) => void
  onOpen?: (entry: Agenda1Entry) => void
  onOwnerFilterChange?: (ownerId: string | null) => void
  onPeriodChange?: (period: Agenda1Period) => void
  onReschedule?: (change: Agenda1Reschedule) => boolean | Promise<boolean>
  onSavePreference?: () => void
  ownerFilter?: string | null
  owners?: Agenda1Person[]
  ownersLoading?: boolean
  period?: Agenda1Period
  weekStartsOn?: 0 | 1
}
