import { Card2 } from '@tc96/blocks/application/card/card-2'
import { integrations } from '../fixtures/card-2.ts'
import type { Card2Controls } from './card-2-controls.ts'

export const ComposedCard2 = ({
  connectable,
  title,
}: Readonly<Card2Controls>) => (
  <Card2
    integrations={integrations}
    labels={{ title }}
    onConnect={connectable ? () => {} : undefined}
  />
)
