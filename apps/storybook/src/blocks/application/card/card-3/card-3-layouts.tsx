import { Card3 } from '@tc96/ui/blocks/application/card/card-3'
import { profile } from '../fixtures/card-3.ts'
import type { Card3Controls } from './card-3-controls.ts'

export const ComposedCard3 = ({ follow, message }: Readonly<Card3Controls>) => (
  <Card3
    onFollow={follow ? () => {} : undefined}
    onMessage={message ? () => {} : undefined}
    profile={profile}
  />
)
