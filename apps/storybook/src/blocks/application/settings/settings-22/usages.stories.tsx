import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings22,
  type Settings22Key,
} from '@tc96/blocks/application/settings/settings-22'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings22Handlers } from '../../../../mocks/settings-22.ts'
import { settings22ControlArgs } from './settings-22-controls.ts'
import { ComposedSettings22 } from './settings-22-layouts.tsx'

const WorkspaceApiKeys = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Settings22Key[]>('/settings/api-keys'),
    queryKey: ['settings', 'api-keys'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings22
        {...settings22ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
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
  tags: ['!autodocs', 'msw'],
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
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as chaves'),
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
    msw.use(settings22Handlers.keysPending)
  },
  play: async ({ canvasElement }) => {
    const skeleton =
      await within(canvasElement).findByLabelText('Carregando chaves')
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
