import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings14,
  type Settings14Account,
} from '@tc96/blocks/application/settings/settings-14'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { useState } from 'react'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings14Handlers } from '../../../../mocks/settings-14.ts'
import { settings14DefaultAccountId } from '../fixtures/settings-14.ts'

const WorkspaceAccounts = () => {
  const [defaultAccountId, setDefaultAccountId] = useState(
    settings14DefaultAccountId,
  )
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings14Account[]>('/settings/accounts'),
    queryKey: ['settings', 'accounts'],
  })

  if (isPending) return <Spinner aria-label="Carregando contas" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar as contas</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
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
  tags: ['!autodocs'],
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
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar as contas',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings14Handlers.accountsPending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando contas'),
    ).toBeVisible()
  },
}
