import type { FilterFn, RowData, TableFeatures } from '@tanstack/react-table'
import { isValidDate, parseDateValue } from '@tc96/ui/helpers/date'
import type { DataGridSelectOption } from '../types'
import type { DataGridFeatures } from './data-grid-features'

export const DATA_GRID_CONDITION_OPERATORS = {
  date: ['before', 'after', 'between'],
  number: ['eq', 'gt', 'lt', 'between'],
  option: ['is', 'is-not', 'is-any-of'],
  text: ['contains', 'is', 'is-not'],
} as const

export type DataGridConditionKind = keyof typeof DATA_GRID_CONDITION_OPERATORS

export type DataGridConditionOperator =
  (typeof DATA_GRID_CONDITION_OPERATORS)[DataGridConditionKind][number]

export type DataGridConditionJoin = 'and' | 'or'

export interface DataGridConditionField {
  columnId: string
  kind: DataGridConditionKind
  label: string
  options?: readonly DataGridSelectOption[]
}

export interface DataGridCondition {
  columnId: string
  id: string
  operator: DataGridConditionOperator
  value: readonly string[]
}

export function getConditionOperators(
  kind: DataGridConditionKind,
): readonly DataGridConditionOperator[] {
  return DATA_GRID_CONDITION_OPERATORS[kind]
}

export function normalizeConditionValue(
  operator: DataGridConditionOperator,
  value: readonly string[],
): readonly string[] {
  if (operator === 'between') return value.slice(0, 2)
  if (operator === 'is-any-of') return value
  return value.slice(0, 1)
}

export function createCondition(
  field: DataGridConditionField,
  id: string,
): DataGridCondition {
  const [operator] = getConditionOperators(field.kind)
  return {
    columnId: field.columnId,
    id,
    operator: operator ?? 'is',
    value: [],
  }
}

export function changeConditionOperator(
  condition: DataGridCondition,
  operator: DataGridConditionOperator,
): DataGridCondition {
  return {
    ...condition,
    operator,
    value: normalizeConditionValue(operator, condition.value),
  }
}

export function isConditionComplete(condition: DataGridCondition): boolean {
  const filled = condition.value.filter((entry) => entry.trim() !== '')
  if (condition.operator === 'between') return filled.length === 2
  return filled.length > 0
}

const normalizeText = (value: unknown) =>
  value === null || value === undefined
    ? ''
    : String(value).trim().toLocaleLowerCase()

const startOfDay = (value: unknown) => {
  if (value === null || value === undefined || value === '') return Number.NaN
  const date = parseDateValue(value)
  return isValidDate(date)
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    : Number.NaN
}

const toNumber = (value: unknown) =>
  value === null || value === undefined || value === ''
    ? Number.NaN
    : Number(value)

const isBetween = (value: number, first: number, second: number) =>
  Number.isFinite(value) &&
  value >= Math.min(first, second) &&
  value <= Math.max(first, second)

function matchesText(condition: DataGridCondition, cell: unknown): boolean {
  const target = normalizeText(condition.value[0])
  const actual = normalizeText(cell)
  if (condition.operator === 'contains') return actual.includes(target)
  if (condition.operator === 'is-not') return actual !== target
  return actual === target
}

function matchesOption(condition: DataGridCondition, cell: unknown): boolean {
  const actual = cell === null || cell === undefined ? '' : String(cell)
  if (condition.operator === 'is-any-of')
    return condition.value.includes(actual)
  if (condition.operator === 'is-not') return actual !== condition.value[0]
  return actual === condition.value[0]
}

function matchesNumber(condition: DataGridCondition, cell: unknown): boolean {
  const actual = toNumber(cell)
  const [first, second] = condition.value.map(toNumber)
  if (first === undefined || !Number.isFinite(actual)) return false
  if (condition.operator === 'gt') return actual > first
  if (condition.operator === 'lt') return actual < first
  if (condition.operator === 'between') {
    return isBetween(actual, first, second ?? Number.NaN)
  }
  return actual === first
}

function matchesDate(condition: DataGridCondition, cell: unknown): boolean {
  const actual = startOfDay(cell)
  const [first, second] = condition.value.map(startOfDay)
  if (first === undefined || Number.isNaN(actual)) return false
  if (condition.operator === 'before') return actual < first
  if (condition.operator === 'after') return actual > first
  return isBetween(actual, first, second ?? Number.NaN)
}

export function matchesCondition(
  condition: DataGridCondition,
  cell: unknown,
  kind: DataGridConditionKind,
): boolean {
  if (kind === 'text') return matchesText(condition, cell)
  if (kind === 'option') return matchesOption(condition, cell)
  if (kind === 'number') return matchesNumber(condition, cell)
  return matchesDate(condition, cell)
}

export interface MatchConditionsOptions {
  conditions: readonly DataGridCondition[]
  fields: readonly DataGridConditionField[]
  getValue: (columnId: string) => unknown
  join?: DataGridConditionJoin
}

export function matchesConditions({
  conditions,
  fields,
  getValue,
  join = 'and',
}: MatchConditionsOptions): boolean {
  const kinds = new Map(fields.map((field) => [field.columnId, field.kind]))
  const active = conditions.filter(
    (condition) =>
      isConditionComplete(condition) && kinds.has(condition.columnId),
  )
  if (active.length === 0) return true

  const test = (condition: DataGridCondition) => {
    const kind = kinds.get(condition.columnId)
    return kind !== undefined
      ? matchesCondition(condition, getValue(condition.columnId), kind)
      : true
  }
  return join === 'or' ? active.some(test) : active.every(test)
}

export function createDataGridConditionFilterFn<
  TData extends RowData = RowData,
  TFeatures extends TableFeatures = DataGridFeatures,
>(
  fields: readonly DataGridConditionField[],
  join: DataGridConditionJoin = 'and',
): FilterFn<TFeatures, TData> {
  const filterFn: FilterFn<TFeatures, TData> = (row, _columnId, value) =>
    Array.isArray(value)
      ? matchesConditions({
          conditions: value,
          fields,
          getValue: (columnId) => row.getValue(columnId),
          join,
        })
      : true
  filterFn.autoRemove = (value) => !Array.isArray(value) || value.length === 0
  return filterFn
}
