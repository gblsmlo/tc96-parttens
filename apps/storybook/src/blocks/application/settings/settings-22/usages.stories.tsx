import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings22,
  type Settings22Key,
} from '@tc96/blocks/application/settings/settings-22'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings22Handlers } from '../../../../mocks/settings-22.ts'

const WorkspaceApiKeys = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings22Key[]>('/settings/api-keys'),
    queryKey: ['settings', 'api-keys'],
  })

  if (isPending) return <Spinner aria-label="Carregando chaves" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar as chaves</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return (
    <Settings22
      keys={data}
      onActiveChange={fn()}
      onCopy={fn()}
      onCreate={fn()}
      onKeyAction={fn()}
    />
  )
}

const meta = {
  component: WorkspaceApiKeys,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings22/Usages',
} satisfies Meta<typeof WorkspaceApiKeys>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings22Handlers.keys)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Integração CRM')).toBeVisible()
    await expect(canvas.getByText('sk_live_••••4f2a')).toBeVisible()
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings22Handlers.keysEmpty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma chave ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings22Handlers.keysError)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as chaves',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings22Handlers.keysPending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando chaves'),
    ).toBeVisible()
  },
}
