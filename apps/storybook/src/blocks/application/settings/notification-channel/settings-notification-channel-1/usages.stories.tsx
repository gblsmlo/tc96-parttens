import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  SettingsNotificationChannel1,
  type SettingsNotificationChannel1Category,
  type SettingsNotificationChannel1Channel,
  type SettingsNotificationChannel1Matrix,
} from '@tc96/ui/blocks/application/settings/notification-channel/settings-notification-channel-1'
import { useEffect, useState } from 'react'
import { fetchJson } from '../../../../../mocks/api.ts'
import { settingsNotificationChannel1Handlers } from '../../../../../mocks/settings-notification-channel-1.ts'
import { settingsNotificationChannel1ControlArgs } from './settings-notification-channel-1-controls.ts'
import { ComposedSettingsNotificationChannel1 } from './settings-notification-channel-1-layouts.tsx'

interface NotificationSettings {
  categories: SettingsNotificationChannel1Category[]
  channels: SettingsNotificationChannel1Channel[]
  matrix: SettingsNotificationChannel1Matrix
}

const NotificationChannels = ({
  data,
}: Readonly<{ data: NotificationSettings }>) => {
  const [matrix, setMatrix] = useState(data.matrix)

  useEffect(() => setMatrix(data.matrix), [data.matrix])

  return (
    <SettingsNotificationChannel1
      categories={data.categories}
      channels={data.channels}
      matrix={matrix}
      onChange={(eventId, channelId, checked) =>
        setMatrix((current) => ({
          ...current,
          [eventId]: { ...current[eventId], [channelId]: checked },
        }))
      }
    />
  )
}

const WorkspaceNotifications = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () =>
      fetchJson<NotificationSettings>('/settings/notification-channels'),
    queryKey: ['settings', 'notification-channels'],
  })

  if (isPending || isError)
    return (
      <ComposedSettingsNotificationChannel1
        {...settingsNotificationChannel1ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return <NotificationChannels data={data} />
}

const meta = {
  component: WorkspaceNotifications,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Notification Channel/Settings1/Usages',
} satisfies Meta<typeof WorkspaceNotifications>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsNotificationChannel1Handlers.notifications)
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsNotificationChannel1Handlers.notificationsEmpty)
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsNotificationChannel1Handlers.notificationsError)
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsNotificationChannel1Handlers.notificationsPending)
  },
}
