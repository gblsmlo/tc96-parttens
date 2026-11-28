import type { Meta, StoryObj } from '@storybook/react-vite'
import { RecordGroup10 as RecordGroup10Block } from '@tc96/ui/blocks/application/record-group/record-group-10'
import { expect, within } from 'storybook/test'
import { activityEntries, activityLabels } from '../fixtures/activity.ts'

function RecordActivity() {
  return (
    <RecordGroup10Block
      entries={activityEntries}
      labels={activityLabels}
      onViewAll={() => undefined}
    />
  )
}

const meta = {
  component: RecordActivity,
  decorators: [
    (Story) => (
      <div className="w-105 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'centered' },
  tags: ['!autodocs'],
  title: 'Blocks/Application/Record Group/RecordGroup10',
} satisfies Meta<typeof RecordActivity>

export default meta

type Story = StoryObj<typeof meta>

export const RecordGroup10: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'What changed on the record, newest first, in an inset group: each entry (id, actor, verb, optional subject, preposition and object as plain strings, and a datetime with its label) renders with the author avatar, a sentence with the names in ink and the verbs muted, and a `time` in the trailing slot. The view-all action in the group header only renders when `onViewAll` is passed. Everything is read-only.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const activity = within(
      within(canvasElement).getByRole('region', { name: 'Atividade' }),
    )

    await expect(
      Array.from(
        canvasElement.querySelectorAll('[data-slot="record-group-item-title"]'),
        (title) => title.textContent,
      ),
    ).toEqual([
      'Gabriel Melo alterou Empresa para PayPal',
      'Gabriel Melo alterou 2 atributos',
      'Gabriel Melo criou Pessoa',
    ])
    await expect(
      Array.from(canvasElement.querySelectorAll('time'), (time) =>
        time.getAttribute('datetime'),
      ),
    ).toEqual(['2026-09-09T14:20', '2026-09-09T14:18', '2026-09-09T14:15'])
    await expect(
      activity.getByRole('button', { name: 'Ver tudo' }),
    ).toBeVisible()
  },
}
