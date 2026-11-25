import {
  Agenda1,
  type Agenda1Entry,
  type Agenda1GroupBy,
  type Agenda1Kind,
  type Agenda1Mode,
  type Agenda1Period,
  type Agenda1Props,
  agenda1Window,
} from '@tc96/ui/blocks/data/agenda/agenda-1'
import { useEffect, useMemo, useState } from 'react'
import {
  agendaAnchor,
  agendaNow,
  agendaTimeZone,
  entries,
  entriesBetween,
  owners,
} from '../fixtures/agenda-1.ts'
import type { Agenda1Controls } from './agenda-1-controls.ts'

type Callbacks = Pick<
  Agenda1Props,
  | 'onAnchorChange'
  | 'onCancel'
  | 'onCollapsedGroupIdsChange'
  | 'onCreate'
  | 'onGroupByChange'
  | 'onKindFilterChange'
  | 'onModeChange'
  | 'onOpen'
  | 'onOwnerFilterChange'
  | 'onPeriodChange'
  | 'onReschedule'
>

export interface ComposedAgenda1Props extends Agenda1Controls, Callbacks {
  anchor?: string
}

export const ComposedAgenda1 = ({
  anchor: initialAnchor = agendaAnchor,
  cancelable,
  catalogsLoading,
  create,
  creatable,
  empty,
  filters,
  mode: modeControl,
  onAnchorChange,
  onCancel,
  onCollapsedGroupIdsChange,
  onCreate,
  onGroupByChange,
  onKindFilterChange,
  onModeChange,
  onOpen,
  onOwnerFilterChange,
  onPeriodChange,
  onReschedule,
  openable,
  period: periodControl,
  reschedulable,
  title,
  withOwners,
}: Readonly<ComposedAgenda1Props>) => {
  const [items, setItems] = useState<Agenda1Entry[]>(entries)
  const [mode, setMode] = useState<Agenda1Mode>(modeControl)
  const [period, setPeriod] = useState<Agenda1Period>(periodControl)
  const [anchor, setAnchor] = useState(initialAnchor)
  const [groupBy, setGroupBy] = useState<Agenda1GroupBy | null>('day')
  const [kindFilter, setKindFilter] = useState<Agenda1Kind[]>([])
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null)
  const [collapsedGroupIds, setCollapsedGroupIds] = useState<string[]>([])
  const labels = useMemo(() => ({ create, title }), [create, title])

  useEffect(() => {
    setMode(modeControl)
  }, [modeControl])

  useEffect(() => {
    setPeriod(periodControl)
  }, [periodControl])

  const periodWindow = agenda1Window(anchor, period, agendaTimeZone)
  const visible = empty
    ? []
    : entriesBetween(items, periodWindow.from, periodWindow.to).filter(
        (entry) =>
          (kindFilter.length === 0 || kindFilter.includes(entry.kind)) &&
          (!ownerFilter || entry.ownerId === ownerFilter),
      )

  return (
    <Agenda1
      anchor={anchor}
      collapsedGroupIds={collapsedGroupIds}
      entries={visible}
      filtered={kindFilter.length > 0 || Boolean(ownerFilter)}
      groupBy={groupBy}
      kindFilter={kindFilter}
      labels={labels}
      mode={mode}
      now={agendaNow}
      onAnchorChange={(next) => {
        setAnchor(next)
        onAnchorChange?.(next)
      }}
      onCancel={
        cancelable
          ? (entryId) => {
              setItems((current) =>
                current.filter((entry) => entry.id !== entryId),
              )
              onCancel?.(entryId)
            }
          : undefined
      }
      onCollapsedGroupIdsChange={(groupIds) => {
        setCollapsedGroupIds(groupIds)
        onCollapsedGroupIdsChange?.(groupIds)
      }}
      onCreate={creatable ? (...slot) => onCreate?.(...slot) : undefined}
      onGroupByChange={(next) => {
        setGroupBy(next)
        onGroupByChange?.(next)
      }}
      onKindFilterChange={
        filters
          ? (next) => {
              setKindFilter(next)
              onKindFilterChange?.(next)
            }
          : undefined
      }
      onModeChange={(next) => {
        setMode(next)
        onModeChange?.(next)
      }}
      onOpen={openable ? (entry) => onOpen?.(entry) : undefined}
      onOwnerFilterChange={(next) => {
        setOwnerFilter(next)
        onOwnerFilterChange?.(next)
      }}
      onPeriodChange={(next) => {
        setPeriod(next)
        onPeriodChange?.(next)
      }}
      onReschedule={
        reschedulable
          ? (change) => {
              setItems((current) =>
                current.map((entry) =>
                  entry.id === change.entry.id
                    ? {
                        ...entry,
                        allDay: change.allDay,
                        end: change.end,
                        start: change.start,
                      }
                    : entry,
                ),
              )
              onReschedule?.(change)
              return true
            }
          : undefined
      }
      ownerFilter={ownerFilter}
      owners={withOwners ? owners : undefined}
      ownersLoading={catalogsLoading}
      period={period}
      timeZone={agendaTimeZone}
    />
  )
}
