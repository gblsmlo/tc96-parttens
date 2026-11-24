import type { Meta, StoryObj } from '@storybook/react-vite'
import { Settings6 } from '@tc96/blocks/application/settings/settings-6'
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test'
import { roles, seats, team } from '../fixtures/settings-6.ts'
import {
  type Settings6Controls,
  settings6ControlArgs,
} from './settings-6-controls.ts'
import { ComposedSettings6 } from './settings-6-layouts.tsx'

const retryHandler = fn()

const meta = {
  args: {
    ...settings6ControlArgs,
    onInvitationAction: fn(),
    onInvite: fn(),
    onMemberAction: fn(),
    onRoleChange: fn(),
  },
  parameters: { layout: 'padded' },
  render: (args) => <ComposedSettings6 {...args} />,
  tags: ['!autodocs'],
  title: 'Blocks/Application/Settings/Settings6/Behavior',
} satisfies Meta<
  Settings6Controls & {
    onInvitationAction: (invitationId: string, action: string) => void
    onInvite: () => void
    onMemberAction: (memberId: string, action: string) => void
    onRoleChange: (memberId: string, role: string) => void
  }
>

export default meta

type Story = StoryObj<typeof meta>

export const InviteButtonCallsOnInvite: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', { name: 'Convidar membros' }),
    )
    await expect(args.onInvite).toHaveBeenCalledOnce()
  },
}

export const RoleChangeCallsOnRoleChange: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('combobox', {
        name: 'Papel de Bruno Costa',
      }),
    )
    await userEvent.click(
      await screen.findByRole('option', { name: 'Administrador' }),
    )
    await waitFor(() =>
      expect(args.onRoleChange).toHaveBeenCalledWith('m2', 'admin'),
    )
    await waitFor(() => expect(screen.queryByRole('listbox')).toBeNull())
  },
}

export const MemberMenuCallsOnMemberAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de Bruno Costa',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Remover do workspace',
    ])
    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Remover do workspace' }),
    )
    await waitFor(() =>
      expect(args.onMemberAction).toHaveBeenCalledWith('m2', 'remove'),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const OwnerRowHasNoRoleSelectOrMenu: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Proprietário')).toBeVisible()
    await expect(
      canvas.queryByRole('combobox', { name: 'Papel de Ana Ribeiro' }),
    ).toBeNull()
    await expect(
      canvas.queryByRole('button', { name: 'Ações de Ana Ribeiro' }),
    ).toBeNull()
  },
}

export const InvitationMenuCallsOnInvitationAction: Story = {
  play: async ({ args, canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole('button', {
        name: 'Ações de diego@acme.com',
      }),
    )
    const items = await screen.findAllByRole('menuitem')
    await expect(items.map((item) => item.textContent)).toEqual([
      'Reenviar convite',
      'Revogar convite',
    ])
    await userEvent.click(
      screen.getByRole('menuitem', { name: 'Revogar convite' }),
    )
    await waitFor(() =>
      expect(args.onInvitationAction).toHaveBeenCalledWith('i1', 'revoke'),
    )
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull())
  },
}

export const WithoutActionsHidesInviteAndMenus: Story = {
  args: { withActions: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('button', { name: 'Convidar membros' }),
    ).toBeNull()
    await expect(canvas.queryByRole('button', { name: /^Ações de/ })).toBeNull()
  },
}

export const WithoutInvitationsHidesSection: Story = {
  args: { withInvitations: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.queryByText('Convites pendentes')).toBeNull()
    await expect(canvas.queryByText('diego@acme.com')).toBeNull()
  },
}

export const SeatsDescriptionShowsPlanUsage: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        `${team.members.length} de ${seats.limit} vagas usadas no plano ${seats.plan}.`,
      ),
    ).toBeVisible()
  },
}

export const WithoutSeatsHidesPlanUsage: Story = {
  args: { withSeats: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByText(/vagas usadas/)).toBeNull()
  },
}

export const LabelsOverrideTexts: Story = {
  render: (args) => (
    <Settings6
      invitations={team.invitations}
      labels={{
        invite: 'Adicionar pessoa',
        pending: 'Aguardando',
        title: 'Equipe',
      }}
      members={team.members}
      onInvitationAction={args.onInvitationAction}
      onInvite={args.onInvite}
      onMemberAction={args.onMemberAction}
      onRoleChange={args.onRoleChange}
      roles={roles}
      seats={seats}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('Equipe')).toBeVisible()
    await expect(
      canvas.getByRole('button', { name: 'Adicionar pessoa' }),
    ).toBeVisible()
    await expect(canvas.getByText('Aguardando')).toBeVisible()
    await expect(canvas.queryByText('Membros')).toBeNull()
  },
}

export const PendingShowsSkeleton: Story = {
  render: (args) => <ComposedSettings6 {...args} pending />,
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByLabelText('Carregando membros'),
    ).toHaveAttribute('aria-busy', 'true')
    await expect(
      canvasElement.querySelector('[data-slot="settings-row"], table'),
    ).toBeNull()
  },
}

export const ErrorRetryCallsOnRetry: Story = {
  render: (args) => (
    <ComposedSettings6 {...args} error onRetry={retryHandler} />
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
  render: (args) => <ComposedSettings6 {...args} error />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('alert')).toBeVisible()
    await expect(
      canvas.queryByRole('button', { name: 'Tentar novamente' }),
    ).toBeNull()
  },
}

export const PendingWinsOverError: Story = {
  render: (args) => <ComposedSettings6 {...args} error pending />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando membros')).toHaveAttribute(
      'aria-busy',
      'true',
    )
    await expect(canvas.queryByRole('alert')).toBeNull()
  },
}
