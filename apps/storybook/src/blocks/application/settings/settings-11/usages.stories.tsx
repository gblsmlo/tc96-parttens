import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings11 } from '@tc96/blocks/application/settings/settings-11'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings11Handlers } from '../../../../mocks/settings-11.ts'
import {
  type Settings11Wire,
  toSettings11Groups,
} from '../fixtures/settings-11.ts'
import { settings11ControlArgs } from './settings-11-controls.ts'
import { ComposedSettings11 } from './settings-11-layouts.tsx'

const WorkspaceStatuses = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Settings11Wire[]>('/settings/statuses'),
    queryKey: ['settings', 'statuses'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings11
        {...settings11ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
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
  tags: ['!autodocs', 'msw'],
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
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar os status'),
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
    msw.use(settings11Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton =
      await within(canvasElement).findByLabelText('Carregando status')
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
