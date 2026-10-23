import { cva } from 'class-variance-authority'
import type { FlowRunStatus } from '../core'

export const flowCanvasClassName =
  'relative isolate flex size-full min-h-80 min-w-0 flex-col overflow-hidden bg-background outline-none'

export const flowCanvasFlowClassName =
  '[--xy-attribution-background-color:transparent] [--xy-background-pattern-dots-color:var(--color-border)] [--xy-connectionline-stroke:var(--color-primary)] [--xy-edge-stroke:var(--color-muted-foreground)] [--xy-minimap-background-color:var(--color-card)] [--xy-minimap-mask-background-color:color-mix(in_oklab,var(--color-background)_72%,transparent)] [--xy-minimap-node-background-color:var(--color-muted-foreground)]' +
  String.raw` [&_.react-flow\_\_attribution_a]:text-muted-foreground!`

export const flowCanvasEmptyClassName =
  'pointer-events-none absolute inset-0 z-10 flex items-center justify-center'

export const flowStepNodeVariants = cva(
  'flex w-64 flex-col rounded-xl border bg-card text-card-foreground shadow-xs/5 transition-shadow group-focus-visible/step:ring-2 group-focus-visible/step:ring-ring',
  {
    defaultVariants: { selected: false },
    variants: {
      selected: {
        false: 'border-border',
        true: 'border-primary ring-2 ring-primary/32',
      },
    },
  },
)

export const flowStepNodeHeaderClassName = 'flex min-w-0 items-center gap-3 p-3'

export const flowStepNodeTextClassName = 'flex min-w-0 flex-1 flex-col'

export const flowStepNodeTitleClassName = 'truncate font-medium text-sm'

export const flowStepNodeDescriptionClassName =
  'truncate text-muted-foreground text-xs'

export const flowStepNodeFooterClassName =
  'flex min-w-0 items-center gap-2 border-t px-3 py-2 text-muted-foreground text-xs'

export const flowStepNodeIconVariants = cva('', {
  defaultVariants: { kind: 'action' },
  variants: {
    kind: {
      action: 'border border-border bg-transparent text-foreground',
      condition: 'border border-border bg-transparent text-foreground',
      trigger: 'bg-primary text-primary-foreground',
    },
  },
})

export const flowStatusTextVariants = cva('flex min-w-0 items-center gap-1', {
  defaultVariants: { status: 'not-run' },
  variants: {
    status: {
      failed: 'text-destructive-foreground',
      idle: 'text-muted-foreground',
      'not-run': 'text-muted-foreground',
      running: 'text-info-foreground',
      skipped: 'text-muted-foreground',
      success: 'text-success-foreground',
    } satisfies Record<FlowRunStatus, string>,
  },
})

export const flowHandleClassName =
  'size-2.5! border-2! border-background! bg-muted-foreground!'

export const flowNodeAddLeafClassName =
  'nodrag nopan absolute start-1/2 top-full mt-2 -translate-x-1/2'

export const flowEdgePathVariants = cva(
  'stroke-2! motion-reduce:animate-none!',
  {
    defaultVariants: { taken: false },
    variants: {
      taken: {
        false: 'stroke-muted-foreground!',
        true: 'stroke-primary!',
      },
    },
  },
)

export const flowEdgeLabelClassName =
  'nodrag nopan pointer-events-auto absolute flex items-center gap-1'

export const flowEdgeControlsClassName =
  'flex items-center gap-1 opacity-0 transition-opacity focus-within:opacity-100 hover:opacity-100 pointer-coarse:opacity-100'

export const flowControlsPanelClassName =
  'm-4 flex items-center gap-2 rounded-xl border bg-popover p-1 shadow-sm/5'

export const flowMinimapClassName =
  'm-4 hidden overflow-hidden rounded-xl border! shadow-sm/5 md:block'

export const flowShortcutRowClassName =
  'flex items-center justify-between gap-6 text-sm'
