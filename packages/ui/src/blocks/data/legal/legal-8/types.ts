import type {
  DataCollectionFormatProps,
  DataCollectionLoadLabels,
  DataCollectionLoadProps,
  DataCollectionSavedView,
  DataCollectionSavedViewLabels,
  DataCollectionSettingsToolbarLabels,
} from '../../shared/collection/types'

export type Legal8View = 'failures' | 'runs'

export type Legal8Sort = 'newest' | 'oldest'

export type Legal8RunKind = 'court-sweep' | 'lawsuit-import' | 'oab-lookup'

export type Legal8RunState = 'dead' | 'done' | 'failed' | 'queued' | 'running'

export type Legal8FailureKind =
  | 'capture_stopped'
  | 'oab_silent'
  | 'proposal_failed'

export type Legal8FailureOrigin = 'external' | 'registration' | 'system'

export type Legal8FailureState = 'open' | 'resolved'

export type Legal8SavedView = DataCollectionSavedView

export interface Legal8Run {
  error: string | null
  failureId: string | null
  finishedAt: string | null
  id: string
  kind: Legal8RunKind
  movements: number | null
  publications: number | null
  simulated?: boolean
  startedAt: string | null
  state: Legal8RunState
}

export interface Legal8Failure {
  id: string
  kind: Legal8FailureKind
  lastOccurredAt: string
  occurrences: number
  origin: Legal8FailureOrigin
  simulated?: boolean
  startedAt: string
  state: Legal8FailureState
}

export type Legal8RunColumnId =
  | 'error'
  | 'finishedAt'
  | 'kind'
  | 'movements'
  | 'publications'
  | 'startedAt'
  | 'state'

export type Legal8FailureColumnId =
  | 'kind'
  | 'lastOccurredAt'
  | 'occurrences'
  | 'origin'
  | 'startedAt'
  | 'state'

export interface Legal8Labels
  extends DataCollectionLoadLabels,
    DataCollectionSettingsToolbarLabels {
  allOrigins: string
  failureColumns: Record<Legal8FailureColumnId, string>
  failureKinds: Record<Legal8FailureKind, string>
  failureOrigins: Record<Legal8FailureOrigin, string>
  failureStates: Record<Legal8FailureState, string>
  failuresEmpty: string
  filters: string
  nextSweep: (when: string) => string
  noValue: string
  openFailure: string
  openFailureRow: (kind: string) => string
  origin: string
  retryNow: string
  runColumns: Record<Legal8RunColumnId, string>
  runFailed: string
  runKinds: Record<Legal8RunKind, string>
  runNow: string
  runStates: Record<Legal8RunState, string>
  runsEmpty: string
  savedViews: DataCollectionSavedViewLabels
  savePreference: string
  simulated: string
  sort: string
  sortBy: string
  sorts: Record<Legal8Sort, string>
  stopped: (day: string) => string
  upToDate: string
  viewCountName: (label: string, count: number) => string
  viewList: string
  views: Record<Legal8View, string>
}

type Legal8LabelGroup =
  | 'failureColumns'
  | 'failureKinds'
  | 'failureOrigins'
  | 'failureStates'
  | 'runColumns'
  | 'runKinds'
  | 'runStates'
  | 'savedViews'
  | 'sorts'
  | 'views'

export type Legal8LabelsOverride = Partial<
  Omit<Legal8Labels, Legal8LabelGroup>
> & {
  [TGroup in Legal8LabelGroup]?: Partial<Legal8Labels[TGroup]>
}

export interface Legal8Props
  extends DataCollectionFormatProps,
    DataCollectionLoadProps {
  className?: string
  counts?: Partial<Record<Legal8View, number>>
  failures: Legal8Failure[]
  labels?: Legal8LabelsOverride
  nextSweepAt?: string | null
  onOpenFailure?: (failureId: string) => void
  onOriginFilterChange?: (origin: Legal8FailureOrigin | null) => void
  onRun?: () => void
  onSavedViewCreate?: () => void
  onSavedViewDelete?: (savedViewId: string) => void
  onSavedViewDuplicate?: (savedViewId: string) => void
  onSavedViewRename?: (savedViewId: string) => void
  onSavedViewSelect?: (savedViewId: string) => void
  onSavedViewUpdate?: () => void
  onSavePreference?: () => void
  onSortChange?: (sort: Legal8Sort) => void
  onViewChange?: (view: Legal8View) => void
  originFilter?: Legal8FailureOrigin | null
  runError?: boolean
  running?: boolean
  runs: Legal8Run[]
  savedViewId?: string | null
  savedViewModified?: boolean
  savedViews?: Legal8SavedView[]
  savedViewsLoading?: boolean
  savedViewsPending?: boolean
  sort?: Legal8Sort
  stoppedSince?: string | null
  view?: Legal8View
}
