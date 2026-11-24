import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings21,
  type Settings21App,
} from '@tc96/blocks/application/settings/settings-21'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { useEffect, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings21Handlers } from '../../../../mocks/settings-21.ts'

const ConnectedApps = ({ initial }: Readonly<{ initial: Settings21App[] }>) => {
  const [apps, setApps] = useState(initial)

  useEffect(() => setApps(initial), [initial])

  const setStatus = (appId: string, status: Settings21App['status']) =>
    setApps((current) =>
      current.map((app) => (app.id === appId ? { ...app, status } : app)),
    )

  return (
    <Settings21
      apps={apps}
      onConnect={(appId) => setStatus(appId, 'connected')}
      onDisconnect={(appId) => setStatus(appId, 'disconnected')}
    />
  )
}

const WorkspaceApps = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings21App[]>('/settings/connected-apps'),
    queryKey: ['settings', 'connected-apps'],
  })

  if (isPending) return <Spinner aria-label="Carregando aplicativos" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar os aplicativos</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return <ConnectedApps initial={data} />
}

const meta = {
  component: WorkspaceApps,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings21/Usages',
} satisfies Meta<typeof WorkspaceApps>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings21Handlers.apps)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Conectar Slack' }),
    )
    await expect(
      await canvas.findByRole('button', { name: 'Desconectar Slack' }),
    ).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings21Handlers.appsEmpty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum aplicativo disponível'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings21Handlers.appsError)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os aplicativos',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings21Handlers.appsPending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando aplicativos'),
    ).toBeVisible()
  },
}
