'use client'

import { getInitials } from '@tc96/helpers/initials'
import { type FlowStep, tidyTree } from '@tc96/parttens/flow/canvas/core'
import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { Progress } from '@tc96/ui/progress'
import { cn } from '@tc96/utils'
import { type ReactElement, useMemo } from 'react'
import { ImpactMapSkeleton } from './impact-map-skeleton'
import { defaultImpactMapLabels } from './labels'
import type { ImpactMapNode, ImpactMapProps } from './types'

const nodeSize = [224, 112] as const
const gap = [32, 64] as const
const padding = 24

function clampProgress(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)))
}

function layout(nodes: ImpactMapNode[], links: ImpactMapProps['links']) {
  const steps: FlowStep[] = nodes.map((node) => ({
    id: node.id,
    name: node.title,
    position: { x: 0, y: 0 },
    type: node.kind,
  }))
  const placed = tidyTree(
    steps,
    links.map((link) => ({
      id: link.id,
      source: link.target,
      target: link.source,
    })),
    { direction: 'vertical', gap, nodeSize },
  )
  const positions = new Map(placed.map((step) => [step.id, step.position]))
  const width =
    Math.max(0, ...placed.map((step) => step.position.x)) + nodeSize[0]
  const height =
    Math.max(0, ...placed.map((step) => step.position.y)) + nodeSize[1]
  return { height, positions, width }
}

export function ImpactMap({
  className,
  error = false,
  labels: labelsProp,
  links,
  nodes,
  onNodeSelect,
  onRetry,
  pending = false,
  selectedId = null,
}: Readonly<ImpactMapProps>): ReactElement {
  const labels = { ...defaultImpactMapLabels, ...labelsProp }
  const tree = useMemo(() => layout(nodes, links), [nodes, links])

  if (pending) {
    return (
      <ImpactMapSkeleton
        className={className}
        label={labels.loading}
        title={labels.title}
      />
    )
  }

  const edges = links.flatMap((link) => {
    const from = tree.positions.get(link.source)
    const to = tree.positions.get(link.target)
    if (!from || !to) return []
    const x1 = from.x + nodeSize[0] / 2
    const y1 = from.y
    const x2 = to.x + nodeSize[0] / 2
    const y2 = to.y + nodeSize[1]
    const middle = (y1 + y2) / 2
    return [
      {
        d: `M ${x1} ${y1} C ${x1} ${middle}, ${x2} ${middle}, ${x2} ${y2}`,
        id: link.id,
      },
    ]
  })

  return (
    <section
      aria-label={labels.title}
      className={cn('grid gap-4', className)}
      data-slot="impact-map"
    >
      <h3 className="font-medium text-base">{labels.title}</h3>
      {error ? (
        <StateSurface
          actions={
            onRetry ? (
              <Button onClick={onRetry} size="sm" variant="outline">
                {labels.retry}
              </Button>
            ) : undefined
          }
          description={labels.errorDescription}
          kind="error"
          title={labels.errorTitle}
        />
      ) : nodes.length === 0 ? (
        <StateSurface
          description={labels.emptyDescription}
          kind="empty"
          title={labels.emptyTitle}
        />
      ) : (
        <div className="overflow-auto rounded-xl border bg-background">
          <div
            className="relative mx-auto"
            style={{
              height: tree.height + padding * 2,
              width: tree.width + padding * 2,
            }}
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full"
              data-slot="impact-map-edges"
            >
              <g transform={`translate(${padding} ${padding})`}>
                {edges.map((edge) => (
                  <path
                    className="fill-none stroke-2 stroke-border"
                    d={edge.d}
                    key={edge.id}
                  />
                ))}
              </g>
            </svg>
            <ul aria-label={labels.map} className="m-0 list-none p-0">
              {nodes.map((node) => {
                const position = tree.positions.get(node.id)
                if (!position) return null
                const selected = node.id === selectedId
                const progress = clampProgress(node.progress)
                return (
                  <li
                    className="absolute"
                    key={node.id}
                    style={{
                      height: nodeSize[1],
                      left: position.x + padding,
                      top: position.y + padding,
                      width: nodeSize[0],
                    }}
                  >
                    <button
                      aria-pressed={selected}
                      className={cn(
                        'grid size-full content-between gap-2 rounded-xl border bg-card p-3 text-start text-card-foreground outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring',
                        selected &&
                          'border-primary bg-accent ring-2 ring-primary',
                      )}
                      data-kind={node.kind}
                      data-node={node.id}
                      data-selected={selected || undefined}
                      onClick={() => onNodeSelect?.(node.id)}
                      type="button"
                    >
                      <span className="flex items-start gap-2">
                        <span className="grid min-w-0 flex-1 gap-1">
                          <span className="text-muted-foreground text-xs">
                            {labels.kinds[node.kind]}
                          </span>
                          <span className="truncate font-medium text-sm">
                            {node.title}
                          </span>
                        </span>
                        {node.owner ? (
                          <Avatar
                            aria-label={labels.owner(node.owner)}
                            className="[--avatar-size:--spacing(6)]"
                            role="img"
                          >
                            <AvatarFallback>
                              {getInitials(node.owner)}
                            </AvatarFallback>
                          </Avatar>
                        ) : null}
                      </span>
                      <span className="grid gap-1.5">
                        <Progress
                          aria-label={labels.progress(node.title, progress)}
                          value={progress}
                        />
                        <span className="flex items-center justify-between text-muted-foreground text-xs tabular-nums">
                          <span>{progress}%</span>
                          {node.valueText ? (
                            <Badge variant="outline">{node.valueText}</Badge>
                          ) : null}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
