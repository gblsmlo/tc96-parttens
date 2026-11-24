import { Card7, type Card7Props } from '@tc96/blocks/application/card/card-7'
import { contact, items, stats } from '../fixtures/card-7.tsx'
import type { Card7Controls } from './card-7-controls.ts'

interface ComposedCard7Props extends Card7Controls {
  onAction?: Card7Props['onAction']
}

export const ComposedCard7 = ({
  action,
  onAction,
  withAction,
  withItems,
  withStats,
  withStatus,
}: Readonly<ComposedCard7Props>) => (
  <Card7
    className="max-w-sm"
    contact={withStatus ? contact : { ...contact, status: undefined }}
    items={withItems ? items : []}
    labels={{ action }}
    onAction={withAction ? () => onAction?.() : undefined}
    stats={withStats ? stats : []}
  />
)
