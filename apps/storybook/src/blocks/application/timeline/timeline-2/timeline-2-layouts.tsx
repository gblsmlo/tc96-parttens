import {
  Timeline2,
  type Timeline2Props,
} from '@tc96/blocks/application/timeline/timeline-2'
import { releases } from '../fixtures/timeline-2.ts'
import type { Timeline2Controls } from './timeline-2-controls.ts'

interface ComposedTimeline2Props extends Timeline2Controls {
  onRetry?: Timeline2Props['onRetry']
}

export const ComposedTimeline2 = ({
  empty,
  error,
  locale,
  onRetry,
  pending,
  title,
}: Readonly<ComposedTimeline2Props>) => (
  <Timeline2
    error={error}
    labels={{ title }}
    locale={locale}
    onRetry={onRetry}
    pending={pending}
    releases={empty ? [] : releases}
  />
)
