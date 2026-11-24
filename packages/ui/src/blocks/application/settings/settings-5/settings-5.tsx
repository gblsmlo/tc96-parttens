import { CameraIcon } from '@phosphor-icons/react'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import { Input } from '@tc96/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@tc96/ui/input-group'
import { SettingsRow } from '@tc96/ui/patterns/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from '@tc96/ui/select'
import { cn } from '@tc96/utils'
import { useState } from 'react'
import { settingsLoadState } from '../shared/settings-load-state'
import { defaultSettings5Labels } from './labels'
import { Settings5Skeleton } from './settings-5-skeleton'
import type { Settings5Props } from './types'

interface AvatarUploadTriggerProps {
  initials: string
  label: string
  onClick?: () => void
}

function AvatarUploadTrigger({
  initials,
  label,
  onClick,
}: Readonly<AvatarUploadTriggerProps>) {
  return (
    <Avatar
      aria-label={label}
      className="group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      onClick={onClick}
      render={<button type="button" />}
    >
      <AvatarFallback>{initials}</AvatarFallback>
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center bg-foreground/64 text-background opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <CameraIcon aria-hidden="true" className="size-4" />
      </span>
    </Avatar>
  )
}

export function Settings5({
  error,
  onRetry,
  pending,
  className,
  initials,
  labels: labelsProp,
  name,
  onDeleteWorkspace,
  onNameCommit,
  onSlugCommit,
  onTimeZoneChange,
  onUploadLogo,
  slug,
  timeZone: timeZoneProp,
  timeZones,
}: Readonly<Settings5Props>) {
  const labels = { ...defaultSettings5Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Settings5Skeleton />,
  })
  const [timeZone, setTimeZone] = useState(timeZoneProp)

  return (
    <div
      className={cn('mx-auto flex w-full max-w-2xl flex-col gap-8', className)}
    >
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>{labels.workspaceTitle}</SettingsSectionTitle>
            <SettingsSectionDescription>
              {labels.workspaceDescription(name)}
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        {loadState ?? (
          <>
            <SettingsRow
              description={labels.logoDescription}
              endSlot={
                <AvatarUploadTrigger
                  initials={initials}
                  label={labels.uploadLogo}
                  onClick={onUploadLogo}
                />
              }
              title={labels.logoTitle}
            />
            <SettingsRow
              endSlot={
                <Input
                  aria-label={labels.nameLabel}
                  className="w-64"
                  defaultValue={name}
                  onBlur={(event) => onNameCommit?.(event.currentTarget.value)}
                />
              }
              title={labels.nameLabel}
            />
            <SettingsRow
              description={labels.urlDescription}
              endSlot={
                <InputGroup className="w-64">
                  <InputGroupAddon>
                    <InputGroupText>{labels.urlPrefix}</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    aria-label={labels.urlLabel}
                    defaultValue={slug}
                    onBlur={(event) =>
                      onSlugCommit?.(event.currentTarget.value)
                    }
                  />
                </InputGroup>
              }
              title={labels.urlLabel}
            />
            <SettingsRow
              description={labels.timeZoneDescription}
              endSlot={
                <Select
                  items={timeZones}
                  onValueChange={(next) => {
                    if (!next) return
                    setTimeZone(next)
                    onTimeZoneChange?.(next)
                  }}
                  value={timeZone}
                >
                  <SelectTrigger
                    aria-label={labels.timeZoneLabel}
                    className="w-64"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectPopup>
                    {timeZones.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectPopup>
                </Select>
              }
              title={labels.timeZoneLabel}
            />
          </>
        )}
      </SettingsSection>
      {loadState ? null : (
        <SettingsSection
          header={
            <SettingsSectionHeader>
              <SettingsSectionTitle>{labels.dangerTitle}</SettingsSectionTitle>
            </SettingsSectionHeader>
          }
        >
          <SettingsRow
            description={labels.deleteDescription}
            endSlot={
              <Button
                onClick={onDeleteWorkspace}
                size="sm"
                variant="destructive"
              >
                {labels.deleteWorkspace}
              </Button>
            }
            title={labels.deleteTitle}
          />
        </SettingsSection>
      )}
    </div>
  )
}
