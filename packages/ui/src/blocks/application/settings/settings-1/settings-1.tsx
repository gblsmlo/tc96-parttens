import { CameraIcon } from '@phosphor-icons/react'
import { useForm } from '@tanstack/react-form'
import { Avatar, AvatarFallback } from '@tc96/ui/avatar'
import { Button } from '@tc96/ui/button'
import { Field, FieldError } from '@tc96/ui/field'
import { Input } from '@tc96/ui/input'
import { SettingsRow } from '@tc96/ui/patterns/surfaces/settings/composition/settings-row/settings-row'
import { SettingsSection } from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section'
import {
  SettingsSectionDescription,
  SettingsSectionHeader,
  SettingsSectionTitle,
} from '@tc96/ui/patterns/surfaces/settings/composition/settings-section/settings-section-header'
import { cn } from '@tc96/utils'
import { useState } from 'react'
import { settingsLoadState } from '../shared/settings-load-state'
import { defaultSettings1Labels } from './labels'
import { Settings1Skeleton } from './settings-1-skeleton'
import type { Settings1Labels, Settings1Props } from './types'

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

interface EmailFormProps {
  defaultEmail: string
  labels: Settings1Labels
  onSubmit?: (email: string) => void
}

function EmailForm({
  defaultEmail,
  labels,
  onSubmit,
}: Readonly<EmailFormProps>) {
  const [savedEmail, setSavedEmail] = useState(defaultEmail)
  const form = useForm({
    defaultValues: { email: defaultEmail },
    onSubmit: ({ value }) => {
      const next = value.email.trim()
      onSubmit?.(next)
      setSavedEmail(next)
      form.reset({ email: next })
    },
  })

  return (
    <form
      className="flex items-start gap-3"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.Field
        name="email"
        validators={{
          onSubmit: ({ value }) =>
            /^\S+@\S+\.\S+$/.test(value.trim())
              ? undefined
              : labels.emailInvalid,
        }}
      >
        {(field) => (
          <Field invalid={field.state.meta.errors.length > 0} name={field.name}>
            <Input
              aria-label={labels.emailLabel}
              className="w-56"
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(event.currentTarget.value)
              }
              type="email"
              value={field.state.value}
            />
            <FieldError match={field.state.meta.errors.length > 0}>
              {field.state.meta.errors.join(' ')}
            </FieldError>
          </Field>
        )}
      </form.Field>
      <form.Subscribe selector={(state) => state.values.email}>
        {(email) => (
          <Button
            disabled={email.trim() === savedEmail}
            size="sm"
            type="submit"
            variant="outline"
          >
            {labels.emailSave}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}

export function Settings1({
  error,
  onRetry,
  pending,
  avatarInitials,
  className,
  email,
  fields,
  labels: labelsProp,
  onDeleteAccount,
  onEmailSubmit,
  onFieldCommit,
  onSignOutEverywhere,
  onUploadAvatar,
  sessionCount,
}: Readonly<Settings1Props>) {
  const labels = { ...defaultSettings1Labels, ...labelsProp }
  const loadState = settingsLoadState({
    error,
    labels,
    onRetry,
    pending,
    skeleton: <Settings1Skeleton />,
  })

  return (
    <div
      className={cn('mx-auto flex w-full max-w-2xl flex-col gap-8', className)}
    >
      <SettingsSection
        header={
          <SettingsSectionHeader>
            <SettingsSectionTitle>{labels.profileTitle}</SettingsSectionTitle>
            <SettingsSectionDescription>
              {labels.profileDescription}
            </SettingsSectionDescription>
          </SettingsSectionHeader>
        }
      >
        {loadState ?? (
          <>
            <SettingsRow
              description={labels.avatarDescription}
              endSlot={
                <AvatarUploadTrigger
                  initials={avatarInitials}
                  label={labels.uploadAvatar}
                  onClick={onUploadAvatar}
                />
              }
              title={labels.avatarTitle}
            />
            {fields.map((field) => (
              <SettingsRow
                description={field.description}
                endSlot={
                  <Input
                    aria-label={field.label}
                    className="w-56"
                    defaultValue={field.value}
                    onBlur={(event) =>
                      onFieldCommit?.(field.id, event.currentTarget.value)
                    }
                  />
                }
                key={field.id}
                title={field.label}
              />
            ))}
          </>
        )}
      </SettingsSection>
      {loadState ? null : (
        <SettingsSection
          header={
            <SettingsSectionHeader>
              <SettingsSectionTitle>{labels.accountTitle}</SettingsSectionTitle>
              <SettingsSectionDescription>
                {labels.accountDescription}
              </SettingsSectionDescription>
            </SettingsSectionHeader>
          }
        >
          <SettingsRow
            description={labels.emailDescription}
            endSlot={
              <EmailForm
                defaultEmail={email}
                labels={labels}
                onSubmit={onEmailSubmit}
              />
            }
            title={labels.emailTitle}
          />
          <SettingsRow
            description={labels.sessionsDescription(sessionCount)}
            endSlot={
              onSignOutEverywhere ? (
                <Button
                  onClick={onSignOutEverywhere}
                  size="sm"
                  variant="outline"
                >
                  {labels.signOutEverywhere}
                </Button>
              ) : undefined
            }
            title={labels.sessionsTitle}
          />
          <SettingsRow
            description={labels.deleteAccountDescription}
            endSlot={
              onDeleteAccount ? (
                <Button
                  onClick={onDeleteAccount}
                  size="sm"
                  variant="destructive"
                >
                  {labels.deleteAccount}
                </Button>
              ) : undefined
            }
            title={labels.deleteAccountTitle}
          />
        </SettingsSection>
      )}
    </div>
  )
}
