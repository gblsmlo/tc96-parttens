import {
  DataGrid7,
  type DataGrid7Props,
} from '@tc96/ui/blocks/data/data-grid/data-grid-7'
import { useState } from 'react'
import {
  rules as initialRules,
  moveRule,
  rowActions,
  sameOrder,
} from '../fixtures/data-grid-7.ts'
import type { DataGrid7Controls } from './data-grid-7-controls.ts'

interface ComposedDataGrid7Props extends DataGrid7Controls {
  onEnabledChange?: DataGrid7Props['onEnabledChange']
  onResetOrder?: DataGrid7Props['onResetOrder']
  onRowAction?: DataGrid7Props['onRowAction']
  onRuleMove?: DataGrid7Props['onRuleMove']
}

export const ComposedDataGrid7 = ({
  empty,
  locale,
  onEnabledChange,
  onResetOrder,
  onRowAction,
  onRuleMove,
  reorder,
  rowMenu,
  title,
}: Readonly<ComposedDataGrid7Props>) => {
  const [rules, setRules] = useState(initialRules)
  const byOrder = (next: typeof rules) =>
    initialRules.map((rule) => next.find((item) => item.id === rule.id) ?? rule)

  return (
    <DataGrid7
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
