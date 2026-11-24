import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings20,
  type Settings20Category,
  type Settings20Channel,
  type Settings20Matrix,
} from '@tc96/blocks/application/settings/settings-20'
import { useEffect, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings20Handlers } from '../../../../mocks/settings-20.ts'
import { settings20ControlArgs } from './settings-20-controls.ts'
import { ComposedSettings20 } from './settings-20-layouts.tsx'

interface NotificationSettings {
  categories: Settings20Category[]
  channels: Settings20Channel[]
  matrix: Settings20Matrix
}

const NotificationChannels = ({
  data,
}: Readonly<{ data: NotificationSettings }>) => {
  const [matrix, setMatrix] = useState(data.matrix)

  useEffect(() => setMatrix(data.matrix), [data.matrix])

  return (
    <Settings20
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
      <ComposedSettings20
        {...settings20ControlArgs}
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
  title: 'Blocks/Application/Settings/Settings20/Usages',
} satisfies Meta<typeof WorkspaceNotifications>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings20Handlers.notifications)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const box = await canvas.findByRole('checkbox', {
      name: 'Lead mudou de etapa por Push',
    })
    await expect(box).not.toBeChecked()
    await userEvent.click(box)
    await expect(box).toBeChecked()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings20Handlers.notificationsEmpty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum evento de notificação'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings20Handlers.notificationsError)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as notificações'),
    ).toBeVisible()
    const retry = canvas.getByRole('button', { name: 'Tentar novamente' })
    await expect(retry).toBeEnabled()
    await userEvent.click(retry)
    await expect(await canvas.findByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings20Handlers.notificationsPending)
  },
  play: async ({ canvasElement }) => {
    const skeleton = await within(canvasElement).findByLabelText(
      'Carregando notificações',
    )
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
