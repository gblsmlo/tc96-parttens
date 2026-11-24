import type { Meta, StoryObj } from '@storybook/react-vite'
import { useQuery } from '@tanstack/react-query'
import { Alert, AlertDescription, AlertTitle } from '@tc96/ui/alert'
import { Empty, EmptyHeader, EmptyTitle } from '@tc96/ui/empty'
import { Spinner } from '@tc96/ui/spinner'
import { Text } from '@tc96/ui/text'
import { expect, within } from 'storybook/test'
import { fetchJson } from '../mocks/api.ts'
import { settingsHandlers, type WorkspaceMember } from '../mocks/settings.ts'

const MembersList = () => {
  const { data, error, isPending } = useQuery({
    queryKey: ['settings', 'members'],
    queryFn: () => fetchJson<WorkspaceMember[]>('/settings/members'),
  })

  if (isPending) return <Spinner aria-label="Carregando membros" />
  if (error)
    return (
      <Alert variant="error">
        <AlertTitle>Não foi possível carregar os membros</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  if (data.length === 0)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Nenhum membro ainda</EmptyTitle>
        </EmptyHeader>
      </Empty>
    )

  return (
    <ul aria-label="Membros" className="flex w-80 flex-col gap-2">
      {data.map((member) => (
        <li className="flex flex-col" key={member.id}>
          <Text>{member.name}</Text>
          <Text foreground="muted" size="sm">
            {member.email} · {member.role}
          </Text>
        </li>
      ))}
    </ul>
  )
}

const meta = {
  title: 'Get Started/Data Mocking',
  component: MembersList,
  tags: ['!autodocs'],
} satisfies Meta<typeof MembersList>

export default meta

type Story = StoryObj<typeof meta>

export const Loaded: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsHandlers.members)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Ana Ribeiro')).toBeVisible()
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3)
  },
}

export const Empty_: Story = {
  name: 'Empty',
  beforeEach: ({ msw }) => {
    msw.use(settingsHandlers.membersEmpty)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByText('Nenhum membro ainda')).toBeVisible()
  },
}

export const Failed: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsHandlers.membersError)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      await canvas.findByText('Não foi possível carregar os membros'),
    ).toBeVisible()
  },
}

export const Pending: Story = {
  beforeEach: ({ msw }) => {
    msw.use(settingsHandlers.membersPending)
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByLabelText('Carregando membros')).toBeVisible()
  },
}
