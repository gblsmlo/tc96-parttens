import {
  CELL_SELECTOR,
  DRAG_SCROLL_EXCLUDED_TARGETS,
  SELECT_TRIGGER_SELECTOR,
} from './constants'

export function shouldPullFocus(cell: HTMLElement) {
  const active = document.activeElement
  if (!active || active === document.body) return true
  if (cell.contains(active)) return false
  return Boolean(active.closest(CELL_SELECTOR))
}

export function isDragScrollExcludedTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(target.closest(DRAG_SCROLL_EXCLUDED_TARGETS))
  )
}

export function hasSelectTrigger(cell: Element) {
  return Boolean(cell.querySelector(SELECT_TRIGGER_SELECTOR))
}
