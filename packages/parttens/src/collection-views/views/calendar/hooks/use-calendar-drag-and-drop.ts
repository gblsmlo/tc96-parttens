import type { DragEndEvent, DragStartEvent } from '@dnd-kit/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  parseCalendarItemDragId,
  resolveCalendarDrop,
} from '../lib/drag-and-drop'
import type { CalendarItemReschedule, CalendarItemSchedule } from '../types'

interface UseCalendarDragAndDropOptions<TItem> {
  getItemSchedule: (item: TItem) => CalendarItemSchedule | null
  getKey: (item: TItem) => string | number
  items: readonly TItem[]
  onItemReschedule?: (
    change: CalendarItemReschedule<TItem>,
  ) => boolean | Promise<boolean>
  snapMinutes: number
  timeZone: string
}

interface PendingReschedule {
  accepted: boolean
  itemKey: string
  requestId: number
  schedule: CalendarItemSchedule
}

/**
 * Reagendamento otimista sem índices: um mapa de overrides por item substitui a
 * janela do prop até o dado confirmado chegar — rollback é só remover a
 * entrada. Mesmo fluxo de `suspend()`/settle do kanban.
 */
export function useCalendarDragAndDrop<TItem>({
  getItemSchedule,
  getKey,
  items,
  onItemReschedule,
  snapMinutes,
  timeZone,
}: UseCalendarDragAndDropOptions<TItem>) {
  const [overrides, setOverrides] = useState<
    ReadonlyMap<string, CalendarItemSchedule>
  >(new Map())
  const [focusItemDragId, setFocusItemDragId] = useState<string | null>(null)
  const itemsRef = useRef(items)
  const overridesRef = useRef(overrides)
  const pendingRef = useRef<PendingReschedule | null>(null)
  const requestIdRef = useRef(0)
  itemsRef.current = items
  overridesRef.current = overrides

  const resolveSchedule = useCallback(
    (item: TItem): CalendarItemSchedule | null =>
      overrides.get(String(getKey(item))) ?? getItemSchedule(item),
    [getItemSchedule, getKey, overrides],
  )

  const removeOverride = useCallback((itemKey: string) => {
    setOverrides((current) => {
      if (!current.has(itemKey)) return current
      const next = new Map(current)
      next.delete(itemKey)
      return next
    })
  }, [])

  // Confirmação: quando a janela vinda do prop passa a bater com o override
  // pendente aceito, o override cumpriu o papel e sai.
  useEffect(() => {
    const pending = pendingRef.current
    if (!pending?.accepted) return

    const item = items.find(
      (candidate) => String(getKey(candidate)) === pending.itemKey,
    )
    if (!item) return
    if (!schedulesMatch(getItemSchedule(item), pending.schedule)) return

    pendingRef.current = null
    removeOverride(pending.itemKey)
  }, [getItemSchedule, getKey, items, removeOverride])

  const handleDragStart = useCallback((_event: DragStartEvent) => {
    setFocusItemDragId(null)
  }, [])
  const handleItemFocusRestored = useCallback(
    () => setFocusItemDragId(null),
    [],
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (event.canceled || !onItemReschedule) return

      const source = event.operation.source
      const parsed = source ? parseCalendarItemDragId(source.id) : null
      if (!parsed) return

      const item = itemsRef.current.find(
        (candidate) => String(getKey(candidate)) === parsed.itemKey,
      )
      if (!item) return

      // Parte da janela visível: com um reagendamento ainda pendente, o prop
      // segue com o valor antigo e o override é o que a pessoa está vendo.
      const schedule =
        overridesRef.current.get(parsed.itemKey) ?? getItemSchedule(item)
      if (!schedule) return

      const next = resolveCalendarDrop(event, schedule, timeZone, snapMinutes)
      if (!next || schedulesMatch(schedule, { ...schedule, ...next })) return

      const nextSchedule: CalendarItemSchedule = {
        ...next,
        isAllDay: schedule.isAllDay,
      }
      const change: CalendarItemReschedule<TItem> = {
        end: next.end,
        isAllDay: schedule.isAllDay,
        item,
        itemKey: parsed.itemKey,
        sourceEnd: schedule.end,
        sourceStart: schedule.start,
        start: next.start,
      }

      setFocusItemDragId(String(source?.id))
      setOverrides((current) =>
        new Map(current).set(parsed.itemKey, nextSchedule),
      )
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId
      pendingRef.current = {
        accepted: false,
        itemKey: parsed.itemKey,
        requestId,
        schedule: nextSchedule,
      }
      const suspension = event.suspend()

      const settle = (accepted: boolean, settleSuspension: boolean) => {
        const pending = pendingRef.current
        if (!pending || pending.requestId !== requestId) return

        if (!accepted) {
          pendingRef.current = null
          if (settleSuspension) suspension.abort()
          removeOverride(parsed.itemKey)
          return
        }

        pending.accepted = true
        if (settleSuspension) suspension.resume()
      }

      try {
        const accepted = onItemReschedule(change)

        if (isPromiseLike(accepted)) {
          // Segurar a operação suspensa através da latência de rede manteria o
          // feedback de arraste vivo depois do pointer-up. O drop nativo
          // termina agora; o override acima cuida só da reconciliação.
          suspension.resume()
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
    [
      getItemSchedule,
      getKey,
      onItemReschedule,
      removeOverride,
      snapMinutes,
      timeZone,
    ],
  )

  return {
    dragEnabled: Boolean(onItemReschedule),
    focusItemDragId,
    handleDragEnd,
    handleDragStart,
    handleItemFocusRestored,
    resolveSchedule,
  }
}

function schedulesMatch(
  left: CalendarItemSchedule | null,
  right: CalendarItemSchedule,
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
