import { Table7, type Table7Props } from '@tc96/ui/blocks/data/table/table-7'
import { useState } from 'react'
import {
  rules as initialRules,
  moveRule,
  rowActions,
  sameOrder,
} from '../fixtures/table-7.ts'
import type { Table7Controls } from './table-7-controls.ts'

interface ComposedTable7Props extends Table7Controls {
  onEnabledChange?: Table7Props['onEnabledChange']
  onResetOrder?: Table7Props['onResetOrder']
  onRowAction?: Table7Props['onRowAction']
  onRuleMove?: Table7Props['onRuleMove']
}

export const ComposedTable7 = ({
  empty,
  locale,
  onEnabledChange,
  onResetOrder,
  onRowAction,
  onRuleMove,
  reorder,
  rowMenu,
  title,
}: Readonly<ComposedTable7Props>) => {
  const [rules, setRules] = useState(initialRules)
  const byOrder = (next: typeof rules) =>
    initialRules.map((rule) => next.find((item) => item.id === rule.id) ?? rule)

  return (
    <Table7
      labels={{ title }}
      locale={locale}
      onEnabledChange={(id, enabled) => {
        setRules((current) =>
          current.map((rule) => (rule.id === id ? { ...rule, enabled } : rule)),
        )
        onEnabledChange?.(id, enabled)
      }}
      onResetOrder={
        reorder
          ? () => {
              setRules(byOrder)
              onResetOrder?.()
            }
          : undefined
      }
      onRowAction={rowMenu ? onRowAction : undefined}
      onRuleMove={
        reorder
          ? (move) => {
              setRules((current) => moveRule(current, move))
              onRuleMove?.(move)
            }
          : undefined
      }
      orderChanged={!sameOrder(rules, initialRules)}
      rowActions={rowMenu ? rowActions : undefined}
      rules={empty ? [] : rules}
    />
  )
}
