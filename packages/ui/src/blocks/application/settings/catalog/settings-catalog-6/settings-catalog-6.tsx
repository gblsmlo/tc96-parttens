import {
  CalendarBlankIcon,
  EnvelopeSimpleIcon,
  FileTextIcon,
  type Icon,
  PhoneIcon,
  RepeatIcon,
} from '@phosphor-icons/react'
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
import { Text } from '@tc96/ui/text'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../../shared/settings-load-state'
import { SettingsRowActions } from '../../shared/settings-row-actions'
import { defaultSettingsCatalog6Labels } from './labels'
import { SettingsCatalog6Skeleton } from './settings-catalog-6-skeleton'
import type {
  SettingsCatalog6Action,
  SettingsCatalog6ActionType,
  SettingsCatalog6Props,
} from './types'

const actionTypeIcons: Record<SettingsCatalog6ActionType, Icon> = {
  call: PhoneIcon,
  email: EnvelopeSimpleIcon,
  'follow-up': RepeatIcon,
  meeting: CalendarBlankIcon,
  proposal: FileTextIcon,
}

export function SettingsCatalog6({
  error,
  onRetry,
  pending,
  blockStageChanges = false,
  className,
  labels: labelsProp,
  onBlockStageChangesChange,
  onCreate,
  onNextActionAction,
  onRequiredChange,
  stages,
}: Readonly<SettingsCatalog6Props>) {
  const labels = { ...defaultSettingsCatalog6Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsCatalog6Skeleton />,
  })
  const actions = [
    { id: 'edit', label: labels.edit },
    { destructive: true, id: 'delete', label: labels.delete },
  ]

  return (
    <div
      className={cn('mx-auto flex w-full max-w-2xl flex-col gap-8', className)}
    >
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>{labels.gatesTitle}</SettingsSectionTitle>
          </SettingsSectionHeader>
        }
      >
        {loadState ?? (
          <SettingsRow
            description={labels.blockStageChangesDescription}
            endSlot={
              <Switch
                aria-label={labels.blockStageChanges}
                checked={blockStageChanges}
                onCheckedChange={onBlockStageChangesChange}
              />
            }
            title={labels.blockStageChanges}
          />
        )}
      </SettingsSection>
      {loadState ? null : (
        <SettingsSection
          header={
            <SettingsSectionHeader
              actions={
                onCreate ? (
                  <Button onClick={onCreate} size="sm">
                    {labels.newAction}
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
          {stages.length === 0 ? (
            <StateSurface
              description={labels.emptyDescription}
              kind="empty"
              title={labels.emptyTitle}
            />
          ) : (
            <div>
              {stages.map((stage) => (
                <SettingsCollapsed
                  key={stage.id}
                  title={labels.leaving(stage.name)}
                >
                  {stage.actions.length === 0 ? (
                    <Text
                      foreground="muted"
                      render={<p className="py-3" />}
                      size="sm"
                    >
                      {labels.emptyStage}
                    </Text>
                  ) : (
                    stage.actions.map((action) => {
                      const ActionIcon = actionTypeIcons[action.type]

                      return (
                        <SettingsRow
                          description={labels.actionType(action.type)}
                          endSlot={
                            <>
                              <Switch
                                aria-label={labels.required(action.title)}
                                checked={action.required}
                                onCheckedChange={(checked) =>
                                  onRequiredChange?.(action.id, checked)
                                }
                              />
                              {onNextActionAction ? (
                                <SettingsRowActions
                                  actions={actions}
                                  label={labels.actions(action.title)}
                                  onAction={(item) =>
                                    onNextActionAction(
                                      action.id,
                                      item as SettingsCatalog6Action,
                                    )
                                  }
                                />
                              ) : null}
                            </>
                          }
                          key={action.id}
                          startSlot={
                            <ActionIcon
                              aria-hidden="true"
                              className="text-muted-foreground"
                            />
                          }
                          title={action.title}
                        />
                      )
                    })
                  )}
                </SettingsCollapsed>
              ))}
            </div>
          )}
        </SettingsSection>
      )}
    </div>
  )
}
