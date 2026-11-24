import { CheckCircleIcon, PencilSimpleIcon } from '@phosphor-icons/react'
import { Button } from '@tc96/ui/button'
import type { DataGrid4Labels } from './types'

export interface DataGrid4FooterProps {
  count: number
  labels: DataGrid4Labels
  onDiscard?: () => void
  onSave?: () => void
  saving: boolean
}

export function DataGrid4Footer({
  count,
  labels,
  onDiscard,
  onSave,
  saving,
}: Readonly<DataGrid4FooterProps>) {
  const idle = count === 0 || saving
  const Icon = count === 0 ? CheckCircleIcon : PencilSimpleIcon

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-3"
      data-dirty={count > 0 || undefined}
      data-slot="data-grid-4-footer"
    >
      <output
        aria-live="polite"
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm"
      >
        <Icon
          aria-hidden="true"
          className={
            count === 0
              ? 'size-4 text-success-foreground'
              : 'size-4 text-warning-foreground'
          }
        />
        {count === 0 ? labels.allSaved : labels.unsavedChanges(count)}
      </output>
      <div className="flex items-center gap-2">
        {onDiscard ? (
          <Button
            disabled={idle}
            onClick={onDiscard}
            size="sm"
            variant="outline"
          >
            {labels.discard}
          </Button>
        ) : null}
        {onSave ? (
          <Button
            disabled={count === 0}
            loading={saving}
            onClick={onSave}
            size="sm"
          >
            {labels.save}
          </Button>
        ) : null}
      </div>
    </div>
  )
}
