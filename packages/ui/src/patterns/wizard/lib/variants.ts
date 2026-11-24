import { cva } from 'class-variance-authority'

export const wizardClassName = '@container/wizard min-w-0'

export const wizardShellClassName =
  'gap-1 bg-muted p-1 shadow-none [--wizard-shell-radius:var(--card-surface-radius,var(--radius-2xl))] before:hidden dark:bg-sidebar @2xl/wizard:grid @2xl/wizard:grid-cols-[16rem_minmax(0,1fr)]'

export const wizardNavClassName = 'p-3'

export const wizardPanelCardClassName =
  'min-w-0 [--card-radius:calc(var(--wizard-shell-radius)_-_var(--spacing))]'

export const wizardStepListClassName = 'm-0 flex list-none flex-col gap-1 p-0'

export const wizardStepTriggerClassName =
  'flex w-full min-w-0 items-center gap-3 rounded-lg p-2 text-start outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring enabled:hover:bg-accent disabled:cursor-not-allowed'

export const wizardStepIndicatorVariants = cva(
  'font-medium text-sm transition-colors',
  {
    defaultVariants: { status: 'upcoming' },
    variants: {
      status: {
        complete: 'bg-primary text-primary-foreground',
        current: 'bg-primary text-primary-foreground ring-4 ring-primary/16',
        upcoming: '',
      },
    },
  },
)

export const wizardPanelClassName =
  'flex min-w-0 flex-1 flex-col gap-6 p-6 outline-none'

export const wizardFooterClassName =
  'mt-auto flex flex-wrap items-center justify-between gap-4'
