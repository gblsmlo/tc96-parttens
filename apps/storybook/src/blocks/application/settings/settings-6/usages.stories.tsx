import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings6 } from '@tc96/ui/blocks/application/settings/settings-6'
import { expect, fn, userEvent, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings6Handlers } from '../../../../mocks/settings-6.ts'
import { roles, type Settings6Team, seats } from '../fixtures/settings-6.ts'
import { settings6ControlArgs } from './settings-6-controls.ts'
import { ComposedSettings6 } from './settings-6-layouts.tsx'

const TeamMembers = () => {
  const { data, isError, isPending, refetch } = useQuery({
    queryFn: () => fetchJson<Settings6Team>('/settings/members'),
    queryKey: ['settings', 'members'],
  })

  if (isPending || isError)
    return (
      <ComposedSettings6
        {...settings6ControlArgs}
        error={isError}
        onRetry={refetch}
        pending={isPending}
      />
    )

  return (
    <Settings6
      invitations={data.invitations}
      members={data.members}
      onInvitationAction={fn()}
      onInvite={fn()}
      onMemberAction={fn()}
      onRoleChange={fn()}
      roles={roles}
      seats={seats}
    />
  )
}

const meta = {
  component: TeamMembers,
  parameters: { layout: 'padded' },
  tags: ['!autodocs', 'msw'],
  title: 'Blocks/Application/Settings/Settings6/Usages',
} satisfies Meta<typeof TeamMembers>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings6Handlers.loaded)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Ana Ribeiro')).toBeVisible()
    await expect(canvas.getByText('diego@acme.com')).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings6Handlers.error)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar os membros'),
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
    msw.use(settings6Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    const skeleton =
      await within(canvasElement).findByLabelText('Carregando membros')
    await expect(skeleton).toHaveAttribute('aria-busy', 'true')
  },
}
