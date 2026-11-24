import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings14,
  type Settings14Account,
} from '@tc96/blocks/application/settings/settings-14'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings14Handlers } from '../../../../mocks/settings-14.ts'
import { settings14DefaultAccountId } from '../fixtures/settings-14.ts'
import { settings14ControlArgs } from './settings-14-controls.ts'
import { ComposedSettings14 } from './settings-14-layouts.tsx'

const WorkspaceAccounts = () => {
  const [defaultAccountId, setDefaultAccountId] = useState(
    settings14DefaultAccountId,
  )
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Settings14Account[]>('/settings/accounts'),
    queryKey: ['settings', 'accounts'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings14
        {...settings14ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <Settings14
      accounts={data}
      defaultAccountId={defaultAccountId}
      onAccountAction={(accountId, action) => {
        if (action === 'make-default') setDefaultAccountId(accountId)
      }}
      onCreate={fn()}
    />
  )
}

const meta = {
  component: WorkspaceAccounts,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Settings14/Usages',
} satisfies Meta<typeof WorkspaceAccounts>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings14Handlers.accounts)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Itaú corrente')).toBeVisible()
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ações de Nubank PJ' }),
    )
    await userEvent.click(
      await screen.findByRole('menuitem', { name: 'Tornar padrão' }),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
    await userEvent.click(
      canvas.getByRole('button', { name: 'Ações de Itaú corrente' }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Editar',
      'Tornar padrão',
      'Arquivar',
    ])
  },
}

export const Empty: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings14Handlers.accountsEmpty)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText('Nenhuma conta ainda'),
    ).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings14Handlers.accountsError)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar as contas'),
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
    msw.use(settings14Handlers.accountsPending)
  },
  play: async ({ canvasElement }) => {
    const skeleton =
      await within(canvasElement).findByLabelText('Carregando contas')
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
