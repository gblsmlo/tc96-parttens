import type { Meta, StoryObj } from '@storybook/react-vite'
import { PeopleProperty } from '@tc96/parttens'
import { expect, within } from 'storybook/test'
import { PeopleCanvas } from './people-canvas.tsx'
import { teamOptions } from './people-data.ts'
import { StatefulPeople } from './people-layouts.tsx'

const meta = {
  decorators: [PeopleCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/People/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const MeetingParticipants: Story = {
  render: () => (
    <dl className="grid grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
      <dt className="text-muted-foreground">Reunião</dt>
      <dd>Audiência de conciliação</dd>
      <dt className="text-muted-foreground">Participantes</dt>
      <dd>
        <StatefulPeople
          ariaLabel="Participantes da reunião"
          initialValue={['marina', 'paula']}
          options={teamOptions}
        />
      </dd>
    </dl>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Marina Rocha')).toBeVisible()
    await expect(canvas.getByText('Paula Nunes')).toBeVisible()
  },
}

export const InviteToTask: Story = {
  render: () => (
    <StatefulPeople
      ariaLabel="Membros da tarefa"
      initialValue={[]}
      options={teamOptions}
      placeholder="Convidar pessoas"
      variant="badge"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Convidar pessoas' }),
    ).toBeVisible()
  },
}

export const DocumentAccess: Story = {
  render: () => (
    <div className="grid gap-2 text-sm">
      <span className="font-medium">Com acesso</span>
      <PeopleProperty
        ariaLabel="Pessoas com acesso ao contrato"
        options={teamOptions}
        readOnly
        value={['marina', 'tiago', 'rafael']}
        variant="badge"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('group', {
        name: 'Pessoas com acesso ao contrato',
      }),
    ).toBeVisible()
  },
}
