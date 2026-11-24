import { Timeline4 } from '@tc96/ui/blocks/application/timeline/timeline-4'
import { useEffect, useState } from 'react'
import { activityEntries } from '../fixtures/timeline-4.ts'
import type { Timeline4Controls } from './timeline-4-controls.ts'

export interface ComposedTimeline4Props extends Timeline4Controls {
  onOpenChange?: (open: boolean) => void
  onRetry?: () => void
}

export const ComposedTimeline4 = ({
  empty,
  error,
  onOpenChange,
  onRetry,
  open: initialOpen,
  pending,
  title,
  trigger,
}: Readonly<ComposedTimeline4Props>) => {
  const [open, setOpen] = useState(initialOpen)

  useEffect(() => setOpen(initialOpen), [initialOpen])

  return (
    <Timeline4
      entries={empty ? [] : activityEntries}
      error={error}
      labels={{ title, trigger }}
      onOpenChange={(next) => {
        setOpen(next)
        onOpenChange?.(next)
      }}
      onRetry={onRetry}
      open={open}
      pending={pending}
    />
  )
}
