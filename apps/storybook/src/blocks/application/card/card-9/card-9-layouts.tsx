import { Card9, type Card9Props } from '@tc96/blocks/application/card/card-9'
import { delivery, deliveryActions } from '../fixtures/card-9.ts'
import type { Card9Controls } from './card-9-controls.ts'

interface ComposedCard9Props extends Card9Controls {
  onActionSelect?: Card9Props['onActionSelect']
}

export const ComposedCard9 = ({
  onActionSelect,
  title,
  withActions,
  withNotes,
}: Readonly<ComposedCard9Props>) => (
  <Card9
    actions={withActions ? deliveryActions : undefined}
    className="max-w-md"
    delivery={withNotes ? delivery : { ...delivery, notes: undefined }}
    labels={{ title }}
    onActionSelect={withActions ? (id) => onActionSelect?.(id) : undefined}
  />
)
