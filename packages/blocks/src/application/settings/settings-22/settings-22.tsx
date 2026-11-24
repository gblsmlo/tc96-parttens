import { CopyIcon } from '@phosphor-icons/react'
import { SettingsSection } from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section-header'
import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Button } from '@tc96/ui/button'
import { Switch } from '@tc96/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@tc96/ui/table'
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../shared/settings-load-state'
import { SettingsRowActions } from '../shared/settings-row-actions'
import { defaultSettings22Labels } from './labels'
import { Settings22Skeleton } from './settings-22-skeleton'
import type { Settings22Action, Settings22Props } from './types'

export function Settings22({
  error,
  onRetry,
  pending,
  className,
  keys,
  labels: labelsProp,
  onActiveChange,
  onCopy,
  onCreate,
  onKeyAction,
}: Readonly<Settings22Props>) {
  const labels = { ...defaultSettings22Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Settings22Skeleton />,
  })
  const actions = [
    { id: 'rotate', label: labels.rotate },
    { destructive: true, id: 'revoke', label: labels.revoke },
  ]

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-4xl', className)}
      header={
        <SettingsSectionHeader
          actions={
            onCreate ? (
              <Button onClick={onCreate} size="sm">
                {labels.newKey}
              </Button>
            ) : undefined
          }
        >
          <SettingsSectionTitle>{labels.title}</SettingsSectionTitle>
          <SettingsSectionDescription>
            {labels.description}
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      {loadState ??
        (keys.length === 0 ? (
          <StateSurface
            description={labels.emptyDescription}
            kind="empty"
            title={labels.emptyTitle}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{labels.columnName}</TableHead>
                <TableHead>{labels.columnToken}</TableHead>
                <TableHead>{labels.columnCreated}</TableHead>
                <TableHead>{labels.columnLastUsed}</TableHead>
                <TableHead>{labels.columnStatus}</TableHead>
                <TableHead>
                  <span className="sr-only">{labels.columnActions}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((key) => (
                <TableRow key={key.id}>
                  <TableCell className="font-medium">{key.name}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1">
                      <code className="font-mono text-muted-foreground text-xs">
                        {key.maskedToken}
                      </code>
                      {onCopy ? (
                        <Button
                          aria-label={labels.copy(key.name)}
                          onClick={() => onCopy(key.id)}
                          size="icon-sm"
                          variant="ghost"
                        >
                          <CopyIcon aria-hidden="true" />
                        </Button>
                      ) : null}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Text
                      foreground="muted"
                      render={<span>{key.createdAt}</span>}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Text
                      foreground="muted"
                      render={<span>{key.lastUsed ?? labels.neverUsed}</span>}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      aria-label={labels.status(key.name)}
                      checked={key.active}
                      disabled={!onActiveChange}
                      onCheckedChange={(checked) =>
                        onActiveChange?.(key.id, checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-end">
                    {onKeyAction ? (
                      <SettingsRowActions
                        actions={actions}
                        label={labels.actions(key.name)}
                        onAction={(action) =>
                          onKeyAction(key.id, action as Settings22Action)
                        }
                      />
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ))}
    </SettingsSection>
  )
}
