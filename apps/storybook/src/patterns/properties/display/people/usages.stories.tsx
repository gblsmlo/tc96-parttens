import type { Meta, StoryObj } from '@storybook/react-vite'
import { PeopleProperty } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
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
  parameters: {
    docs: {
      description: {
        story:
          'The participants of a meeting, on the [Default](?path=/story/patterns-properties-display-people-layouts--default) layout: two people as chips in a list of details, with the `+` chip after them.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story:
          'Inviting people to a task, on the [Default](?path=/story/patterns-properties-display-people-layouts--default) layout with a `badge` frame: no one applied yet, so the add chip reads Convidar pessoas.',
      },
    },
  },
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

export const TaskAssignees: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The assignees of a task, on the [Stack](?path=/story/patterns-properties-display-people-layouts--stack) layout: three people as stacked avatars with the count from `labels.count`, as in `Blocks/Data/Tasks`.',
      },
    },
  },
  render: () => (
    <StatefulPeople
      ariaLabel="Responsáveis"
      display="stack"
      initialValue={['marina', 'tiago', 'paula']}
      labels={{
        count: (count) =>
          `${count} ${count === 1 ? 'responsável' : 'responsáveis'}`,
      }}
      options={teamOptions}
      placeholder="Sem responsável"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Responsáveis: 3 responsáveis',
      }),
    ).toBeVisible()
  },
}

export const DocumentAccess: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Who has access to a contract, on the [Default](?path=/story/patterns-properties-display-people-layouts--default) layout, read-only: each person on a `badge` surface, with no add chip and no remove buttons.',
      },
    },
  },
  render: () => (
    <div className="grid gap-2 text-sm">
      <span className="font-medium">Com acesso</span>
      <PeopleProperty
        placeholder="Adicionar pessoa"
        ariaLabel="Pessoas com acesso ao contrato"
        options={teamOptions}
        readOnly
        value={['marina', 'tiago', 'rafael']}
        variant="badge"
        labels={ptBRPropertyLabels.people}
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
