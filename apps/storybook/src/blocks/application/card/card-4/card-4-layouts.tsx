import { Card4, type Card4Props } from '@tc96/blocks/application/card/card-4'
import { meetings } from '../fixtures/card-4.ts'
import type { Card4Controls } from './card-4-controls.ts'

interface ComposedCard4Props extends Card4Controls {
  onJoin?: Card4Props['onJoin']
}

const ignore = () => undefined

export const ComposedCard4 = ({
  empty,
  maxAttendees,
  onJoin = ignore,
  title,
  withJoin,
}: Readonly<ComposedCard4Props>) => (
  <Card4
    labels={{ title }}
    maxAttendees={maxAttendees}
    meetings={empty ? [] : meetings}
    onJoin={withJoin ? onJoin : undefined}
  />
)
