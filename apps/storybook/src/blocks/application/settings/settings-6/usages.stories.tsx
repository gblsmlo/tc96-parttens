import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Settings6 } from '@tc96/blocks/application/settings/settings-6'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Spinner } from '@tc96/ui/spinner'
import { expect, fn, within } from 'storybook/test'
import { fetchJson } from '../../../../mocks/api.ts'
import { settings6Handlers } from '../../../../mocks/settings-6.ts'
import { roles, type Settings6Team, seats } from '../fixtures/settings-6.ts'

const TeamMembers = () => {
  const { data, error, isPending } = useQuery({
    queryFn: () => fetchJson<Settings6Team>('/settings/members'),
    queryKey: ['settings', 'members'],
  })

  if (isPending) return <Spinner aria-label="Carregando membros" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar os membros</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
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
  tags: ['!autodocs'],
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
    await expect(
      await within(canvasElement).findByText(
        'Não foi possível carregar os membros',
      ),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settings6Handlers.pending)
  },
  play: async ({ canvasElement }) => {
    await expect(
      await within(canvasElement).findByLabelText('Carregando membros'),
    ).toBeVisible()
  },
}
