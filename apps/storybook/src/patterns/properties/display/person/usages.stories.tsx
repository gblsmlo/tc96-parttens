import type { Meta, StoryObj } from '@storybook/react-vite'
import { PersonProperty, PersonPropertyBadge } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { PersonCanvas } from './person-canvas.tsx'
import { lawFirmOptions, personOptions } from './person-data.ts'
import { StatefulPerson } from './person-layouts.tsx'

const meta = {
  decorators: [PersonCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Person/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TaskAssignee: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The assignee of a task, on the [Default](?path=/story/patterns-properties-display-person-layouts--default) layout: avatar and name in a list of details, opening the people of the law firm.',
      },
    },
  },
  render: () => (
    <dl className="grid w-80 grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
      <dt className="text-muted-foreground">Tarefa</dt>
      <dd>Protocolar recurso no TRT</dd>
      <dt className="text-muted-foreground">Responsável</dt>
      <dd>
        <StatefulPerson
          ariaLabel="Responsável"
          initialValue="marina"
          options={lawFirmOptions}
          placeholder="Sem responsável"
        />
      </dd>
    </dl>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', {
        name: 'Responsável: Marina Rocha',
      }),
    ).toBeVisible()
  },
}

export const AccountOwner: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The owner of an account, on the [Default](?path=/story/patterns-properties-display-person-layouts--default) layout, with the list aligned to the start of the trigger and 8px below it.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">Dono da conta</span>
      <StatefulPerson
        ariaLabel="Dono"
        dropdownPlacement={{ align: 'start', side: 'bottom', sideOffset: 8 }}
        initialValue="ana"
        options={personOptions}
        placeholder="Sem dono"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', {
        name: 'Dono: Ana Martins',
      }),
    ).toBeVisible()
  },
}

export const CardAvatars: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The assignees of task cards, on the [Avatar Only Value](?path=/story/patterns-properties-display-person-layouts--avatar-only-value) layout, read-only: one avatar per card, and a user icon on the card with no one set.',
      },
    },
  },
  render: () => (
    <ul className="grid w-80 gap-2 text-sm">
      {[
        { assignee: 'marina', title: 'Revisar contrato social' },
        { assignee: 'tiago', title: 'Juntar procuração' },
        { assignee: null, title: 'Agendar perícia' },
      ].map((task) => (
        <li
          className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2"
          key={task.title}
        >
          {task.title}
          <PersonProperty
            placeholder="Sem responsável"
            ariaLabel="Responsável"
            display="avatar"
            options={lawFirmOptions}
            readOnly
            value={task.assignee}
            variant="plain"
          />
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Responsável: Sem responsável',
      }),
    ).toBeInTheDocument()
  },
}

export const CreatedBy: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Who created a record, on the [Default](?path=/story/patterns-properties-display-person-layouts--default) layout as a read-only `PersonPropertyBadge` with a `plain` surface: a person without a photo shows the initials.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">Criado por</span>
      <PersonPropertyBadge
        placeholder="Sem responsável"
        ariaLabel="Criado por: Paula Nunes"
        option={lawFirmOptions[2] ?? null}
        variant="plain"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Criado por: Paula Nunes',
      }),
    ).toBeVisible()
  },
}
