import { SettingsCollapsed } from '@tc96/parttens/surfaces/settings/composition/settings-collapsed/settings-collapsed'
import { SettingsRow } from '@tc96/parttens/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/parttens/surfaces/settings/composition/settings-section/settings-section-header'
import { StateSurface } from '@tc96/parttens/surfaces/state/composition/state-surface/state-surface'
import { Button } from '@tc96/ui/button'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import { SettingsRowActions } from '../shared/settings-row-actions'
import { defaultSettings13Labels } from './labels'
import type {
  Settings13Action,
  Settings13Labels,
  Settings13Props,
  Settings13Reason,
} from './types'

interface ReasonRowProps {
  archived?: boolean
  labels: Settings13Labels
  onReasonAction?: Settings13Props['onReasonAction']
  reason: Settings13Reason
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
              onReasonAction(reason.id, action as Settings13Action)
            }
          />
        ) : undefined
      }
      title={reason.name}
    />
  )
}

export function Settings13({
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
}: Readonly<Settings13Props>) {
  const labels = { ...defaultSettings13Labels, ...labelsProp }

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
      </SettingsSection>
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
    </div>
  )
}
