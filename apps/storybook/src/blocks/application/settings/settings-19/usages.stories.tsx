import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings19,
  type Settings19Endpoint,
} from '@tc96/blocks/application/settings/settings-19'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings19Handlers } from '../../../../mocks/settings-19.ts'

const EndpointList = ({
  initial,
}: Readonly<{ initial: Settings19Endpoint[] }>) => {
  const [endpoints, setEndpoints] = useState(initial)

  return (
    <Settings19
      endpoints={endpoints}
      onCreate={fn()}
      onEnabledChange={(id, enabled) =>
        setEndpoints((current) =>
          current.map((endpoint) =>
            endpoint.id === id ? { ...endpoint, enabled } : endpoint,
          ),
        )
      }
      onEndpointAction={fn()}
    />
  )
}

const WorkspaceWebhooks = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings19Endpoint[]>('/settings/webhooks'),
    queryKey: ['settings', 'webhooks'],
  })

  if (isPending) return <Spinner aria-label="Carregando webhooks" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar os webhooks</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return <EndpointList initial={data} />
}

const meta = {
  component: WorkspaceWebhooks,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings19/Usages',
} satisfies Meta<typeof WorkspaceWebhooks>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings19Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('https://api.acme.com/hooks/crm'),
    ).toBeVisible()
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Entregas com falha',
    )
    const toggle = canvas.getByRole('switch', {
      name: 'Ativar https://staging.acme.com/hooks',
    })
    await userEvent.click(toggle)
    await expect(toggle).toBeChecked()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings19Handlers.empty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhum endpoint ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings19Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os webhooks',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings19Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando webhooks'),
    ).toBeVisible()
  },
}
