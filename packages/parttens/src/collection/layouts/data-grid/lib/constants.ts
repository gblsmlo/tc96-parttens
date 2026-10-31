import type { DataGridAlign, DataGridDensity } from '../types'

export const HEADER_ALIGN: Record<DataGridAlign, string> = {
  center: 'justify-center',
  end: 'justify-end',
  start: 'justify-start',
}

export const CELL_ALIGN: Record<DataGridAlign, string> = {
  center: 'text-center justify-center',
  end: 'text-end justify-end',
  start: 'text-start justify-start',
}

export const ROW_DENSITY: Record<DataGridDensity, string> = {
  'extra-tall': 'min-h-18',
  medium: 'min-h-11',
  short: 'min-h-9',
  tall: 'min-h-14',
}

export const CELL_DENSITY: Record<DataGridDensity, string> = {
  'extra-tall': 'px-3 py-4',
  medium: 'px-2.5 py-2',
  short: 'px-2 py-1.5',
  tall: 'px-3 py-3',
}

export const ROW_HEIGHT: Record<DataGridDensity, number> = {
  'extra-tall': 72,
  medium: 44,
  short: 36,
  tall: 56,
}

export const DEFAULT_MAX_HEIGHT_PX = 600
export const FALLBACK_HEADER_HEIGHT_PX = 36
export const BOTTOM_BAR_HEIGHT_PX = 36

export const DRAG_SCROLL_THRESHOLD_PX = 8
export const DRAG_CLICK_SUPPRESSION_MS = 500
export const PENDING_SELECT_CLICK_WINDOW_MS = 750
export const DRAG_SCROLL_EXCLUDED_TARGETS = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  '[contenteditable="true"]',
  '[data-grid-select-trigger]',
  '[role="button"]',
  '[role="checkbox"]',
  '[role="combobox"]',
  '[role="columnheader"]',
  '[role="menuitem"]',
  '[role="menuitemcheckbox"]',
  '[role="option"]',
  '[role="separator"]',
].join(',')

export const SELECT_TRIGGER_SELECTOR = '[data-grid-select-trigger]'
export const CELL_SELECTOR = '[data-slot="data-grid-cell"]'
export const HEADER_SELECTOR = '[data-slot="data-grid-header"]'

export const RESIZE_STEP_PX = 8
export const DEFAULT_MIN_COLUMN_SIZE = 20
export const DEFAULT_MAX_COLUMN_SIZE = Number.MAX_SAFE_INTEGER

export const NON_NAVIGABLE_COLUMN_IDS: readonly string[] = ['select', 'actions']
