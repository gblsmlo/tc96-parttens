import {
  SettingsNotificationChannel1,
  type SettingsNotificationChannel1Matrix,
  type SettingsNotificationChannel1Props,
} from '@tc96/ui/blocks/application/settings/notification-channel/settings-notification-channel-1'
import { useState } from 'react'
import {
  settingsNotificationChannel1Categories,
  settingsNotificationChannel1Channels,
  settingsNotificationChannel1Matrix,
} from '../../fixtures/settings-notification-channel-1.ts'
import type { SettingsNotificationChannel1Controls } from './settings-notification-channel-1-controls.ts'

interface ComposedSettingsNotificationChannel1Props
  extends SettingsNotificationChannel1Controls {
  error?: boolean
  onRetry?: () => void
  pending?: boolean
  onChange?: SettingsNotificationChannel1Props['onChange']
}

export const ComposedSettingsNotificationChannel1 = ({
  error,
  onRetry,
  pending,
  description,
  empty,
  onChange,
  readOnly,
  title,
}: Readonly<ComposedSettingsNotificationChannel1Props>) => {
  const [matrix, setMatrix] = useState<SettingsNotificationChannel1Matrix>(
    settingsNotificationChannel1Matrix,
  )

  return (
    <SettingsNotificationChannel1
      error={error}
      onRetry={onRetry}
      pending={pending}
      categories={empty ? [] : settingsNotificationChannel1Categories}
      channels={settingsNotificationChannel1Channels}
      labels={{ description, title }}
      matrix={matrix}
      onChange={
        readOnly
          ? undefined
          : (eventId, channelId, checked) => {
              setMatrix((current) => ({
                ...current,
                [eventId]: { ...current[eventId], [channelId]: checked },
              }))
              onChange?.(eventId, channelId, checked)
            }
      }
    />
  )
}
