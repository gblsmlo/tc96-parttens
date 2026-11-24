import type { Meta, StoryObj } from '@storybook/react-vite'
import { SelectProperty } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { SelectCanvas } from './select-canvas.tsx'
import {
  activityOptions,
  frequencyOptions,
  meetingTemplateGroups,
} from './select-data.ts'
import { StatefulSelect } from './select-layouts.tsx'

const meta = {
  decorators: [SelectCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Select/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const ActivityType: Story = {
  render: () => (
    <dl className="grid w-80 grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
      <dt className="text-muted-foreground">Atividade</dt>
      <dd>Retorno sobre a proposta</dd>
      <dt className="text-muted-foreground">Tipo</dt>
      <dd>
        <StatefulSelect
          ariaLabel="Tipo da atividade"
          initialValue="call"
          options={activityOptions}
          variant="plain"
        />
      </dd>
    </dl>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', {
        name: 'Tipo da atividade: Ligação',
      }),
    ).toBeVisible()
  },
}

export const MeetingTemplate: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">Modelo</span>
      <StatefulSelect
        ariaLabel="Modelo"
        emptyOptionLabel="Sem modelo"
        groups={meetingTemplateGroups}
        initialValue={null}
        placeholder="Escolher modelo"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', { name: 'Modelo' }),
    ).toHaveTextContent('Escolher modelo')
  },
}

export const Frequency: Story = {
  render: () => (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">Repetir</span>
      <StatefulSelect
        ariaLabel="Frequência"
        emptyOptionLabel="Não repete"
        initialValue="weekly"
        options={frequencyOptions}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('combobox', {
        name: 'Frequência: Semanalmente',
      }),
    ).toBeVisible()
  },
}

export const ArchivedActivity: Story = {
  render: () => (
    <div className="grid w-80 gap-2 rounded-lg border p-4 text-sm">
      <span className="font-medium">Visita ao cliente</span>
      <span className="text-muted-foreground">Arquivada em 12/03/2026</span>
      <SelectProperty
        ariaLabel="Tipo da atividade"
        fallback="Tipo removido"
        options={activityOptions}
        value="visit"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Tipo da atividade: Tipo removido',
      }),
    ).toBeVisible()
  },
}
