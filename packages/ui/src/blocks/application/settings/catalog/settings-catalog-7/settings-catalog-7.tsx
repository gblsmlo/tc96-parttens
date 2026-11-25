import { Button } from '@tc96/ui/button'
import { SettingsCollapsed } from '@tc96/ui/patterns/surfaces/settings/composition/settings-collapsed/settings-collapsed'
import { SettingsRow } from '@tc96/ui/patterns/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
import { StateSurface } from '@tc96/ui/patterns/surfaces/state/composition/state-surface/state-surface'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../../shared/settings-load-state'
import { SettingsRowActions } from '../../shared/settings-row-actions'
import { defaultSettingsCatalog7Labels } from './labels'
import { SettingsCatalog7Skeleton } from './settings-catalog-7-skeleton'
import type {
  SettingsCatalog7Action,
  SettingsCatalog7Labels,
  SettingsCatalog7Props,
  SettingsCatalog7Reason,
} from './types'

interface ReasonRowProps {
  archived?: boolean
  labels: SettingsCatalog7Labels
  onReasonAction?: SettingsCatalog7Props['onReasonAction']
  reason: SettingsCatalog7Reason
}

function ReasonRow({
  archived,
  labels,
  onReasonAction,
  reason,
}: Readonly<ReasonRowProps>) {
  const actions = archived
    ? [
        { id: 'restore', label: labels.restore },
        { destructive: true, id: 'delete', label: labels.delete },
      ]
    : [
        { id: 'edit', label: labels.edit },
        { id: 'archive', label: labels.archive },
        { destructive: true, id: 'delete', label: labels.delete },
      ]

  return (
    <SettingsRow
      description={labels.leadsLost(reason.leads)}
      endSlot={
        onReasonAction ? (
          <SettingsRowActions
            actions={actions}
            label={labels.actions(reason.name)}
            onAction={(action) =>
              onReasonAction(reason.id, action as SettingsCatalog7Action)
            }
          />
        ) : undefined
      }
      title={reason.name}
    />
  )
}

export function SettingsCatalog7({
  error,
  onRetry,
  pending,
  allowCustomReason = true,
  archivedReasons = [],
  className,
  labels: labelsProp,
  onAllowCustomReasonChange,
  onCreate,
  onReasonAction,
  onRequireReasonChange,
  reasons,
  requireReason = false,
}: Readonly<SettingsCatalog7Props>) {
  const labels = { ...defaultSettingsCatalog7Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsCatalog7Skeleton />,
  })

  return (
    <div
      className={cn('mx-auto flex w-full max-w-2xl flex-col gap-8', className)}
    >
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>{labels.lostLeadsTitle}</SettingsSectionTitle>
            <SettingsSectionDescription>
              {labels.lostLeadsDescription}
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        {loadState ?? (
          <>
            <SettingsRow
              description={labels.requireReasonDescription}
              endSlot={
                <Switch
                  aria-label={labels.requireReason}
                  checked={requireReason}
                  onCheckedChange={onRequireReasonChange}
                />
              }
              title={labels.requireReason}
            />
            <SettingsRow
              description={labels.allowCustomReasonDescription}
              endSlot={
                <Switch
                  aria-label={labels.allowCustomReason}
                  checked={allowCustomReason}
                  onCheckedChange={onAllowCustomReasonChange}
                />
              }
              title={labels.allowCustomReason}
            />
          </>
        )}
      </SettingsSection>
      {loadState ? null : (
        <SettingsSection
          header={
            <SettingsSectionHeader
              actions={
                onCreate ? (
                  <Button onClick={onCreate} size="sm">
                    {labels.newReason}
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
          {reasons.length === 0 ? (
            <StateSurface
              description={labels.emptyDescription}
              kind="empty"
              title={labels.emptyTitle}
            />
          ) : (
            reasons.map((reason) => (
              <ReasonRow
                key={reason.id}
                labels={labels}
                onReasonAction={onReasonAction}
                reason={reason}
              />
            ))
          )}
          {archivedReasons.length > 0 ? (
            <div>
              <SettingsCollapsed defaultOpen={false} title={labels.archived}>
                {archivedReasons.map((reason) => (
                  <ReasonRow
                    archived
                    key={reason.id}
                    labels={labels}
                    onReasonAction={onReasonAction}
                    reason={reason}
                  />
                ))}
              </SettingsCollapsed>
            </div>
          ) : null}
        </SettingsSection>
      )}
    </div>
  )
}
