import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings1 } from '@tc96/ui/blocks/application/settings/settings-1'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import { settings1Account, settings1Fields } from '../fixtures/settings-1.ts'
import {
  type Settings1Controls,
  settings1ControlArgs,
} from './settings-1-controls.ts'
import { ComposedSettings1 } from './settings-1-layouts.tsx'

type Settings1Spies = {
  onDeleteAccount: () => void
  onEmailSubmit: (email: string) => void
  onFieldCommit: (fieldId: string, value: string) => void
  onSignOutEverywhere: () => void
  onUploadAvatar: () => void
}

const retryHandler = fn()

const meta = {
  args: {
    ...settings1ControlArgs,
    onDeleteAccount: fn(),
    onEmailSubmit: fn(),
    onFieldCommit: fn(),
    onSignOutEverywhere: fn(),
    onUploadAvatar: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings1 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings1/Behavior',
} satisfies Meta<Settings1Controls & Settings1Spies>

export default meta

type Story = StoryObj<typeof meta>

export const EmailSubmitCallsOnEmailSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'E-mail' })
    await userEvent.clear(input)
    await userEvent.type(input, 'nova@acme.com')
    await userEvent.click(canvas.getByRole('button', { name: 'Salvar' }))
    await waitFor(() =>
      expect(args.onEmailSubmit).toHaveBeenCalledWith('nova@acme.com'),
    )
  },
}

export const SaveStaysDisabledUntilEmailChanges: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'E-mail' })
    await expect(canvas.getByRole('button', { name: 'Salvar' })).toBeDisabled()
    await userEvent.type(input, 'outra@acme.com')
    await expect(canvas.getByRole('button', { name: 'Salvar' })).toBeEnabled()
  },
}

export const InvalidEmailShowsErrorAndSkipsSubmit: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'E-mail' })
    await userEvent.clear(input)
    await userEvent.type(input, 'sem-arroba')
    await userEvent.click(canvas.getByRole('button', { name: 'Salvar' }))
    await expect(
      await canvas.findByText('Informe um e-mail válido.'),
    ).toBeVisible()
    await expect(args.onEmailSubmit).not.toHaveBeenCalled()
  },
}

export const FieldCommitCallsOnFieldCommit: Story = {
  play: async ({ args, canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Nome de exibição',
    })
    await userEvent.clear(input)
    await userEvent.type(input, 'Ana Souza')
    await userEvent.tab()
    await waitFor(() =>
      expect(args.onFieldCommit).toHaveBeenCalledWith(
        'display-name',
        'Ana Souza',
      ),
    )
  },
}

export const AvatarButtonCallsOnUploadAvatar: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Enviar avatar' }),
    )
    await expect(args.onUploadAvatar).toHaveBeenCalledOnce()
  },
}

export const SignOutButtonCallsOnSignOutEverywhere: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Sair de todos os dispositivos',
      }),
    )
    await expect(args.onSignOutEverywhere).toHaveBeenCalledOnce()
  },
}

export const DeleteButtonCallsOnDeleteAccount: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Excluir conta' }),
    )
    await expect(args.onDeleteAccount).toHaveBeenCalledOnce()
  },
}

export const ActionsNeedTheirCallbacks: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Sair de todos os dispositivos' }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Excluir conta' }),
    ).toBeNull()
    await expect(canvas.getByRole('button', { name: 'Salvar' })).toBeVisible()
  },
}

export const SessionsDescriptionCountsDevices: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Conectado em 2 dispositivos'),
    ).toBeVisible()
  },
}

export const SingleSessionUsesSingularWord: Story = {
  args: { sessionCount: 1 },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Conectado em 1 dispositivo'),
    ).toBeVisible()
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <Settings1
      avatarInitials={settings1Account.avatarInitials}
      email={settings1Account.email}
      fields={settings1Fields}
      labels={{
        deleteAccount: 'Apagar conta',
        emailSave: 'Atualizar',
        profileTitle: 'Perfil público',
        sessionsDescription: (count) => `${count} sessões ativas`,
      }}
      onDeleteAccount={args.onDeleteAccount}
      onEmailSubmit={args.onEmailSubmit}
      onFieldCommit={args.onFieldCommit}
      onSignOutEverywhere={args.onSignOutEverywhere}
      onUploadAvatar={args.onUploadAvatar}
      sessionCount={settings1Account.sessionCount}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Perfil público')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Atualizar' }),
    ).toBeVisible()
    await expect(canvas.getByText('2 sessões ativas')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Apagar conta' }),
    ).toBeVisible()
    await expect(canvas.queryByText('Perfil', { exact: true })).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettings1 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando conta'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettings1 {...args} error onRetry={retryHandler} />
  ),
  play: async ({ canvasElement }) => {
    retryHandler.mockClear()
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toHaveAttribute(
      'data-kind',
      'error',
    )
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tentar novamente' }),
    )
    await expect(retryHandler).toHaveBeenCalledOnce()
  },
}

export const ErrorWithoutOnRetryHasNoButton: Story = {
  render: (args) => <ComposedSettings1 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings1 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando conta')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}
