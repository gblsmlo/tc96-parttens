import { IconFrame } from '@tc96/elements/icon-frame'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { XIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useFlowInspectorContext } from '../store/flow-inspector-context'

export function InspectorHeader({
  actions,
  badge,
  icon,
  title,
}: Readonly<{
  actions?: ReactNode
  badge?: ReactNode
  icon?: ReactNode
  title: ReactNode
}>) {
  const { labels, onClose } = useFlowInspectorContext('InspectorHeader')
  return (
    <header
      className="flex items-start gap-3 p-4"
      data-slot="flow-inspector-header"
    >
      {icon ? (
        <IconFrame className="mt-0.5" shape="rounded">
          {icon}
        </IconFrame>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
        <h2 className="max-w-full truncate font-semibold text-base">{title}</h2>
        {badge ? <Badge variant="outline">{badge}</Badge> : null}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {actions}
        <Button
          aria-label={labels.close}
          onClick={onClose}
          size="icon-sm"
          variant="ghost"
        >
          <XIcon aria-hidden="true" />
        </Button>
      </div>
    </header>
  )
}
