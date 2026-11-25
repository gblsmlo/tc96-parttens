import {
  Support3,
  type Support3Props,
} from '@tc96/ui/blocks/data/support/support-3'
import { useState } from 'react'
import {
  rules as initialRules,
  moveRule,
  rowActions,
  sameOrder,
} from '../fixtures/support-3.ts'
import type { Support3Controls } from './support-3-controls.ts'

interface ComposedSupport3Props extends Support3Controls {
  onEnabledChange?: Support3Props['onEnabledChange']
  onResetOrder?: Support3Props['onResetOrder']
  onRowAction?: Support3Props['onRowAction']
  onRuleMove?: Support3Props['onRuleMove']
}

export const ComposedSupport3 = ({
  empty,
  locale,
  onEnabledChange,
  onResetOrder,
  onRowAction,
  onRuleMove,
  reorder,
  rowMenu,
  title,
}: Readonly<ComposedSupport3Props>) => {
  const [rules, setRules] = useState(initialRules)
  const byOrder = (next: typeof rules) =>
    initialRules.map((rule) => next.find((item) => item.id === rule.id) ?? rule)

  return (
    <Support3
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
