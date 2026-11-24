import {
  Timeline1,
  type Timeline1Props,
} from '@tc96/blocks/application/timeline/timeline-1'
import { events } from '../fixtures/timeline-1.ts'
import type { Timeline1Controls } from './timeline-1-controls.ts'

interface ComposedTimeline1Props extends Timeline1Controls {
  onRetry?: Timeline1Props['onRetry']
}

export const ComposedTimeline1 = ({
  attachments,
  empty,
  error,
  onRetry,
  pending,
  title,
}: Readonly<ComposedTimeline1Props>) => (
  <Timeline1
    error={error}
    events={
      empty
        ? []
        : events.map((event) =>
            attachments ? event : { ...event, attachments: undefined },
          )
    }
    labels={{ title }}
    onRetry={onRetry}
    pending={pending}
  />
)
