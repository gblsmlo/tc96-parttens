import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings1,
  type Settings1Props,
} from '@tc96/ui/blocks/application/settings/settings-1'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings1Handlers } from '../../../../mocks/settings-1.ts'
import { settings1ControlArgs } from './settings-1-controls.ts'
import { ComposedSettings1 } from './settings-1-layouts.tsx'

type Settings1Account = Pick<
  Settings1Props,
  'avatarInitials' | 'email' | 'fields' | 'sessionCount'
>

const AccountSettings = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Settings1Account>('/settings/account'),
    queryKey: ['settings', 'account'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings1
        {...settings1ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <Settings1
      {...data}
      onDeleteAccount={fn()}
      onEmailSubmit={fn()}
      onFieldCommit={fn()}
      onSignOutEverywhere={fn()}
      onUploadAvatar={fn()}
    />
  )
}

const meta = {
  component: AccountSettings,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Settings1/Usages',
} satisfies Meta<typeof AccountSettings>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings1Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Perfil')).toBeVisible()
    await expect(
      await canvas.findByRole('textbox', { name: 'E-mail' }),
    ).toHaveValue('ana@acme.com')
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings1Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar a conta'),
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
    msw.use(settings1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton =
      await within(canvasElement).findByLabelText('Carregando conta')
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
