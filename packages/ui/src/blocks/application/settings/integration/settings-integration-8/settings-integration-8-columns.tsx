import { CopyIcon } from '@phosphor-icons/react'
import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import type { UseDataGridOptions } from '@tc96/ui/patterns/collection/layouts/data-grid/hooks/use-data-grid'
import { Switch } from '@tc96/ui/switch'
import { SettingsAppLogo } from '../../shared/settings-app-logo'
import type {
  SettingsIntegration8Item,
  SettingsIntegration8Labels,
  SettingsIntegration8Props,
} from './types'

export interface SettingsIntegration8ColumnsInput {
  labels: SettingsIntegration8Labels
  onCopyKey?: SettingsIntegration8Props['onCopyKey']
  onEnabledChange?: SettingsIntegration8Props['onEnabledChange']
  paused: boolean
}

export function createSettingsIntegration8Columns({
  labels,
  onCopyKey,
  onEnabledChange,
  paused,
}: Readonly<SettingsIntegration8ColumnsInput>): UseDataGridOptions<SettingsIntegration8Item>['columns'] {
  return [
    {
      accessorFn: (item) => item.name,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <SettingsAppLogo logo={row.original.logo} name={row.original.name} />
          <span className="truncate font-medium text-sm">
            {row.original.name}
          </span>
        </div>
      ),
      enableHiding: false,
      header: labels.integrationColumn,
      id: 'integration',
      meta: { label: labels.integrationColumn },
      size: 260,
    },
    {
      accessorFn: (item) => item.keyPreview,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Badge className="font-mono" variant="outline">
            {row.original.keyPreview}
          </Badge>
          {onCopyKey ? (
            <Button
              aria-label={labels.copyAction(row.original.name)}
              onClick={() => onCopyKey(row.original.id)}
              size="icon-sm"
              variant="ghost"
            >
              <CopyIcon aria-hidden="true" />
            </Button>
          ) : null}
        </div>
      ),
      enableSorting: false,
      header: labels.keyColumn,
      id: 'key',
      meta: { label: labels.keyColumn },
      size: 260,
    },
    {
      accessorFn: (item) => item.calls,
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">{row.original.callsLabel}</span>
      ),
      header: labels.callsColumn,
      id: 'calls',
      meta: { label: labels.callsColumn },
      size: 170,
    },
    {
      accessorFn: (item) => item.enabled,
      cell: ({ row }) => (
        <Switch
          aria-label={labels.enableAction(row.original.name)}
          checked={row.original.enabled && !paused}
          disabled={paused || !onEnabledChange}
          onCheckedChange={(enabled) =>
            onEnabledChange?.(row.original.id, enabled)
          }
        />
      ),
      enableSorting: false,
      header: labels.enabledColumn,
      id: 'enabled',
      meta: { label: labels.enabledColumn },
      size: 110,
    },
  ]
}
