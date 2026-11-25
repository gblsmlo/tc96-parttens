import type {
  Support4RowAction,
  Support4Rule,
  Support4RuleMove,
} from '@tc96/ui/blocks/data/support/support-4'
import {
  rowActions as dataGridRowActions,
  rules as dataGridRules,
} from '../../support/fixtures/support-3.ts'

export const rules: Support4Rule[] = dataGridRules

export const rowActions: Support4RowAction[] = dataGridRowActions

export const moveRule = (
  current: Support4Rule[],
  { fromIndex, toIndex }: Support4RuleMove,
): Support4Rule[] => {
  const next = [...current]
  const [moved] = next.splice(fromIndex, 1)
  if (moved) next.splice(toIndex, 0, moved)
  return next
}

export const sameOrder = (a: Support4Rule[], b: Support4Rule[]) =>
  a.every((rule, index) => rule.id === b[index]?.id)
