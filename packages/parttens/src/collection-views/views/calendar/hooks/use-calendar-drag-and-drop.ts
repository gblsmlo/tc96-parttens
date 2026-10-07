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
  const [previews, setPreviews] = useState<
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
      previews.get(String(getKey(item))) ??
      overrides.get(String(getKey(item))) ??
      getItemSchedule(item),
    [getItemSchedule, getKey, overrides, previews],
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

  const commitReschedule = useCallback(
    (
      item: TItem,
      itemKey: string,
      schedule: CalendarItemSchedule,
      nextSchedule: CalendarItemSchedule,
      suspend?: () => { abort: () => void; resume: () => void },
    ) => {
      if (!onItemReschedule) return

      const change: CalendarItemReschedule<TItem> = {
        end: nextSchedule.end,
        isAllDay: nextSchedule.isAllDay,
        item,
        itemKey,
        sourceEnd: schedule.end,
        sourceStart: schedule.start,
        start: nextSchedule.start,
      }

      setOverrides((current) => new Map(current).set(itemKey, nextSchedule))
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId
      pendingRef.current = {
        accepted: false,
        itemKey,
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
          removeOverride(itemKey)
          return
        }

        pending.accepted = true
        if (settleSuspension) suspension?.resume()
      }

      try {
        const accepted = onItemReschedule(change)

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
    [onItemReschedule, removeOverride],
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

      setFocusItemDragId(String(source?.id))
      commitReschedule(item, parsed.itemKey, schedule, nextSchedule, () =>
        event.suspend(),
      )
    },
    [
      commitReschedule,
      getItemSchedule,
      getKey,
      onItemReschedule,
      snapMinutes,
      timeZone,
    ],
  )

  const previewSchedule = useCallback(
    (itemKey: string, schedule: CalendarItemSchedule | null) => {
      setPreviews((current) => {
        if (!schedule && !current.has(itemKey)) return current
        const next = new Map(current)
        if (schedule) next.set(itemKey, schedule)
        else next.delete(itemKey)
        return next
      })
    },
    [],
  )

  const resizeItem = useCallback(
    (itemKey: string, nextSchedule: CalendarItemSchedule) => {
      previewSchedule(itemKey, null)
      const item = itemsRef.current.find(
        (candidate) => String(getKey(candidate)) === itemKey,
      )
      if (!item) return

      const schedule =
        overridesRef.current.get(itemKey) ?? getItemSchedule(item)
      if (!schedule || schedulesMatch(schedule, nextSchedule)) return

      commitReschedule(item, itemKey, schedule, nextSchedule)
    },
    [commitReschedule, getItemSchedule, getKey, previewSchedule],
  )

  return {
    dragEnabled: Boolean(onItemReschedule),
    focusItemDragId,
    handleDragEnd,
    handleDragStart,
    handleItemFocusRestored,
    previewSchedule,
    resizeItem,
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
