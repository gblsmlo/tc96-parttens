import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings11 } from '@tc96/blocks/application/settings/settings-11'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings11Handlers } from '../../../../mocks/settings-11.ts'
import {
  type Settings11Wire,
  toSettings11Groups,
} from '../fixtures/settings-11.ts'

const WorkspaceStatuses = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings11Wire[]>('/settings/statuses'),
    queryKey: ['settings', 'statuses'],
  })

  if (isPending) return <Spinner aria-label="Carregando status" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar os status</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )

  return (
    <Settings11
      groups={toSettings11Groups(data)}
      onCreate={fn()}
      onStatusAction={fn()}
    />
  )
}

const meta = {
  component: WorkspaceStatuses,
  parameters: { layout: 'padded' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings11/Usages',
} satisfies Meta<typeof WorkspaceStatuses>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings11Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Em andamento')).toBeVisible()
    await expect(canvas.getByText('Encerrados')).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings11Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os status',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings11Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando status'),
    ).toBeVisible()
  },
}
