import {
  Support4,
  type Support4Props,
} from '@tc96/ui/blocks/data/support/support-4'
import { useState } from 'react'
import {
  rules as initialRules,
  moveRule,
  rowActions,
  sameOrder,
} from '../fixtures/support-4.ts'
import type { Support4Controls } from './support-4-controls.ts'

interface ComposedSupport4Props extends Support4Controls {
  onEnabledChange?: Support4Props['onEnabledChange']
  onResetOrder?: Support4Props['onResetOrder']
  onRowAction?: Support4Props['onRowAction']
  onRuleMove?: Support4Props['onRuleMove']
}

export const ComposedSupport4 = ({
  empty,
  locale,
  onEnabledChange,
  onResetOrder,
  onRowAction,
  onRuleMove,
  reorder,
  rowMenu,
  title,
}: Readonly<ComposedSupport4Props>) => {
  const [rules, setRules] = useState(initialRules)
  const byOrder = (next: typeof rules) =>
    initialRules.map((rule) => next.find((item) => item.id === rule.id) ?? rule)

  return (
    <Support4
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
