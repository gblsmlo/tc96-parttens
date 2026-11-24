import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import {
  Settings1,
  type Settings1Props,
} from '@tc96/blocks/application/settings/settings-1'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings1Handlers } from '../../../../mocks/settings-1.ts'

type Settings1Account = Pick<
  Settings1Props,
  'avatarInitials' | 'email' | 'fields' | 'sessionCount'
>

const AccountSettings = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings1Account>('/settings/account'),
    queryKey: ['settings', 'account'],
  })

  if (isPending) return <Spinner aria-label="Carregando conta" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar a conta</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
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
  tags: ['!autodocs'],
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
    await expect(canvas.getByRole('textbox', { name: 'E-mail' })).toHaveValue(
      'ana@acme.com',
    )
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings1Handlers.error)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar a conta',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings1Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando conta'),
    ).toBeVisible()
  },
}
