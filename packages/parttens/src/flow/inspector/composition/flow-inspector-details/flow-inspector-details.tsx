import { Avatar, AvatarFallback, AvatarImage } from '@tc96/elements/avatar'
import { cn } from '@tc96/utils'
import type { ReactNode } from 'react'
import { useFlowInspectorLabels } from '../../store/flow-inspector-context'
import type { FlowInspectorLabels } from '../../types'

export interface FlowInspectorDetail {
  id: string
  label: string
  value?: ReactNode
  owner?: { name: string; avatarUrl?: string }
}

export interface FlowInspectorDetailsProps {
  className?: string
  items: readonly FlowInspectorDetail[]
  labels?: Partial<FlowInspectorLabels>
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function FlowInspectorDetails({
  className,
  items,
  labels: labelOverrides,
}: FlowInspectorDetailsProps) {
  const labels = useFlowInspectorLabels(labelOverrides)
  const visible = items.filter(
    (item) => item.owner || (item.value !== undefined && item.value !== null),
  )

  return (
    <section
      aria-label={labels.details}
      className={cn('flex flex-col gap-3', className)}
      data-slot="flow-inspector-details"
    >
      <h3 className="font-medium text-sm">{labels.details}</h3>
      <dl className="flex flex-col gap-3">
        {visible.map((item) => (
          <div
            className="grid grid-cols-[6.5rem_1fr] items-start gap-3 text-sm"
            data-slot="flow-inspector-detail"
            key={item.id}
          >
            <dt className="text-muted-foreground">{item.label}</dt>
            <dd className="min-w-0 break-words">
              {item.owner ? (
                <span className="flex items-center gap-2">
                  <Avatar size="xs">
                    {item.owner.avatarUrl ? (
                      <AvatarImage alt="" src={item.owner.avatarUrl} />
                    ) : null}
                    <AvatarFallback>
                      {initialsOf(item.owner.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 truncate">{item.owner.name}</span>
                </span>
              ) : (
                item.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
