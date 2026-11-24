import { Card8, type Card8Props } from '@tc96/ui/blocks/application/card/card-8'
import { meetingActions, meetings } from '../fixtures/card-8.tsx'
import type { Card8Controls } from './card-8-controls.ts'

interface ComposedCard8Props extends Card8Controls {
  onActionSelect?: Card8Props['onActionSelect']
  onJoin?: Card8Props['onJoin']
}

export const ComposedCard8 = ({
  empty,
  heading,
  onActionSelect,
  onJoin,
  withActions,
  withJoin,
}: Readonly<ComposedCard8Props>) => (
  <Card8
    actions={withActions ? meetingActions : undefined}
    labels={{ heading }}
    meetings={empty ? [] : meetings}
    onActionSelect={
      withActions ? (id, action) => onActionSelect?.(id, action) : undefined
    }
    onJoin={withJoin ? (id) => onJoin?.(id) : undefined}
  />
)
