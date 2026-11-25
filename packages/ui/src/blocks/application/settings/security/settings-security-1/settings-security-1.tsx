import { Badge } from '@tc96/ui/badge'
import { Button } from '@tc96/ui/button'
import { SettingsRow } from '@tc96/ui/patterns/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
import { Switch } from '@tc96/ui/switch'
import { cn } from '@tc96/utils'
import { settingsLoadState } from '../../shared/settings-load-state'
import { defaultSettingsSecurity1Labels } from './labels'
import { SettingsSecurity1Skeleton } from './settings-security-1-skeleton'
import type {
  SettingsSecurity1Control,
  SettingsSecurity1Labels,
  SettingsSecurity1Props,
} from './types'

interface ControlRowProps {
  control: SettingsSecurity1Control
  labels: SettingsSecurity1Labels
  onAction?: SettingsSecurity1Props['onAction']
  onCheckedChange?: SettingsSecurity1Props['onCheckedChange']
}

function ControlRow({
  control,
  labels,
  onAction,
  onCheckedChange,
}: Readonly<ControlRowProps>) {
  const isAction = control.actionLabel !== undefined

  return (
    <SettingsRow
      description={control.description}
      endSlot={
        <div className="flex items-center gap-3">
          {control.plan ? (
            <Badge variant={control.plan === 'pro' ? 'info' : 'warning'}>
              {labels[control.plan]}
            </Badge>
          ) : null}
          {isAction ? (
            onAction ? (
              <Button
                onClick={() => onAction(control.id)}
                size="sm"
                variant="outline"
              >
                {control.actionLabel}
              </Button>
            ) : null
          ) : (
            <Switch
              aria-label={control.title}
              checked={control.checked ?? false}
              onCheckedChange={(next) => onCheckedChange?.(control.id, next)}
            />
          )}
        </div>
      }
      title={control.title}
    />
  )
}

export function SettingsSecurity1({
  error,
  onRetry,
  pending,
  className,
  controls,
  labels: labelsProp,
  onAction,
  onCheckedChange,
}: Readonly<SettingsSecurity1Props>) {
  const labels = { ...defaultSettingsSecurity1Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <SettingsSecurity1Skeleton />,
  })

  return (
    <SettingsSection
      className={cn('mx-auto w-full max-w-2xl', className)}
      header={
        <SettingsSectionHeader>
          <SettingsSectionTitle>{labels.title}</SettingsSectionTitle>
          <SettingsSectionDescription>
            {labels.description}
          </SettingsSectionDescription>
        </SettingsSectionHeader>
      }
    >
      {loadState ??
        controls.map((control) => (
          <ControlRow
            control={control}
            key={control.id}
            labels={labels}
            onAction={onAction}
            onCheckedChange={onCheckedChange}
          />
        ))}
    </SettingsSection>
  )
}
