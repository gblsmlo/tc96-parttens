import type {
  Table7RowAction,
  Table7Rule,
  Table7RuleMove,
} from '@tc96/ui/blocks/data/table/table-7'
import {
  rowActions as dataGridRowActions,
  rules as dataGridRules,
} from '../../data-grid/fixtures/data-grid-7.ts'

export const rules: Table7Rule[] = dataGridRules

export const rowActions: Table7RowAction[] = dataGridRowActions

export const moveRule = (
  current: Table7Rule[],
  { fromIndex, toIndex }: Table7RuleMove,
): Table7Rule[] => {
  const next = [...current]
  const [moved] = next.splice(fromIndex, 1)
  if (moved) next.splice(toIndex, 0, moved)
  return next
}

export const sameOrder = (a: Table7Rule[], b: Table7Rule[]) =>
  a.every((rule, index) => rule.id === b[index]?.id)
