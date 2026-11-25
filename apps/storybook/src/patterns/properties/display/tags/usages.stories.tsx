import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagsProperty } from '@tc96/ui/patterns'
import { expect, within } from 'storybook/test'
import { ptBRPropertyLabels } from '../../properties-labels.ts'
import { TagsCanvas } from './tags-canvas.tsx'
import {
  placementOptions,
  placementsCountLabel,
  tagOptions,
} from './tags-data.ts'
import { StatefulTags } from './tags-layouts.tsx'

const meta = {
  decorators: [TagsCanvas],
  tags: ['!autodocs'],
  title: 'Patterns/Properties/Display/Tags/Usages',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const TaskTags: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The tags of a task, on the [Default](?path=/story/patterns-properties-display-tags-layouts--default) layout: Documentos and Urgente as chips in a list of details, with the add chip after them.',
      },
    },
  },
  render: () => (
    <dl className="grid grid-cols-[6rem_1fr] items-center gap-x-4 gap-y-3 text-sm">
      <dt className="text-muted-foreground">Tarefa</dt>
      <dd>Protocolar recurso no TRT</dd>
      <dt className="text-muted-foreground">Tags</dt>
      <dd>
        <StatefulTags
          ariaLabel="Tags da tarefa"
          initialValue={['documents', 'urgent']}
          options={tagOptions}
        />
      </dd>
    </dl>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByText('Documentos')).toBeVisible()
    await expect(canvas.getByText('Urgente')).toBeVisible()
  },
}

export const CampaignPlacements: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The placements of a campaign, on the [Count](?path=/story/patterns-properties-display-tags-layouts--count) layout with a `badge` surface: two placements read as a count beside the campaign name.',
      },
    },
  },
  render: () => (
    <div className="flex items-center justify-between gap-4 rounded-lg border px-3 py-2 text-sm">
      <span className="font-medium">Lançamento de outono</span>
      <StatefulTags
        ariaLabel="Posicionamentos"
        display="count"
        initialValue={['instagram-feed', 'instagram-stories']}
        options={placementOptions}
        variant="badge"
        labels={{ count: placementsCountLabel }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', {
        name: 'Posicionamentos: 2 posicionamentos',
      }),
    ).toBeVisible()
  },
}

export const ArchivedContact: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The tags of an archived contact, on the [Default](?path=/story/patterns-properties-display-tags-layouts--default) layout, read-only: each tag on a `badge` surface, with no add chip and no remove buttons.',
      },
    },
  },
  render: () => (
    <div className="grid gap-2 text-sm">
      <span className="font-medium">Ana Souza</span>
      <TagsProperty
        placeholder="Adicionar uma tag"
        ariaLabel="Tags do contato"
        options={tagOptions}
        readOnly
        value={['contract', 'return']}
        variant="badge"
        labels={ptBRPropertyLabels.tags}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('group', { name: 'Tags do contato' }),
    ).toHaveTextContent('ContratoRetorno')
  },
}
