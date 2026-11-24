import type { DragEndEvent, DragStartEvent } from '@dnd-kit/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  parseCalendarRecordDragId,
  resolveCalendarDrop,
} from '../lib/drag-and-drop'
import type { CalendarRecordReschedule, CalendarRecordSchedule } from '../types'

interface UseCalendarDragAndDropOptions<TRecord> {
  getRecordSchedule: (record: TRecord) => CalendarRecordSchedule | null
  getKey: (record: TRecord) => string | number
  records: readonly TRecord[]
  onRecordReschedule?: (
    change: CalendarRecordReschedule<TRecord>,
  ) => boolean | Promise<boolean>
  snapMinutes: number
  timeZone: string
}

interface PendingReschedule {
  accepted: boolean
  recordKey: string
  requestId: number
  schedule: CalendarRecordSchedule
}

/**
 * Reagendamento otimista sem índices: um mapa de overrides por item substitui a
 * janela do prop até o dado confirmado chegar — rollback é só remover a
 * entrada. Mesmo fluxo de `suspend()`/settle do kanban.
 */
export function useCalendarDragAndDrop<TRecord>({
  getRecordSchedule,
  getKey,
  records,
  onRecordReschedule,
  snapMinutes,
  timeZone,
}: UseCalendarDragAndDropOptions<TRecord>) {
  const [overrides, setOverrides] = useState<
    ReadonlyMap<string, CalendarRecordSchedule>
  >(new Map())
  const [previews, setPreviews] = useState<
    ReadonlyMap<string, CalendarRecordSchedule>
  >(new Map())
  const [focusRecordDragId, setFocusRecordDragId] = useState<string | null>(
    null,
  )
  const recordsRef = useRef(records)
  const overridesRef = useRef(overrides)
  const pendingRef = useRef<PendingReschedule | null>(null)
  const requestIdRef = useRef(0)
  recordsRef.current = records
  overridesRef.current = overrides

  const resolveSchedule = useCallback(
    (record: TRecord): CalendarRecordSchedule | null =>
      previews.get(String(getKey(record))) ??
      overrides.get(String(getKey(record))) ??
      getRecordSchedule(record),
    [getRecordSchedule, getKey, overrides, previews],
  )

  const removeOverride = useCallback((recordKey: string) => {
    setOverrides((current) => {
      if (!current.has(recordKey)) return current
      const next = new Map(current)
      next.delete(recordKey)
      return next
    })
  }, [])

  // Confirmação: quando a janela vinda do prop passa a bater com o override
  // pendente aceito, o override cumpriu o papel e sai.
  useEffect(() => {
    const pending = pendingRef.current
    if (!pending?.accepted) return

    const record = records.find(
      (candidate) => String(getKey(candidate)) === pending.recordKey,
    )
    if (!record) return
    if (!schedulesMatch(getRecordSchedule(record), pending.schedule)) return

    pendingRef.current = null
    removeOverride(pending.recordKey)
  }, [getRecordSchedule, getKey, records, removeOverride])

  const handleDragStart = useCallback((_event: DragStartEvent) => {
    setFocusRecordDragId(null)
  }, [])
  const handleRecordFocusRestored = useCallback(
    () => setFocusRecordDragId(null),
    [],
  )

  const commitReschedule = useCallback(
    (
      record: TRecord,
      recordKey: string,
      schedule: CalendarRecordSchedule,
      nextSchedule: CalendarRecordSchedule,
      suspend?: () => { abort: () => void; resume: () => void },
    ) => {
      if (!onRecordReschedule) return

      const change: CalendarRecordReschedule<TRecord> = {
        end: nextSchedule.end,
        isAllDay: nextSchedule.isAllDay,
        record,
        recordKey,
        sourceEnd: schedule.end,
        sourceStart: schedule.start,
        start: nextSchedule.start,
      }

      setOverrides((current) => new Map(current).set(recordKey, nextSchedule))
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId
      pendingRef.current = {
        accepted: false,
        recordKey,
        requestId,
        schedule: nextSchedule,
      }
      const suspension = suspend?.()

      const settle = (accepted: boolean, settleSuspension: boolean) => {
        const pending = pendingRef.current
        if (!pending || pending.requestId !== requestId) return

        if (!accepted) {
          pendingRef.current = null
          if (settleSuspension) suspension?.abort()
          removeOverride(recordKey)
          return
        }

        pending.accepted = true
        if (settleSuspension) suspension?.resume()
      }

      try {
        const accepted = onRecordReschedule(change)

        if (isPromiseLike(accepted)) {
          // Segurar a operação suspensa através da latência de rede manteria o
          // feedback de arraste vivo depois do pointer-up. O drop nativo
          // termina agora; o override acima cuida só da reconciliação.
          suspension?.resume()
          void Promise.resolve(accepted).then(
            (value) => settle(value, false),
            () => settle(false, false),
          )
        } else {
          settle(accepted, true)
        }
      } catch {
        settle(false, true)
      }
    },
    [onRecordReschedule, removeOverride],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (event.canceled || !onRecordReschedule) return

      const source = event.operation.source
      const parsed = source ? parseCalendarRecordDragId(source.id) : null
      if (!parsed) return

      const record = recordsRef.current.find(
        (candidate) => String(getKey(candidate)) === parsed.recordKey,
      )
      if (!record) return

      // Parte da janela visível: com um reagendamento ainda pendente, o prop
      // segue com o valor antigo e o override é o que a pessoa está vendo.
      const schedule =
        overridesRef.current.get(parsed.recordKey) ?? getRecordSchedule(record)
      if (!schedule) return

      const next = resolveCalendarDrop(event, schedule, timeZone, snapMinutes)
      if (!next || schedulesMatch(schedule, { ...schedule, ...next })) return

      const nextSchedule: CalendarRecordSchedule = {
        ...next,
        isAllDay: schedule.isAllDay,
      }

      setFocusRecordDragId(String(source?.id))
      commitReschedule(record, parsed.recordKey, schedule, nextSchedule, () =>
        event.suspend(),
      )
    },
    [
      commitReschedule,
      getRecordSchedule,
      getKey,
      onRecordReschedule,
      snapMinutes,
      timeZone,
    ],
  )

  const previewSchedule = useCallback(
    (recordKey: string, schedule: CalendarRecordSchedule | null) => {
      setPreviews((current) => {
        if (!schedule && !current.has(recordKey)) return current
        const next = new Map(current)
        if (schedule) next.set(recordKey, schedule)
        else next.delete(recordKey)
        return next
      })
    },
    [],
  )

  const resizeRecord = useCallback(
    (recordKey: string, nextSchedule: CalendarRecordSchedule) => {
      previewSchedule(recordKey, null)
      const record = recordsRef.current.find(
        (candidate) => String(getKey(candidate)) === recordKey,
      )
      if (!record) return

      const schedule =
        overridesRef.current.get(recordKey) ?? getRecordSchedule(record)
      if (!schedule || schedulesMatch(schedule, nextSchedule)) return

      commitReschedule(record, recordKey, schedule, nextSchedule)
    },
    [commitReschedule, getRecordSchedule, getKey, previewSchedule],
  )

  return {
    dragEnabled: Boolean(onRecordReschedule),
    focusRecordDragId,
    handleDragEnd,
    handleDragStart,
    handleRecordFocusRestored,
    previewSchedule,
    resizeRecord,
    resolveSchedule,
  }
}

function schedulesMatch(
  left: CalendarRecordSchedule | null,
  right: CalendarRecordSchedule,
): boolean {
  if (!left) return false

  return (
    left.start.getTime() === right.start.getTime() &&
    (left.end?.getTime() ?? null) === (right.end?.getTime() ?? null) &&
    left.isAllDay === right.isAllDay
  )
}

function isPromiseLike(
  value: boolean | Promise<boolean>,
): value is Promise<boolean> {
  return typeof value === 'object' && value !== null && 'then' in value
}
